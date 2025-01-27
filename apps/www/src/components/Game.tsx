import Triangle from "@/components/Triangle/index";
import { useGame } from "@/providers/game";
import Topbar from "./topbar";
import { createPortal } from "react-dom";
import { ResultScreen } from "./result-screen";
import Button from "./button";

export default function Game() {
  const { gameId, joinGame, result } = useGame();
  return (
    <div className="flex flex-col flex-grow">
      <Topbar />
      {result ? <ResultScreen result={result} /> : <Triangle />}
      {!gameId &&
        createPortal(
          <div className="flex items-center flex-col gap-4 text-white">
            <div className="text-2xl font-semibold">
              You are not currenly in game
            </div>
            <Button
              className="cursor-pointer  border-white py-2 px-6 rounded-lg border-2"
              onClick={() => joinGame()}
            >
              Join Now
            </Button>
          </div>,
          document.getElementById("portal")!,
        )}
    </div>
  );
}
