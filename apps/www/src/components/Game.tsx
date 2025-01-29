import Triangle from "@/components/Triangle/index";
import { useGame } from "@/providers/game";
import { ResultScreen } from "./result-screen";
import Button from "./button";
import Avatar from "./avatar";
import { authClient } from "@/lib/auth-client";
import MainMenu from "./main-main";

export default function Game() {
  const { gameId, result, leaveGame, otherPlayer, history } = useGame();
  const { data } = authClient.useSession();
  return (
    <div className="flex flex-col flex-grow relative">
      <div className="sticky top-4 z-10 backdrop-blur-3xl border border-white rounded-xl w-fit mx-auto justify-around text-white px-4 py-2 gap-4 text-sm h-[60px] overflow-hidden flex items-center min-w-[200px]">
        {gameId ? (
          <>
            <div className="flex gap-2 text-gray-200 items-center mr-10">
              <Avatar src={data?.user.image} />
              <div className="flex justify-center items-center gap-4">
                <span>{data?.user.name.split(" ")[0]}</span>
                <span className="text-xl font-semibold text-center">
                  [ {history[data!.user.id] || 0} ]
                </span>
              </div>
            </div>
            <div className="absolute left-1/2 h-[200px] w-0.5 bg-white/50 -top-10 rotate-45 -translate-x-[calc(50%+30px)]" />
            {otherPlayer ? (
              <div className="flex gap-2 text-gray-200 items-center ml-10">
                <div className="flex justify-center items-center gap-4">
                  <span className="text-xl font-semibold text-center">
                    [ {history[otherPlayer.id] || 0} ]
                  </span>
                  <span>{otherPlayer.name.split(" ")[0]}</span>
                </div>
                <Avatar src={otherPlayer?.image} />
              </div>
            ) : (
              <span>Waiting for other player</span>
            )}
          </>
        ) : (
          <span>You are currently not in game</span>
        )}
      </div>
      {result ? <ResultScreen result={result} /> : <Triangle />}
      {!gameId ? (
        <MainMenu />
      ) : (
        !result && (
          <div className="p-10 flex flex-row-reverse">
            <Button onClick={leaveGame}>Leave Game</Button>
          </div>
        )
      )}
    </div>
  );
}
