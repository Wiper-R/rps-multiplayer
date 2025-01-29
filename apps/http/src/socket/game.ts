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
import logger from "../lib/logger";
import db from "../lib/db";

export default class Game {
  private _id: string;
  private _players: Player[] = [];
  private _ready: boolean = false;
  readonly moves: Record<string, GameDef.PlayerMove> = {};

  constructor(id: string) {
    this._id = id;
  }

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

  async addPlayer(player: Player) {
    if (this.players.length >= MAX_PLAYERS) {
      throw new Error("Game is full");
    }
    this._players.push(player);
    this.registerPlayerEvents(player);
    this.broadcast(PLAYER_JOINED, player.toJson() as GameDef.PlayerJoined);
    logger.info(`Player ${player.id} joined game ${this.id}`);

    if (this.players.length == MAX_PLAYERS) {
      this._ready = true;
      const history: Record<string, number> = {};
      await Promise.all(
        this.players.map(async (p) => {
          history[p.id] = await db.gameHistory.count({
            where: {
              playerIds: {
                hasEvery: this.players.map((p) => p.id),
              },
              winnerId: p.id,
            },
          });
        }),
      );
      this.broadcast(GAME_READY, {
        game: this.toJson(),
        history,
      } as GameDef.GameReady);

      logger.info(`Game ${this.id} is ready`);
      await db.gameHistory.update({
        where: {
          id: this.id,
        },
        data: { playerIds: this.players.map((p) => p.id) },
      });
    }
  }

  removePlayer(player: Player) {
    this._players = this._players.filter((p) => p.id != player.id);
    this.broadcast(PLAYER_LEFT, player.toJson() as GameDef.PlayerLeft);
    logger.info(`Player ${player.id} left game ${this.id}`);
  }

  async useMove(player: Player, move: GameDef.PlayerMove) {
    if (
      this.players.length < MAX_PLAYERS ||
      !this.ready ||
      this.moves[player.id]
    ) {
      return;
    }
    this.moves[player.id] = move;

    const opponent = this.players.find((p) => p.id != player.id);
    if (!opponent) {
      return;
    }
    const completed = Object.keys(this.moves).length == MAX_PLAYERS;
    logger.info(`Player ${player.id} used move ${move}`);

    if (completed) {
      const winnerId = this.calculateWinner();
      await db.gameHistory.update({
        where: { id: this.id },
        data: {
          moves: this.moves,
          completedAt: new Date(),
          winnerId,
        },
      });
      this.broadcast(GAME_RESULT, {
        moves: this.moves,
        winnerId,
      } as GameDef.GameResult);
      logger.info(`Game ${this.id} result sent`);
    } else {
      await db.gameHistory.update({
        where: { id: this.id },
        data: { moves: this.moves },
      });
    }
  }

  toJson(): GameDef.Game {
    return {
      id: this.id,
      players: this.players.map((player) => player.toJson()),
    };
  }

  calculateWinner(): string | null {
    const [p1, p2] = this.players;
    if (this.moves[p1.id] == this.moves[p2.id]) {
      return null;
    }

    const p1Move = this.moves[p1.id];
    const p2Move = this.moves[p2.id];

    if (
      (p1Move == "rock" && p2Move == "scissors") ||
      (p1Move == "paper" && p2Move == "rock") ||
      (p1Move == "scissors" && p2Move == "paper")
    ) {
      return p1.id;
    }

    return p2.id;
  }
}
