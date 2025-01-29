import { createPortal } from "react-dom";
import Button from "./button";
import { useGame } from "@/providers/game";

export default function MainMenu() {
  const { joinGame } = useGame();
  return createPortal(
    <div className="flex items-center flex-col gap-4 text-white bg-slate-900/40 border border-gray-300 backdrop-blur-md p-10 rounded max-w-[520px]">
      <div className="text-2xl font-semibold">You are not currenly in game</div>
      <div className="flex flex-col gap-4 flex-wrap">
        <Button
          className="cursor-pointer  border-white py-2 px-6 rounded-lg border-2"
          onClick={() => joinGame()}
        >
          Join Now
        </Button>
        <Button
          className="cursor-pointer  border-white py-2 px-6 rounded-lg border-2"
          onClick={() => {}}
        >
          Profile
        </Button>
        <Button
          className="cursor-pointer  border-white py-2 px-6 rounded-lg border-2"
          onClick={() => {}}
        >
          Leaderboard
        </Button>
        <p className="text-sm">
          There is no way to join with the player you desire, the game is made
          that way. Ofcourse you can try your luck by joining at same time.
        </p>
      </div>
    </div>,
    document.getElementById("portal")!,
  );
}
