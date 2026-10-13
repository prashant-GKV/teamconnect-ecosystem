import { cn } from "@/lib/cn";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  code,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center gap-4", className)}>
      <div className="rounded-full bg-danger-subtle p-4">
        <AlertTriangle className="h-8 w-8 text-danger" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
        {code && <p className="font-mono text-xs text-muted-foreground/60">{code}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
