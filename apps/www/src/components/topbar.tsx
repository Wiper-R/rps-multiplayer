import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useGame } from "@/providers/game";
import { useEffect, useState } from "react";

export default function Topbar() {
  const { data } = authClient.useSession();
  const { otherPlayer } = useGame();
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  function Avatar({ src, name }: { src?: string | null; name?: string }) {
    return (
      <div
        className={cn(
          "w-10 h-10 overflow-hidden shrink-0",
          hasScrolled && "w-8 h-8",
        )}
      >
        {src ? (
          <img src={src} className="rounded-full w-full h-full" />
        ) : (
          <span>{name}</span>
        )}
      </div>
    );
  }
  return (
    <header
      className={cn(
        "p-4 flex justify-between sticky top-0 z-50 from-gray-900/80 to-gray-800/80 items-center transition-all gap-4",
        hasScrolled && "p-2 text-sm bg-gradient-to-b backdrop-blur-sm",
      )}
    >
      <div className="flex gap-2 text-gray-200 items-center">
        <Avatar src={data?.user.image} />
        <div className="flex flex-col justify-center">
          <span>{data?.user.name}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-white">VS</span>
      <div className="flex gap-2 text-gray-200 items-center flex-row-reverse text-right">
        {otherPlayer ? (
          <>
            <Avatar src={otherPlayer.image} />
            <div className="flex flex-col justify-center">
              <span>{otherPlayer.name}</span>
            </div>
          </>
        ) : (
          <span>Waiting for other player</span>
        )}
      </div>
    </header>
  );
}
