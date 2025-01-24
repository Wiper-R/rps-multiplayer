import BgTriangle from "@/assets/game/bg-triangle.svg";
import IconPaper from "@/assets/game/icon-paper.svg";
import IconRock from "@/assets/game/icon-rock.svg";
import IconScissors from "@/assets/game/icon-scissors.svg";
import { cn } from "@/lib/utils";
export default function Triangle() {
  return (
    <div className="relative mx-auto flex w-fit pt-40">
      <img src={BgTriangle} className="w-[400px] pointer-events-none" />
      <MoveButton
        imgSrc={IconPaper}
        className="left-0 -translate-x-1/2 -translate-y-1/2 hover:-translate-y-[calc(50%+10px)]"
        color="#eca011"
      />
      <MoveButton
        imgSrc={IconRock}
        className="right-0 translate-x-1/2 -translate-y-1/2 hover:-translate-y-[calc(50%+10px)]"
        color="#dc2f4f"
      />
      <MoveButton
        imgSrc={IconScissors}
        className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hover:translate-y-[calc(50%-10px)]"
        color="#47bbcf"
      />
    </div>
  );
}

function MoveButton({
  imgSrc,
  className,
  color,
}: {
  imgSrc: string;
  className?: string;
  color: string;
}) {
  const staticClass = "shadow-[0_4px_2px_0_rgba(0,0,0,0.2)_inset]";
  const hoveredClass =
    "hover:shadow-[0_4px_2px_0_rgba(0,0,0,0.2)_inset,0_0_0_10px_rgba(255,255,255,0.2),0_0_0_30px_rgba(255,255,255,0.2)]";
  return (
    <button
      className={cn(
        "flex items-center justify-center absolute rounded-full bg-white transition-all duration-200 cursor-pointer",
        staticClass,
        hoveredClass,
        className,
      )}
      style={{
        borderWidth: "20px",
        borderStyle: "solid",
        borderColor: color,
        width: 160,
        height: 160,
        //         boxShadow: `
        // 0 4px 2px 0 rgba(0,0,0, 0.2) inset,
        // 0 0 0 10px rgba(255, 255, 255, 0.2),
        // 0 0 0 30px rgba(255, 255, 255, 0.2)
        // `,
      }}
    >
      <img src={imgSrc} alt="" className="pointer-events-none" />
    </button>
  );
}
