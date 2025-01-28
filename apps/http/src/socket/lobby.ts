import { LOBBY_JOINED, LOBBY_LEFT } from "@repo/constants/events";
import { Game } from "./game";
import { Player } from "./player";
import { SocketClass } from "./socket-class";
import db from "../lib/db";
import { GameDef } from "@repo/types/game";
import { LobbyManager } from "./lobby-manager";
import logger from "../lib/logger";

export class Lobby implements SocketClass {
  readonly id: string;
  private _game: Game | null = null;
  readonly players: Player[] = [];
  readonly isPrivate: boolean;
  readonly owner: Player;

  get game(): Game | null {
    return this._game;
  }

  get isGameStarted(): boolean {
    return this._game !== null;
  }

  constructor(id: string, owner: Player, isPrivate: boolean) {
    this.id = id;
    this.owner = owner;
    this.isPrivate = isPrivate;
    this.players.push(owner);
  }

  join(player: Player): void {
    this.players.push(player);
    this.broadcast(LOBBY_JOINED, {
      player: player.toJson(),
      lobby: this.toJson(),
    } as GameDef.LobbyJoined);
    LobbyManager.getInstance().lobbiesByPlayer.set(player.id, this);
    logger.info(`Player ${player.name} (${player.id}) joined lobby ${this.id}`);
  }

  leave(player: Player): void {
    this.broadcast(LOBBY_LEFT, {
      player: player.toJson(),
      lobby: this.toJson(),
    } as GameDef.LobbyLeft);

    this.players.splice(this.players.indexOf(player), 1);
    logger.info(`Player ${player.name} (${player.id}) left lobby ${this.id}`);
  }

  async startGame(): Promise<void> {
    const history = await db.gameHistory.create({ data: { moves: {} } });
    this._game = new Game(history.id, this.players);
  }

  broadcast(event: string, data: Record<string, any>): void {
    this.players.forEach((player) => {
      player.send(event, data);
    });
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      players: this.players.map((player) => player.toJson()),
      isPrivate: this.isPrivate,
      isGameStarted: this.isGameStarted,
      ownerId: this.owner.id,
    };
  }
}
