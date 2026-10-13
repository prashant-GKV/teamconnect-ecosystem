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
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-secondary text-secondary-foreground border-transparent",
        primary:   "bg-primary/10 text-primary border-primary/20",
        success:   "bg-success-subtle text-success border-success/20",
        warning:   "bg-warning-subtle text-warning border-warning/20",
        danger:    "bg-danger-subtle text-danger border-danger/20",
        info:      "bg-info-subtle text-info border-info/20",
        muted:     "bg-muted text-muted-foreground border-transparent",
        outline:   "bg-transparent border-border text-foreground",
        category:  "scope-chip-category",
        project:   "scope-chip-project",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
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
  className?: string;
}

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, icon: Tag, variant: "default" as const };
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className={className}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

// ── ScopeChip ─────────────────────────────────────────────────

interface ScopeChipProps {
  scope: TaskScope;
  className?: string;
}

export function ScopeChip({ scope, className }: ScopeChipProps) {
  return (
    <Badge
      variant={scope === TaskScope.Category ? "category" : "project"}
      className={cn("font-semibold uppercase tracking-wider text-2xs", className)}
    >
      {scope === TaskScope.Category ? "Category" : "Project"}
    </Badge>
  );
}
