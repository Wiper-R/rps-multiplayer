import { GAME_READY } from "@repo/types/event";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | undefined>(undefined);
export default function SocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    if (socket) return;
    const conn = io();
    conn.on(GAME_READY, () => {
      console.log("Game is ready");
    });

    setSocket(conn);

    return () => {
      conn.off(GAME_READY);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

function useSocket() {
  const context = React.useContext(SocketContext);
  return context;
}

export { SocketProvider, useSocket };
