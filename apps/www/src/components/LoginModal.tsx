import { authClient } from "@/lib/auth-client";
import Button from "./button";

export default function LoginModal() {
  return (
    <div className="flex flex-col items-center space-y-6 max-w-sm bg-slate-900/40 border-gray-400 border backdrop-blur-md text-white p-4 rounded">
      <h1 className="text-2xl font-bold">Login to play</h1>
      <Button
        onClick={() =>
          authClient.signIn.social({
            provider: "google",
            callbackURL: `${window.location.href}`,
          })
        }
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
