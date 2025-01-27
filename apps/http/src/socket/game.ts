import {
  GAME_READY,
  PLAYER_JOINED,
  PLAYER_LEFT,
  GAME_RESULT,
  USE_MOVE,
} from "@repo/constants/events";
import { MAX_PLAYERS } from "@repo/constants/game";
import { GameDef } from "@repo/types/game";
import Player from "./player";
import { v4 as uuid } from "uuid";
import logger from "../lib/logger";

export default class Game {
  private _id: string = uuid();
  private _players: Player[] = [];
  private _ready: boolean = false;

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

  get ready(): boolean {
    return this._ready;
  }

  registerPlayerEvents(player: Player) {
    player.socket.on(USE_MOVE, (move: GameDef.PlayerMove) => {
      this.useMove(player, move);
    });
  }

  unregisterPlayerEvents(player: Player) {
    // player.socket.off(USE_MOVE);
  }

  addPlayer(player: Player) {
    if (this.players.length >= MAX_PLAYERS) {
      throw new Error("Game is full");
    }
    player.move = null;
    this._players.push(player);
    this.registerPlayerEvents(player);
    this.broadcast(PLAYER_JOINED, player.toJson() as GameDef.PlayerJoined);
    logger.info(`Player ${player.id} joined game ${this.id}`);

    if (this.players.length == MAX_PLAYERS) {
      this._ready = true;
      this.broadcast(GAME_READY, this.toJson() as GameDef.GameReady);
      logger.info(`Game ${this.id} is ready`);
    }
  }

  removePlayer(player: Player) {
    this._players = this._players.filter((p) => p.id != player.id);
    this.broadcast(PLAYER_LEFT, player.toJson() as GameDef.PlayerLeft);
    logger.info(`Player ${player.id} left game ${this.id}`);
  }

  useMove(player: Player, move: GameDef.PlayerMove) {
    if (this.players.length < MAX_PLAYERS || !this.ready) {
      return;
    }
    const otherPlayer = this.players.find((p) => p.id != player.id);
    if (!otherPlayer) {
      return;
    }

    player.move = move;
    logger.info(`Player ${player.id} used move ${move}`);

    if (otherPlayer.move) {
      this.broadcast(GAME_RESULT, {
        moves: {
          [player.id]: player.move,
          [otherPlayer.id]: otherPlayer.move,
        },
        winnerId: this.calculateWinner(player, otherPlayer),
      } as GameDef.GameResult);
      logger.info(`Game ${this.id} result sent`);
    }
  }

  toJson(): GameDef.Game {
    return {
      id: this.id,
      players: this.players.map((player) => player.toJson()),
    };
  }

  calculateWinner(player1: Player, player2: Player): string | null {
    if (player1.move == player2.move) {
      return null;
    }

    if (
      (player1.move == "rock" && player2.move == "scissors") ||
      (player1.move == "scissors" && player2.move == "paper") ||
      (player1.move == "paper" && player2.move == "rock")
    ) {
      return player1.id;
    }

    return player2.id;
  }
}
