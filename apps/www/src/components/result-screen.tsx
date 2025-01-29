import { authClient } from "@/lib/auth-client";
import { useGame } from "@/providers/game";
import MoveButton from "./move-button";
import { GameDef } from "@repo/types/game";
import { useState } from "react";
import Button from "./button";

export function ResultScreen({ result }: { result: GameDef.GameResult }) {
  const game = useGame();
  const [otherPlayer] = useState(game.otherPlayer!);
  const session = authClient.useSession();
  const userId = session.data?.user.id!;
  const playerMove = result.moves[userId];
  const otherPlayerMove = result.moves[otherPlayer.id];
  return (
    <div className="flex flex-grow items-center justify-center gap-10 flex-col">
      <div className="pointer-events-none flex gap-10 result-animation">
        <MoveButton value={playerMove} />
        <MoveButton value={otherPlayerMove} />
      </div>
      <div className="text-3xl font-semibold text-center text-white">
        {result.winnerId === null
          ? "Draw"
          : result.winnerId === userId
            ? "You Win"
            : "You Lose"}
      </div>
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => game.restart()}>Play Again</Button>
        <Button onClick={() => game.leaveGame()}>Leave Game</Button>
      </div>
    </div>
  );
}
