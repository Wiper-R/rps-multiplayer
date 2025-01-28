import { Socket } from "socket.io";
import { SocketClass } from "./socket-class";
import { CREATE_LOBBY, JOIN_LOBBY } from "@repo/constants/events";
import { LobbyManager } from "./lobby-manager";

export class Player implements SocketClass {
  readonly id: string;
  readonly name: string;
  readonly socket: Socket;
  readonly image: string | null;

  constructor({
    id,
    name,
    image,
    socket,
  }: {
    id: string;
    name: string;
    image: string | null;
    socket: Socket;
  }) {
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.image = image;

    this.registerListeners();
  }

  registerListeners(): void {
    this.socket.on(JOIN_LOBBY, (lobbyId?: string) => {
      console.log(lobbyId);
      LobbyManager.join(this, lobbyId);
    });

    this.socket.on(CREATE_LOBBY, (isPrivate = false) => {
      LobbyManager.create(this, isPrivate);
    });
  }

  send(event: string, data: Record<string, any>): void {
    this.socket.emit(event, data);
  }

  destory(): void {
    LobbyManager.leave(this);
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
