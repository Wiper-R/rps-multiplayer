import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {} & ComponentProps<"button">;

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "p-4 min-h-[52px] border-white border-2 rounded-xl text-white hover:border-gray-400 hover:text-gray-400 cursor-pointer transition-colors",
        className,
      )}
      {...props}
    ></button>
  );
}
