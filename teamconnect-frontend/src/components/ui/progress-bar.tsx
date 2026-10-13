import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger" | "primary";
}

export function ProgressBar({ value, max = 100, className, barClassName, showLabel, label, size = "md", variant = "default" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const variantClass = {
    default: "bg-primary",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger:  "bg-danger",
  }[variant];
  const heightClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }[size];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex-1 rounded-full bg-muted overflow-hidden", heightClass)} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", variantClass, barClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}