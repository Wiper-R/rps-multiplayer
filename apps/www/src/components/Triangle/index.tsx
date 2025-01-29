import BgTriangle from "@/assets/game/bg-triangle.svg";
import MoveButton from "../move-button";
export default function Triangle() {
  return (
    <div className="pt-40 p-20 max-w-[600px] w-full mx-auto">
      <div className="relative flex justify-center">
        <img src={BgTriangle} className="w-full pointer-events-none" />
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
    </div>
  );
}
