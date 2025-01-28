import { authClient } from "@/lib/auth-client";
import {
  CREATE_LOBBY,
  JOIN_LOBBY,
  LOBBY_CREATED,
  LOBBY_JOINED,
  LOBBY_LEFT,
} from "@repo/constants/events";
import { GameDef } from "@repo/types/game";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";

type GameContext = {
  createLobby: () => void;
  joinLobby: (lobbyId: string) => void;
  lobby: GameDef.Lobby | null;
};

const GameContext = createContext<GameContext | undefined>(undefined);

const useSocket = () => {
  const session = authClient.useSession();
  const [socket, setSocket] = useState<Socket>();
  const [lobby, setLobby] = useState<GameDef.Lobby | null>(null);

  useEffect(() => {
    if (!session.data?.user) return;

    const conn = io();
    setSocket(conn);

    conn.onAny((event, ...args) => {
      console.log(event, args);
    });

    conn.on(LOBBY_CREATED, (lobby: GameDef.LobbyCreated) => {
      setLobby(lobby);
    });

    conn.on(LOBBY_JOINED, ({ lobby }: GameDef.LobbyJoined) => {
      setLobby(lobby);
    });

    conn.on(LOBBY_LEFT, ({ lobby, player }: GameDef.LobbyLeft) => {
      if (player.id === session.data?.user.id) {
        setLobby(null);
      } else {
        setLobby({
          ...lobby,
          players: lobby.players.filter((p) => p.id !== player.id),
        });
      }
    });

    return () => {
      conn.disconnect();
    };
  }, [session.data]);

  return { socket, lobby };
};

export default function GameProvider({ children }: PropsWithChildren) {
  const { socket, lobby } = useSocket();

  const createLobby = useCallback(() => {
    if (!socket) throw new Error("Socket not ready");
    socket.emit(CREATE_LOBBY);
  }, [socket]);

  const joinLobby = useCallback(
    (lobbyId: string) => {
      if (!socket) throw new Error("Socket not ready");
      socket.emit(JOIN_LOBBY, lobbyId);
    },
    [socket],
  );

  const contextValue = useMemo(
    () => ({
      createLobby,
      joinLobby,
      lobby,
    }),
    [createLobby, joinLobby, lobby],
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
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
