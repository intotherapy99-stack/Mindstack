import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:shadow-focus-glow disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] min-h-[44px] sm:min-h-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-primary to-primary-dim text-white hover:scale-[1.02] hover:shadow-glow",
        secondary: "bg-secondary-container text-secondary-on-container hover:brightness-95",
        danger: "bg-accent-500 text-white hover:bg-accent-600",
        ghost: "text-primary hover:bg-surface-container-low",
        link: "text-primary underline-offset-4 hover:underline",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-surface-container-low",
        supervision: "bg-supervision text-white hover:bg-supervision/90",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3 py-1.5 text-sm rounded-xl",
        lg: "h-12 px-6 py-3 text-base rounded-3xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
