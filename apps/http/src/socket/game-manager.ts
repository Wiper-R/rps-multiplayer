import { GAME_CREATED } from "@repo/constants/events";
import logger from "../lib/logger";
import Game from "./game";
import Player from "./player";
import { GameDef } from "@repo/types/game";
import db from "../lib/db";

export class GameManager {
  public static instance: GameManager;
  private _games: Game[] = [];
  private _players_to_games: Map<string, Game> = new Map();
  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  static async joinGame(player: Player) {
    const manager = this.getInstance();
    let game = manager._games.find(
      (game) => game.players.length == 1 && !game.ready,
    );
    if (manager._players_to_games.has(player.id)) {
      logger.info(`Player ${player.id} already in game`);
      return;
    }
    if (game) {
      await game.addPlayer(player);
    } else {
      game = await this.createGame(player);
    }

    manager._players_to_games.set(player.id, game);
  }

  static async createGame(player: Player): Promise<Game> {
    const manager = this.getInstance();
    const history = await db.gameHistory.create({
      data: { playerIds: [], moves: {} },
    });
    const game = new Game(history.id);
    logger.info(`Game ${game.id} created`);
    player.sendMessage(GAME_CREATED, { id: game.id } as GameDef.GameCreated);
    game.addPlayer(player);
    manager._games.push(game);
    return game;
  }

  static leaveGame(player: Player) {
    const manager = this.getInstance();
    const game = manager._players_to_games.get(player.id);
    if (!game) return;
    game.removePlayer(player);
    if (game.players.length == 0) {
      manager._games = manager._games.filter((g) => g.id != game.id);
      logger.info(`Game ${game.id} removed`);
    }
    manager._players_to_games.delete(player.id);
  }

  static restartGame(player: Player) {
    this.leaveGame(player);
    this.joinGame(player);
  }
}
