import { cn } from "@/lib/utils";

export default function Avatar({
  src,
  name,
}: {
  src?: string | null;
  name?: string;
}) {
  return (
    <div className={cn("w-10 h-10 overflow-hidden shrink-0")}>
      {src ? (
        <img src={src} className="rounded-full w-full h-full" />
      ) : (
        <span>{name}</span>
      )}
    </div>
  );
}
