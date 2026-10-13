import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { TaskStatus, RequestStatus, MembershipStatus, ProjectStatus } from "@teamconnect/shared-types";
import { TaskScope } from "@teamconnect/shared-types";
import {
  Circle, UserCheck, Loader, Send, RotateCcw, CheckCircle2,
  Ban, XCircle, Clock, Calendar, Shield, ShieldOff, CalendarX,
  AlertTriangle, FolderOpen, Tag, Pause, Archive,
} from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-secondary text-secondary-foreground border-transparent",
        primary:   "bg-primary/10 text-primary border-primary/25 font-semibold",
        success:   "bg-success-subtle text-success-text border-success/30 font-semibold",
        warning:   "bg-warning-subtle text-warning-text border-warning/30 font-semibold",
        danger:    "bg-danger-subtle text-danger-text border-danger/30 font-semibold",
        info:      "bg-info-subtle text-info-text border-info/30 font-semibold",
        muted:     "bg-muted text-muted-foreground border-border/40",
        outline:   "bg-transparent border-border text-foreground",
        category:  "scope-chip-category",
        project:   "scope-chip-project",
      },
      size: {
        xs: "px-2 py-0.25 text-2xs",
        sm: "px-2 py-0.5 text-2xs",
        md: "px-2.5 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

// ── StatusBadge ───────────────────────────────────────────────

type StatusType = TaskStatus | RequestStatus | MembershipStatus | ProjectStatus;

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; variant: BadgeProps["variant"] }> = {
  // Task
  draft:                { label: "Draft",               icon: Circle,        variant: "muted" },
  assigned:             { label: "Assigned",             icon: UserCheck,     variant: "primary" },
  in_progress:          { label: "In Progress",          icon: Loader,        variant: "info" },
  submitted_for_review: { label: "Submitted for Review", icon: Send,          variant: "warning" },
  revision_requested:   { label: "Revision Requested",   icon: RotateCcw,     variant: "warning" },
  approved:             { label: "Approved",             icon: CheckCircle2,  variant: "success" },
  blocked:              { label: "Blocked",              icon: Ban,           variant: "danger" },
  cancelled:            { label: "Cancelled",            icon: XCircle,       variant: "muted" },
  // Request
  pending:              { label: "Pending",              icon: Clock,         variant: "warning" },
  rejected:             { label: "Rejected",             icon: XCircle,       variant: "danger" },
  expired:              { label: "Expired",              icon: CalendarX,     variant: "muted" },
  // Membership
  pending_approval:         { label: "Pending Approval",      icon: Clock,        variant: "warning" },
  approved_not_yet_active:  { label: "Approved (Not Yet Active)", icon: Calendar, variant: "info" },
  active:                   { label: "Active",                 icon: Shield,       variant: "success" },
  expiring_soon:            { label: "Expiring Soon",          icon: AlertTriangle,variant: "warning" },
  revoked:                  { label: "Revoked",                icon: ShieldOff,    variant: "danger" },
  // Project
  on_hold:              { label: "On Hold",             icon: Pause,         variant: "warning" },
  completed:            { label: "Completed",           icon: CheckCircle2,  variant: "info" },
  archived:             { label: "Archived",            icon: Archive,       variant: "muted" },
};

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  size?: BadgeProps["size"];
  className?: string;
}

export function StatusBadge({ status, showIcon = true, size, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, icon: Tag, variant: "default" as const };
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} size={size} className={className}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

// ── ScopeChip ─────────────────────────────────────────────────

interface ScopeChipProps {
  scope: TaskScope;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function ScopeChip({ scope, size = "xs", className }: ScopeChipProps) {
  const sizeClass = size === "xs" ? "text-2xs px-2 py-0.5" : size === "md" ? "text-xs px-3 py-1" : "text-xs px-2.5 py-0.5";
  return (
    <Badge
      variant={scope === TaskScope.Category ? "category" : "project"}
      className={cn("font-semibold uppercase tracking-wider", sizeClass, className)}
    >
      {scope === TaskScope.Category ? "Category" : "Project"}
    </Badge>
  );
}
