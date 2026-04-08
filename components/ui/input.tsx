import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/* ── Input: surface-container-highest bg, glow focus per DESIGN.md ── */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl bg-surface-container-highest px-3.5 py-2.5 text-sm placeholder:text-outline-variant transition-all duration-200 focus:outline-none focus:shadow-focus-glow disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{ color: "#2a3434", border: "none" }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
