import { createPortal } from "react-dom";
import Button from "./button";
import { useGame } from "@/providers/game";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "react-query";
import httpClient from "@/lib/http-client";

type Page = "main" | "profile" | "leaderboard";

export default function MainMenu() {
  const { joinGame } = useGame();
  const [page, setPage] = useState<Page>("main");
  function Menu() {
    return (
      <div className="flex flex-col gap-4 flex-wrap">
        <Button onClick={() => joinGame()}>Join Now</Button>
        <Button onClick={() => setPage("profile")}>Profile</Button>
        <Button onClick={() => setPage("leaderboard")}>Leaderboard</Button>
        <Button
          containerClassName="border-red-400 text-red-400"
          onClick={() => authClient.signOut()}
        >
          Logout
        </Button>
        <p className="text-sm">
          There is no way to join with the player you desire, the game is made
          that way. Ofcourse you can try your luck by joining at same time.
        </p>
      </div>
    );
  }

  function Profile() {
    const { data, isLoading } = useQuery({
      async queryFn() {
        const res = await httpClient.get("/profile");
        return res.data;
      },
      cacheTime: 0,
    });
    const session = authClient.useSession();
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <img
              src={session.data?.user.image || ""}
              alt="profile"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xl font-semibold">
                {session.data?.user.name}
              </span>
              <span className="text-xs">{session.data?.user.id}</span>
            </div>
          </div>
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <div className="flex gap-2 flex-col">
              <span>Wins: {data.wins}</span>
              <span>Losses: {data.losses}</span>
              <span>Draws: {data.draws}</span>
            </div>
          )}
        </div>
        <Button onClick={() => setPage("main")}>Back</Button>
      </div>
    );
  }

  function Leaderboard() {
    const { data, isLoading } = useQuery({
      async queryFn() {
        const res = await httpClient.get("/leaderboard");
        return res.data;
      },
      staleTime: 0,
      queryKey: "leaderboard",
    });
    return (
      <div className="flex flex-col gap-4 w-full">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <div className="flex flex-col gap-4">
            {data.map((entry: any, index: number) => (
              <div
                key={entry.user.id}
                className="flex items-center gap-8 justify-between border border-gray-300 p-2 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span>{index + 1}</span>
                  <img
                    src={entry.user.image}
                    alt="profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span>{entry.user.name}</span>
                </div>
                <span className="font-semibold text-xl">{entry.wins}</span>
              </div>
            ))}
          </div>
        )}
        <Button onClick={() => setPage("main")}>Back</Button>
      </div>
    );
  }
  return createPortal(
    <div className="flex items-center flex-col gap-4 text-white bg-slate-900/40 border border-gray-300 backdrop-blur-md p-10 rounded  md:min-w-[400] w-[520px] max-w-full mx-4">
      <div className="text-2xl font-semibold mb-10">
        {page === "main"
          ? "Main Menu"
          : page === "profile"
            ? "Profile"
            : "Leaderboard"}
      </div>
      {page === "main" && <Menu />}
      {page === "profile" && <Profile />}
      {page === "leaderboard" && <Leaderboard />}
    </div>,
    document.getElementById("portal")!,
  );
}
