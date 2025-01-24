import Triangle from "@/components/Triangle/index";
import { authClient } from "@/lib/auth-client";

export default function Game() {
  const { isPending, data } = authClient.useSession();
  if (isPending) return <div className="text-6xl">Loading...</div>;
  // return (
  //   <div>
  //     <div className="text-4xl text-red-500">
  //       {data?.user.name} <div>{data?.user.id}</div>
  //     </div>
  //     <button onClick={async () => await authClient.signOut()}>Logout</button>
  //   </div>
  // );
  return <Triangle />;
}
