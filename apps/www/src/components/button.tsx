import { ComponentProps } from "react";
import { LucideIcon } from "lucide-react";

type ButtonProps = { icon?: LucideIcon } & ComponentProps<"button">;
export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className="cursor-pointer border-white min-h-[60px] py-2 px-6 rounded-lg border-2 text-white font-semibold text-lg"
      {...props}
    />
  );
}
