import { authClient } from "@/lib/auth-client";
import {
  GAME_CREATED,
  GAME_READY,
  GAME_RESULT,
  JOIN_GAME,
  LEAVE_GAME,
  RESTART_GAME,
  USE_MOVE,
} from "@repo/constants/events";
import { GameDef } from "@repo/types/game";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import useOtherPlayer from "@/hooks/game/useOtherPlayer";

type GameContext = {
  joinGame: () => void;
  restart: () => void;
  runMove: (move: GameDef.PlayerMove) => void;
  gameId: string | null;
  otherPlayer?: GameDef.Player;
  result: GameDef.GameResult | null;
  history: { [k: string]: number };
  leaveGame: () => void;
};

const GameContext = createContext<GameContext | undefined>(undefined);
export default function GameProvider({ children }: PropsWithChildren) {
  const session = authClient.useSession();
  const [socket, setSocket] = useState<Socket>();
  const [gameId, setGameId] = useState<string | null>(null);
  const [result, setResult] = useState<GameDef.GameResult | null>(null);
  const [history, setHistory] = useState<{ [k: string]: number }>({});
  const { otherPlayer, setOtherPlayer } = useOtherPlayer(socket);
  useEffect(() => {
    if (socket || !session.data?.user) return;
    const conn = io();
    conn.on(GAME_READY, ({ game, history }: GameDef.GameReady) => {
      setGameId(game.id);
      setHistory(history);
    });

    conn.on(GAME_CREATED, (game: GameDef.GameCreated) => {
      setGameId(game.id);
    });

    conn.on(GAME_RESULT, (result: GameDef.GameResult) => {
      setResult(result);
    });

    setSocket(conn);
    return () => {
      conn.disconnect();
    };
  }, [session, setGameId, setSocket, setHistory]);

  function joinGame() {
    socket?.emit(JOIN_GAME);
  }
  function runMove(move: GameDef.PlayerMove) {
    socket?.emit(USE_MOVE, move);
  }

  function leaveGame() {
    setGameId(null);
    setResult(null);
    setOtherPlayer(undefined);
    socket?.emit(LEAVE_GAME);
  }

  function restart() {
    setResult(null);
    setGameId(null);
    setOtherPlayer(undefined);
    socket?.emit(RESTART_GAME);
  }

  return (
    <GameContext.Provider
      value={{
        joinGame,
        runMove,
        gameId,
        otherPlayer,
        result,
        restart,
        history,
        leaveGame,
      }}
    >
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
