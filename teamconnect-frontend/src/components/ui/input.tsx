import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:      string;
  error?:      string;
  hint?:       string;
  leftIcon?:   React.ReactNode;
  rightIcon?:  React.ReactNode;
  required?:   boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, required, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id ?? `input-${defaultId}`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
              "placeholder:text-muted-foreground",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-danger focus-visible:ring-danger",
              leftIcon  && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</p>}
        {!error && hint && <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";