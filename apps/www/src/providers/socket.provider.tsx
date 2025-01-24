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
    const conn = io();
    setSocket(conn);
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
