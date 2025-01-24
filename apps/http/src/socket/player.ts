import { Record } from "@prisma/client/runtime/library";
import { Socket } from "socket.io";
import { GameManager } from "./game-manager";

export default class Player {
  private _id: string;
  private _socket: Socket;
  constructor(id: string, socket: Socket) {
    this._id = id;
    this._socket = socket;
    GameManager.joinGame(this);
  }

  get id(): string {
    return this._id;
  }

  toJson() {
    return {
      id: this.id,
    };
  }

  get socket(): Socket {
    return this._socket;
  }

  sendMessage(ev: string, message: Record<string, unknown>): void {
    this.socket.emit(ev, message);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  destory(): void {
    GameManager.leaveGame(this);
  }
}
