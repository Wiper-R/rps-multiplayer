import { cn } from "@/lib/utils";
import { useGame } from "@/providers/game";
import { GameDef } from "@repo/types/game";
import IconPaper from "@/assets/game/icon-paper.svg";
import IconRock from "@/assets/game/icon-rock.svg";
import IconScissors from "@/assets/game/icon-scissors.svg";

const MOVE_BUTTONS = {
  rock: {
    img: IconRock,
    color: "#dc2f4f",
  },
  paper: {
    img: IconPaper,
    color: "#eca011",
  },
  scissors: {
    img: IconScissors,
    color: "#47bbcf",
  },
};

export default function MoveButton({
  value,
  className,
}: {
  value: GameDef.PlayerMove;
  className?: string;
}) {
  const { runMove } = useGame();
  const shadowInner = "shadow-[0_4px_2px_0_rgba(0,0,0,0.2)_inset]";
  const shadowOuter = "shadow-[0_-4px_2px_0_rgba(0,0,0,0.5)_inset]";
  const hoveredClass =
    "hover:shadow-[0_0_0_10px_rgba(255,255,255,0.2),0_0_0_30px_rgba(255,255,255,0.2),0_-4px_2px_0_rgba(0,0,0,0.3)_inset]";
  function handleClick() {
    runMove(value);
  }
  return (
    <button
      className={cn(
        "rounded-full p-4.5 size-[140px] shrink-0 transition-all duration-200 cursor-pointer",
        hoveredClass,
        className,
        shadowOuter,
      )}
      style={{
        backgroundColor: MOVE_BUTTONS[value].color,
      }}
      onClick={handleClick}
    >
      <div
        className={cn(
          "p-4 bg-white rounded-full h-full w-full flex items-center justify-center",
          shadowInner,
        )}
      >
        <img
          src={MOVE_BUTTONS[value].img}
          alt=""
          className="pointer-events-none w-8 md:w-12  shrink-0"
        />
      </div>
    </button>
  );
}
