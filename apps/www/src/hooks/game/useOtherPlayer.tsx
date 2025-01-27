import { authClient } from "@/lib/auth-client";
import { GAME_READY, PLAYER_JOINED, PLAYER_LEFT } from "@repo/constants/events";
import { GameDef } from "@repo/types/game";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function useOtherPlayer(socket?: Socket) {
  const [otherPlayer, setOtherPlayer] = useState<GameDef.Player>();
  const session = authClient.useSession();
  useEffect(() => {
    if (!socket || !session.data) return;
    socket.on(PLAYER_JOINED, (player: GameDef.PlayerJoined) => {
      if (player.id != session.data?.user.id) setOtherPlayer(player);
    });

    socket.on(GAME_READY, (game: GameDef.GameReady) => {
      game.players.forEach((p) => {
        if (p.id != session.data?.user.id) {
          setOtherPlayer(p);
        }
      });
    });

    socket.on(PLAYER_LEFT, (player: GameDef.PlayerLeft) => {
      if (player.id == otherPlayer?.id) setOtherPlayer(undefined);
    });
  }, [socket, otherPlayer, setOtherPlayer, session]);

  return { otherPlayer, setOtherPlayer };
}
