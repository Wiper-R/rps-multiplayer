import Game from "@/components/Game";
import LoginModal from "@/components/LoginModal";
import { authClient } from "@/lib/auth-client";
import { createPortal } from "react-dom";

export default function Main() {
  const { isPending, data } = authClient.useSession();

  if (isPending || !data)
    return createPortal(<LoginModal />, document.getElementById("portal")!);

  return <Game />;
}
