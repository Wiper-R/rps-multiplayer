import Game from "@/components/Game";
import LoginModal from "@/components/LoginModal";
import { authClient } from "@/lib/auth-client";

export default function Main() {
  const { isPending, data } = authClient.useSession();

  if (isPending || !data)
    return (
      <div className="flex items-center justify-center flex-grow bg-black/40 backdrop-blur-2xl absolute inset-0">
        {isPending ? <p>Loading...</p> : <LoginModal />}
      </div>
    );

  return <Game />;
}
