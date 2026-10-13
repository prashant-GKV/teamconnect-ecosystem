import * as React from "react";
import { cn } from "@/lib/cn";

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0] ?? "").join("").toUpperCase().slice(0, 2);
}

// Deep, accessible color palette meeting WCAG AA (>= 5:1 contrast against white text)
function hashColor(name: string) {
  const colors = [
    "bg-violet-800", "bg-blue-800", "bg-teal-800", "bg-indigo-800",
    "bg-rose-800", "bg-amber-900", "bg-emerald-800", "bg-cyan-900",
  ];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + (hash << 5) - hash;
  return colors[Math.abs(hash) % colors.length] ?? "bg-slate-800";
}

interface AvatarProps {
  user?: { name: string; avatarUrl?: string | null };
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showTooltip?: boolean;
  "aria-hidden"?: boolean | "true" | "false";
}

const sizeMap = {
  xs: "h-6 w-6 text-2xs",
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
  xl: "h-12 w-12 text-lg",
};

export function Avatar({ user, name, size = "md", className, "aria-hidden": ariaHidden }: AvatarProps) {
  const sizeClass = sizeMap[size];
  const displayName = user?.name || name || "User";
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-background",
        hashColor(displayName),
        sizeClass,
        className
      )}
      title={displayName}
      aria-label={ariaHidden ? undefined : displayName}
      aria-hidden={ariaHidden}
    >
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt={displayName} className="h-full w-full rounded-full object-cover" />
      ) : (
        getInitials(displayName)
      )}
    </div>
  );
}

interface AvatarStackProps {
  users: { name: string; avatarUrl?: string | null }[];
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}

export function AvatarStack({ users, max = 4, size = "sm", className }: AvatarStackProps) {
  const shown = users.slice(0, max);
  const extra = users.length - max;
  return (
    <div className={cn("flex -space-x-2", className)}>
      {shown.map((u, i) => (
        <Avatar key={i} user={u} size={size} />
      ))}
      {extra > 0 && (
        <div className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full ring-2 ring-background",
          "bg-muted text-muted-foreground font-semibold text-xs",
          sizeMap[size]
        )}>
          +{extra}
        </div>
      )}
    </div>
  );
}
