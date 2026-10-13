"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

interface Step {
  label:       string;
  description?: string;
}

interface StepperProps {
  steps:    Step[];
  current:  number; // 0-indexed
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <nav aria-label="Progress steps" className={cn("flex items-center gap-0", className)}>
      {steps.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const pending = i > current;
        return (
          <div key={i} className="flex flex-1 items-center gap-0 min-w-0">
            <div className="flex flex-col items-center min-w-0">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-2",
                done    && "bg-primary text-primary-foreground ring-primary",
                active  && "bg-primary text-primary-foreground ring-primary ring-offset-2 ring-offset-background",
                pending && "bg-muted text-muted-foreground ring-muted",
              )}>
                {done ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
              </div>
              <span className={cn("mt-1.5 text-xs font-medium text-center max-w-[80px]",
                active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-px mx-2 mb-5", i < current ? "bg-primary" : "bg-border")} aria-hidden />
            )}
          </div>
        );
      })}
    </nav>
  );
}