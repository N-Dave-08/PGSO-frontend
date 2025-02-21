import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral text-neutral-content shadow hover:bg-neutral/80",
        primary:
          "border-transparent bg-info text-primary-content hover:bg-info/80",
        secondary:
          "border-transparent bg-secondary text-secondary-content hover:bg-secondary/80",
        success:
          "border-transparent bg-success text-success-content hover:bg-success/80",
        destructive:
          "border-transparent bg-warning text-warning-content shadow hover:bg-warning/80",
        outline: "text-neutral-950",
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
