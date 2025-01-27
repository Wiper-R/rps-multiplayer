import BgTriangle from "@/assets/game/bg-triangle.svg";
import MoveButton from "../move-button";
export default function Triangle() {
  return (
    <div className="relative mx-auto flex w-fit pt-40">
      <img src={BgTriangle} className="w-[400px] pointer-events-none" />
      <MoveButton
        value="paper"
        className="left-0 -translate-x-1/2 -translate-y-1/2 hover:-translate-y-[calc(50%+10px)] absolute"
      />
      <MoveButton
        value="rock"
        className="right-0 translate-x-1/2 -translate-y-1/2 hover:-translate-y-[calc(50%+10px)]  absolute"
      />
      <MoveButton
        value="scissors"
        className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hover:translate-y-[calc(50%-10px)] absolute"
      />
    </div>
  );
}
