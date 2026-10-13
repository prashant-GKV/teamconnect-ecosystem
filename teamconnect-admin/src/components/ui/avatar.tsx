import * as React from "react";
import { cn } from "@/lib/cn";
import type { UserSummary } from "@teamconnect/shared-types";

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0] ?? "").join("").toUpperCase().slice(0, 2);
}

function hashColor(name: string) {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-teal-500", "bg-indigo-500",
    "bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500",
  ];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + (hash << 5) - hash;
  return colors[Math.abs(hash) % colors.length] ?? "bg-slate-500";
}

interface AvatarProps {
  user?: Pick<UserSummary, "name" | "avatarUrl">;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: "h-6 w-6 text-2xs",
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
  xl: "h-12 w-12 text-lg",
};

export function Avatar({ user, name, size = "md", className }: AvatarProps) {
  const sizeClass = sizeMap[size];
  const displayName = user?.name || name || "User";
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-background",
        hashColor(displayName),
        sizeClass,
        className
      )}
      title={displayName}
      aria-label={displayName}
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
  users: Pick<UserSummary, "name" | "avatarUrl">[];
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
          "bg-muted text-muted-foreground font-medium text-xs",
          sizeMap[size]
        )}>
          +{extra}
        </div>
      )}
    </div>
  );
}
