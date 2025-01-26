import { Record } from "@prisma/client/runtime/library";
import { Socket } from "socket.io";
import { GameManager } from "./game-manager";
import { PlayerMove } from "@repo/types/game";
import { JOIN_GAME } from "@repo/constants/events";

export default class Player {
  private _id: string;
  private _socket: Socket;
  private _move: PlayerMove | null = null;
  constructor(id: string, socket: Socket) {
    this._id = id;
    this._socket = socket;
    this.registerEvents();
  }

  registerEvents(): void {
    this.socket.on(JOIN_GAME, () => {
      GameManager.joinGame(this);
    });
  }

  get id(): string {
    return this._id;
  }

  get move(): PlayerMove | null {
    return this._move;
  }

  set move(move: PlayerMove | null) {
    this._move = move;
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
