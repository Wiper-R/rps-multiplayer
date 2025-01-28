import { MOVE_PAPER, MOVE_ROCK, MOVE_SCISSORS } from "@repo/constants/game";

export declare namespace GameDef {
  export type PlayerMove =
    | typeof MOVE_ROCK
    | typeof MOVE_PAPER
    | typeof MOVE_SCISSORS;

  export type Player = {
    id: string;
    name: string;
    image: string | null;
  };

  export type Lobby = {
    id: string;
    players: Player[];
    ownerId: string;
    isPrivate: boolean;
    isGameStarted: boolean;
  };

  export type LobbyCreated = Lobby;
  export type LobbyJoined = { lobby: Lobby; player: Player };
  export type LobbyLeft = { lobby: Lobby; player: Player };
}
