import Triangle from "@/components/Triangle/index";
import { useGame } from "@/providers/game";
import Topbar from "./topbar";

export default function Game() {
  const { gameId, joinGame } = useGame();
  return (
    <div>
      <Topbar />
      <Triangle />
      {!gameId && (
        <div className="text-white absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center flex-col">
          <div className="flex items-center flex-col gap-4">
            <div className="text-2xl font-semibold">
              You are not currenly in game
            </div>
            <button
              className="cursor-pointer  border-white py-2 px-6 rounded-lg border-2"
              onClick={() => joinGame()}
            >
              Join Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
