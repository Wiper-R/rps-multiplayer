import { useGame } from "@/providers/game";
import Button from "./button";
import { useState } from "react";
import { createPortal } from "react-dom";
import Topbar from "./topbar";
import Triangle from "./Triangle";

export default function Game() {
  const { lobby, game } = useGame();
  if (!lobby) return <LobbyManager />;
  return (
    <div className="relative flex-grow">
      <Topbar />
      <Triangle />
    </div>
  );
}

function LobbyManager() {
  const { createLobby, joinLobby } = useGame();
  const [lobbyId, setLobbyId] = useState("");
  return createPortal(
    <div className="flex gap-4 flex-col flex-wrap items-center">
      <div className="space-y-2 border border-white/10 p-4 rounded-xl h-fit g1">
        <h2 className="text-xl font-semibold">Create a new lobby</h2>
        <p>Start a new game lobby to join and play with others</p>
        <Button onClick={createLobby} className="w-full">
          Create Lobby
        </Button>
      </div>
      <div className="space-y-2 border border-white/10 p-4 rounded-xl h-fit g1">
        <h2 className="text-xl font-semibold">Join a Lobby</h2>
        <p>Enter a lobby ID to join an existing game</p>
        <input
          value={lobbyId}
          onChange={(e) => setLobbyId(e.target.value)}
          placeholder="Lobby ID"
          className="w-full p-4 rounded-xl border-2 border-white text-white min-h-[52px] text-xl capitalize"
        />
        <Button onClick={() => joinLobby(lobbyId)} className="w-full">
          Join Lobby
        </Button>
        <span className="text-sm text-white">
          Keep id blank to join a random lobby
        </span>
      </div>
    </div>,
    document.getElementById("portal")!,
  );
}
