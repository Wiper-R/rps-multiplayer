import { authClient } from "@/lib/auth-client";
// import { useGame } from "@/providers/game";

function Avatar({ src, name }: { src?: string | null; name?: string }) {
  return (
    <div className="w-10 h-10 overflow-hidden">
      {src ? (
        <img src={src} className="rounded-full w-full h-full" />
      ) : (
        <span>{name}</span>
      )}
    </div>
  );
}

export default function Topbar() {
  const { data } = authClient.useSession();
  // const { gameId, state } = useGame();
  return (
    <header className="p-4 flex justify-between">
      <div className="flex gap-2 text-gray-200 items-center">
        <Avatar src={data?.user.image} />
        <div className="flex flex-col justify-center text-xl">
          <span>{data?.user.name}</span>
        </div>
      </div>
      <span className="text-4xl font-bold text-white">VS</span>
      <div className="flex gap-2 text-gray-200 items-center flex-row-reverse text-right">
        <Avatar src={data?.user.image} />
        <div className="flex flex-col justify-center text-xl">
          <span>{data?.user.name}</span>
        </div>
      </div>
    </header>
  );
}
