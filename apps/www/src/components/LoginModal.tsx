import { authClient } from "@/lib/auth-client";
import Button from "./button";

export default function LoginModal() {
  return (
    <div className="flex flex-col items-center space-y-6 max-w-sm bg-white/10 border-gray-400 border backdrop-blur-2xl text-white p-4 rounded">
      <h1 className="text-2xl font-bold">Login to play</h1>
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer w-full max-w-[200px]"
        onClick={() => authClient.signIn.social({ provider: "google" })}
      >
        <span>Login with Google</span>
      </Button>
      <p className="text-sm">
        This game save states such as username, scores and match history, to
        play you have to login
      </p>
    </div>
  );
}
