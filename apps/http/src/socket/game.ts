import { GameDef } from "@repo/types/game";
import { Player } from "./player";
import { SocketClass } from "./socket-class";

export class Game implements SocketClass {
  readonly id: string;
  readonly players: Player[];
  readonly moves: Record<string, GameDef.PlayerMove> = {};

  constructor(id: string, players: Player[]) {
    this.id = id;
    this.players = players;
  }

  broadcast(event: string, data: Record<string, any>): void {
    this.players.forEach((player) => {
      player.send(event, data);
    });
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      players: this.players.map((player) => player.toJson()),
    };
  }
}
