import { cn } from "@/lib/cn";
import { formatDate, daysUntil, isExpired, isExpiringSoon } from "@/lib/dates";
import { AlertTriangle, CalendarX, Shield } from "lucide-react";

interface MembershipValidityBarProps {
  startAt:  string;
  endAt:    string;
  renewalPending?: boolean;
  className?: string;
}

export function MembershipValidityBar({ startAt, endAt, renewalPending, className }: MembershipValidityBarProps) {
  const expired = isExpired(endAt);
  const soon    = !expired && isExpiringSoon(endAt);
  const days    = daysUntil(endAt);

  const start   = new Date(startAt).getTime();
  const end     = new Date(endAt).getTime();
  const now     = Date.now();
  const pct     = expired ? 100 : Math.min(100, ((now - start) / (end - start)) * 100);

  const barColor = expired ? "bg-danger" : soon ? "bg-warning" : "bg-success";
  const textColor = expired ? "text-danger" : soon ? "text-warning" : "text-muted-foreground";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-mono">{formatDate(startAt)}</span>
        <span className={cn("font-mono", textColor)}>{formatDate(endAt)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        {expired ? (
          <>
            <CalendarX className="h-3.5 w-3.5 text-danger" />
            <span className="text-danger font-medium">
              Access ended{renewalPending ? " — Renewal pending (no access restored until approved)" : ""}
            </span>
          </>
        ) : soon ? (
          <>
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span className="text-warning font-medium">Expires in {days} day{days !== 1 ? "s" : ""}</span>
            {renewalPending && <span className="text-muted-foreground ml-1">· Renewal pending</span>}
          </>
        ) : (
          <>
            <Shield className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">{days} days remaining</span>
          </>
        )}
      </div>
    </div>
  );
}
