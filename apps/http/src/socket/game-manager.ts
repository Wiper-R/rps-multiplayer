import logger from "../lib/logger";
import Game from "./game";
import Player from "./player";

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

  static joinGame(player: Player) {
    const manager = this.getInstance();
    let game = manager._games.find((game) => game.players.length == 1);
    if (manager._players_to_games.has(player.id)) {
      logger.info(`Player ${player.id} already in game`);
      return;
    }
    if (game) {
      game.addPlayer(player);
    } else {
      game = this.createGame(player);
    }

    manager._players_to_games.set(player.id, game);
  }

  static createGame(player: Player): Game {
    const manager = this.getInstance();
    const game = new Game();
    logger.info(`Game ${game.id} created`);
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
}
