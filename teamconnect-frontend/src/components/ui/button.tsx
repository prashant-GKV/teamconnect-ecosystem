"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft font-semibold",
        secondary:  "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
        outline:    "border border-border bg-card hover:bg-muted hover:border-primary/30 text-foreground",
        ghost:      "hover:bg-muted text-foreground",
        danger:     "bg-danger text-danger-foreground hover:bg-danger/90 shadow-soft font-semibold",
        "danger-outline": "border border-danger/40 text-danger-text hover:bg-danger/10",
        warning:    "bg-warning text-warning-foreground hover:bg-warning/90 shadow-soft font-semibold",
        "warning-outline": "border border-warning/40 text-warning-text hover:bg-warning/10",
        success:    "bg-success text-success-foreground hover:bg-success/90 shadow-soft font-semibold",
        link:       "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:   "h-8 sm:h-7 px-2.5 text-xs rounded-md",
        sm:   "h-9 sm:h-8 px-3 text-sm rounded-md",
        md:   "h-10 sm:h-9 px-4 text-sm",
        lg:   "h-11 sm:h-10 px-6 text-base",
        xl:   "h-12 px-8 text-base",
        icon: "h-10 w-10 sm:h-9 sm:w-9",
        "icon-sm": "h-9 w-9 sm:h-7 sm:w-7",
        "icon-lg": "h-11 w-11 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
);
Button.displayName = "Button";

export { buttonVariants };
