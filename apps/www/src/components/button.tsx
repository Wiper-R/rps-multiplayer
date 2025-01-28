import { ComponentProps, PropsWithChildren } from "react";
import { LucideIcon } from "lucide-react";

type ButtonProps = {
  icon?: LucideIcon;
} & ComponentProps<"button">;
export default function Button({
  className,
  children,
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className="cursor-pointer p-px text-white font-semibold text-lg  rounded-2xl overflow-hidden inline-flex items-center justify-center isolate"
      {...props}
    >
      <span className="relative h-full w-full py-2 px-6 button-before flex items-center justify-center rounded-2xl button-after  min-h-[60px] bg-transparent border-2 border-gray-100/20">
        {children}
      </span>
    </button>
  );
}
