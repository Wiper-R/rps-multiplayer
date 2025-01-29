import { MOVE_PAPER, MOVE_ROCK, MOVE_SCISSORS } from "@repo/constants/game";

export declare namespace GameDef {
  export type PlayerMove =
    | typeof MOVE_ROCK
    | typeof MOVE_PAPER
    | typeof MOVE_SCISSORS;

  export type Game = {
    id: string;
    players: Player[];
  };

  export type Player = {
    id: string;
    name: string;
    image: string | null;
  };

  // Events
  export type GameCreated = { id: string };
  export type GameReady = { game: Game; history: { [k: string]: number } };
  export type PlayerJoined = Player;
  export type PlayerLeft = Player;
  export type GameResult = {
    moves: { [k: string]: PlayerMove };
    winnerId: string | null;
  };
}
