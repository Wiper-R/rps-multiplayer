import { Lobby } from "./lobby";
import { v4 as uuidv4 } from "uuid";
import { Player } from "./player";
import { LOBBY_CREATED, LOBBY_LEFT } from "@repo/constants/events";
import { MAX_PLAYERS } from "@repo/constants/game";
import logger from "../lib/logger";
import { GameDef } from "@repo/types/game";

export class LobbyManager {
  private static _instance: LobbyManager;
  readonly lobbiesById: Map<string, Lobby> = new Map();
  readonly lobbiesByPlayer: Map<string, Lobby> = new Map();

  static getInstance(): LobbyManager {
    if (!LobbyManager._instance) {
      LobbyManager._instance = new LobbyManager();
    }

    return LobbyManager._instance;
  }

  static create(player: Player, isPrivate: boolean): void {
    const manager = LobbyManager.getInstance();
    let id = uuidv4();

    while (manager.lobbiesById.get(id)) {
      id = uuidv4();
    }

    const lobby = new Lobby(id, player, isPrivate);
    manager.lobbiesById.set(id, lobby);
    manager.lobbiesByPlayer.set(player.id, lobby);

    player.send(LOBBY_CREATED, lobby.toJson() as GameDef.LobbyCreated);
    logger.info(`Lobby created: ${lobby.id} By: ${player.name} (${player.id})`);
  }

  static leave(player: Player): void {
    const manager = LobbyManager.getInstance();
    const lobby = manager.lobbiesByPlayer.get(player.id);
    if (!lobby) {
      logger.warn(`Player ${player.name} (${player.id}) not in a lobby`);
      return;
    }

    if (lobby.owner.id === player.id) {
      manager.lobbiesById.delete(lobby.id);
      logger.info(
        `Lobby deleted: ${lobby.id} By: ${player.name} (${player.id})`,
      );
      const players = lobby.players.slice();
      players.forEach((player) => {
        manager.lobbiesByPlayer.delete(player.id);
      });
      players.forEach((player) => {
        player.send(LOBBY_LEFT, {
          lobby: lobby.toJson(),
          player: player.toJson(),
        } as GameDef.LobbyLeft);
      });
      return;
    }

    lobby.leave(player);
    manager.lobbiesByPlayer.delete(player.id);
  }

  static join(player: Player, lobbyId?: string): void {
    const manager = LobbyManager.getInstance();
    if (lobbyId) {
      const lobby = manager.lobbiesById.get(lobbyId);
      if (!lobby) throw new Error("Lobby not found");
      lobby.join(player);
      return;
    }
    const lobby = manager.findAvailableLobby();
    if (lobby) {
      lobby.join(player);
      return;
    }
    LobbyManager.create(player, false);
  }

  findAvailableLobby(): Lobby | undefined {
    for (const lobby of this.lobbiesById.values()) {
      if (
        lobby.players.length < MAX_PLAYERS &&
        !lobby.isPrivate &&
        !lobby.isGameStarted
      ) {
        return lobby;
      }
    }
    return undefined;
  }
}
