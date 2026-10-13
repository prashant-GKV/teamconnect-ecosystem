"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, FolderKanban, Users, Bell,
  ChevronLeft, ChevronRight, Settings, LogOut, Tag, Inbox,
  ClipboardList, Network, Star,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@teamconnect/shared-config";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface NavItem {
  href:   string;
  label:  string;
  icon:   React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: ROUTES.DASHBOARD,       label: "Dashboard",       icon: LayoutDashboard },
  { href: ROUTES.TASKS_CATEGORY,  label: "Category Tasks",  icon: Tag },
  { href: ROUTES.TASKS_PROJECT,   label: "Project Tasks",   icon: CheckSquare },
  { href: ROUTES.PROJECTS,        label: "Projects",        icon: FolderKanban },
  { href: ROUTES.REVIEWS,         label: "Reviews",         icon: ClipboardList },
  { href: ROUTES.REQUESTS_INBOX,  label: "Requests",        icon: Inbox },
  { href: ROUTES.MEMBERSHIPS,     label: "Memberships",     icon: Network },
  { href: ROUTES.NOTIFICATIONS,   label: "Notifications",   icon: Bell },
];

interface SidebarProps {
  user?: { name: string; email: string; avatarUrl?: string };
  collapsed: boolean;
  onToggle:  () => void;
}

export function Sidebar({ user, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      aria-label="Main navigation"
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-bg))]",
        "transition-[width] duration-200 ease-out",
        "h-screen sticky top-0 shrink-0",
        collapsed ? "w-16" : "w-60",
        "hidden md:flex" // hidden on mobile (use bottom nav instead)
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-[var(--topbar-height)] items-center border-b border-sidebar-border px-4 shrink-0", collapsed && "justify-center px-0")}>
        {collapsed ? (
          <Star className="h-6 w-6 text-primary" aria-label="TeamConnect" />
        ) : (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">TeamConnect</span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon   = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-0 py-2.5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-primary" : "")} aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-2xs font-semibold text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className={cn("border-t border-sidebar-border p-3 shrink-0", collapsed && "flex justify-center")}>
          {collapsed ? (
            <Avatar user={user} size="sm" />
          ) : (
            <div className="flex items-center gap-2.5">
              <Avatar user={user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full",
          "border border-border bg-card shadow-soft text-muted-foreground hover:text-foreground",
          "transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
