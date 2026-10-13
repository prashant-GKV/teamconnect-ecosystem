import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

export function ProgressBar({ value, max = 100, className, barClassName, showLabel, variant = "default" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const variantClass = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger:  "bg-danger",
  }[variant];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", variantClass, barClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}
