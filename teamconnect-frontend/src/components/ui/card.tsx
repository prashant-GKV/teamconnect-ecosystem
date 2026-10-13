import * as React from "react";
import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ className, hover, padding = "md", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-card",
        hover && "cursor-pointer hover:shadow-card-hover hover:border-primary/30 transition-[box-shadow,border-color] duration-150",
        padding === "none" && "p-0",
        padding === "sm"   && "p-3",
        padding === "md"   && "p-5",
        padding === "lg"   && "p-6",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pb-4", className)} {...props} />;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({ as: Comp = "h2", className, ...props }: CardTitleProps) {
  return <Comp className={cn("font-heading text-lg font-semibold leading-tight tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2 pt-4 border-t border-border", className)} {...props} />;
}
