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
  const staticClass = "shadow-[0_4px_2px_0_rgba(0,0,0,0.2)_inset]";
  const hoveredClass =
    "hover:shadow-[0_4px_2px_0_rgba(0,0,0,0.2)_inset,0_0_0_10px_rgba(255,255,255,0.2),0_0_0_30px_rgba(255,255,255,0.2)]";
  function handleClick() {
    runMove(value);
  }
  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-full bg-white transition-all duration-200 cursor-pointer size-[100px] md:size-[120px] border-[14px]  lg:border-[20px]",
        staticClass,
        hoveredClass,
        className,
      )}
      onClick={handleClick}
      style={{
        borderStyle: "solid",
        borderColor: MOVE_BUTTONS[value].color,
      }}
    >
      <img
        src={MOVE_BUTTONS[value].img}
        alt=""
        className="pointer-events-none w-8 md:w-10 shrink-0"
      />
    </button>
  );
}
