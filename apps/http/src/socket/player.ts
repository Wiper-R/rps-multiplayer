import { Record } from "@prisma/client/runtime/library";
import { Socket } from "socket.io";
import { GameManager } from "./game-manager";
import { GameDef } from "@repo/types/game";
import { JOIN_GAME, LEAVE_GAME, RESTART_GAME } from "@repo/constants/events";

export default class Player {
  private _id: string;
  private _name: string;
  private _image: string | null;
  private _socket: Socket;
  constructor({
    id,
    name,
    socket,
    image,
  }: {
    id: string;
    name: string;
    socket: Socket;
    image: string | null;
  }) {
    this._id = id;
    this._socket = socket;
    this._name = name;
    this._image = image;
    this.registerEvents();
  }

  registerEvents(): void {
    this.socket.on(JOIN_GAME, () => {
      GameManager.joinGame(this);
    });
    this.socket.on(LEAVE_GAME, () => {
      GameManager.leaveGame(this);
    });
    this.socket.on(RESTART_GAME, () => {
      GameManager.restartGame(this);
    });
  }

  get id(): string {
    return this._id;
  }

  toJson(): GameDef.Player {
    return {
      id: this.id,
      name: this._name,
      image: this._image,
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
