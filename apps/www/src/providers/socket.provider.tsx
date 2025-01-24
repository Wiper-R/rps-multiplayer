import { authClient } from "@/lib/auth-client";
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
  const session = authClient.useSession();
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    if (socket || !session.data?.user) return;
    const conn = io();
    conn.on(GAME_READY, () => {
      console.log("Game is ready");
    });

    conn.onAny((event, ...args: any[]) => {
      console.log(event, args);
    });

    setSocket(conn);

    return () => {
      conn.off(GAME_READY);
      conn.disconnect();
    };
  }, [session]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

function useSocket() {
  const context = React.useContext(SocketContext);
  return context;
}

export { SocketProvider, useSocket };
