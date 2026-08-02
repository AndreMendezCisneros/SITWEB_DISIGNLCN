import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "solid",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcs-gold disabled:opacity-50",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-sm",
        variant === "solid" && "bg-lcs-gold text-lcs-black hover:bg-lcs-gold-soft",
        variant === "outline" &&
          "border border-lcs-gold text-lcs-gold hover:bg-lcs-gold hover:text-lcs-black",
        variant === "ghost" && "text-lcs-white hover:text-lcs-gold",
        variant === "dark" && "bg-lcs-black text-lcs-white hover:bg-lcs-charcoal",
        className
      )}
      {...props}
    />
  );
}
