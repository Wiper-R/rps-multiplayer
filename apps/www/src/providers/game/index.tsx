import { authClient } from "@/lib/auth-client";
import { GAME_READY, JOIN_GAME, USE_MOVE } from "@repo/constants/events";
import { PlayerMove } from "@repo/types/game";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type GameContext = {
  joinGame: () => void;
  runMove: (move: PlayerMove) => void;
  gameId: string | null;
  state: GameState;
};

type ResultType = {
  type: "win" | "lose" | "draw";
};

type GameState = "waiting" | "playing" | "result";

type Player = {
  id: string;
  name: string;
  image?: string;
};

const GameContext = createContext<GameContext | undefined>(undefined);
export default function GameProvider({ children }: PropsWithChildren) {
  const session = authClient.useSession();
  const [socket, setSocket] = useState<Socket>();
  const [result, setResult] = useState<ResultType>();
  const [gameId, setGameId] = useState<string | null>(null);
  const [state, setState] = useState<GameState>("playing");
  const [otherPlayer, setOtherPlayer] = useState<Player>();
  useEffect(() => {
    if (socket || !session.data?.user) return;
    const conn = io();
    conn.onAny((event, ...args: any[]) => {
      console.log(event, args);
    });
    conn.on(GAME_READY, ({ game }: { game: { id: string } }) => {
      resetState();
      setGameId(game.id);
    });
    setSocket(conn);
    return () => {
      conn.disconnect();
    };
  }, [session]);

  function joinGame() {
    socket?.emit(JOIN_GAME);
  }
  function runMove(move: PlayerMove) {
    socket?.emit(USE_MOVE, { move });
  }

  function resetState() {
    setResult(undefined);
  }

  return (
    <GameContext.Provider value={{ joinGame, runMove, gameId, state }}>
      {children}
    </GameContext.Provider>
  );
}

function useGame() {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export { GameProvider, useGame };
