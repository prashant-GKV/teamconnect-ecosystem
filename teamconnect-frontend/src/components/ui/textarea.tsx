import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:    string;
  error?:    string;
  hint?:     string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, required, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id ?? `textarea-${defaultId}`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
            "placeholder:text-muted-foreground resize-y",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-150",
            error && "border-danger focus-visible:ring-danger",
            className
          )}
          {...props}
        />
        {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";