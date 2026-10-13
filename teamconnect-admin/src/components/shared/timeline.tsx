import { cn } from "@/lib/cn";
import { formatTimeAgo } from "@/lib/dates";
import type { LucideIcon } from "lucide-react";
import { Activity } from "lucide-react";

interface TimelineEvent {
  id:        string;
  icon?:     LucideIcon;
  title:     string;
  detail?:   string;
  actor?:    string;
  timestamp: string;
  variant?:  "default" | "success" | "warning" | "danger" | "info";
}

const variantClasses = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger:  "bg-danger-subtle text-danger",
  info:    "bg-info-subtle text-info",
};

interface TimelineProps {
  events:    TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-0", className)} aria-label="Activity timeline">
      {events.map((e, idx) => {
        const Icon = e.icon ?? Activity;
        const color = variantClasses[e.variant ?? "default"];
        return (
          <li key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
            {idx < events.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-border" aria-hidden />
            )}
            <div className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", color)}>
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </div>
            <div className="flex-1 pt-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{e.title}</p>
              {e.detail && <p className="text-xs text-muted-foreground mt-0.5">{e.detail}</p>}
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {e.actor && <span>{e.actor}</span>}
                {e.actor && <span aria-hidden>·</span>}
                <time dateTime={e.timestamp}>{formatTimeAgo(e.timestamp)}</time>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
