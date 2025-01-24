import { authClient } from "@/lib/auth-client";

export default function Signup() {
  return (
    <div onClick={() => authClient.signIn.social({ provider: "google" })}>
      <div className="text-4xl text-red-500">Signup</div>
    </div>
  );
}
