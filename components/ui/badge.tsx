import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-50 text-primary-700",
        verified: "bg-green-100 text-green-700",
        pending: "bg-amber-100 text-amber-700",
        unverified: "bg-neutral-100 text-neutral-600",
        supervision: "bg-supervision-light text-supervision",
        active: "bg-green-100 text-green-700",
        inactive: "bg-neutral-100 text-neutral-600",
        onHold: "bg-amber-100 text-amber-700",
        error: "bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
