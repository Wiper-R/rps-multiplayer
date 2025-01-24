import { GAME_READY, PLAYER_JOINED, PLAYER_LEFT } from "@repo/types/event";
import Player from "./player";
import { v4 as uuid } from "uuid";
import logger from "../lib/logger";
import { MAX_PLAYERS } from "../constants";
import { GameManager } from "./game-manager";

export default class Game {
  private _id: string = uuid();
  private _players: Player[] = [];

  get id(): string {
    return this._id;
  }

  broadcast(ev: string, message: Record<string, unknown>) {
    this._players.forEach((player) => {
      player.sendMessage(ev, message);
    });
  }

  get players(): Player[] {
    return this._players;
  }

  addPlayer(player: Player, created: boolean = false) {
    if (this.players.length >= MAX_PLAYERS) {
      throw new Error("Game is full");
    }
    this._players.push(player);
    this.broadcast(PLAYER_JOINED, { player: player.toJson(), created });
    logger.info(`Player ${player.id} joined game ${this.id}`);

    if (this.players.length == MAX_PLAYERS) {
      console.log("Game is ready");
      this.broadcast(GAME_READY, { game: this.toJson() });
    }
  }

  removePlayer(player: Player) {
    this._players = this._players.filter((p) => p.id != player.id);
    this.broadcast(PLAYER_LEFT, { player: player.toJson() });
    logger.info(`Player ${player.id} left game ${this.id}`);
  }

  toJson() {
    return {
      id: this.id,
      players: this.players.map((player) => player.toJson()),
    };
  }
}
