"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, FolderKanban, Inbox,
  Network, Star, ClipboardCheck, Bell, Settings,
  ChevronLeft, ChevronRight, X, Sun, Moon, Monitor,
  Shield, Layers,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";
import { useAuth, type PrimaryRole } from "@/contexts/auth-context";

interface NavItem {
  href:   string;
  label:  string;
  icon:   React.ElementType;
  badge?: number;
  roles?: PrimaryRole[]; // If specified, only these roles can see this item
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",          label: "Dashboard",         icon: LayoutDashboard },
  { href: "/tasks/category",     label: "Category Tasks",    icon: CheckSquare },
  { href: "/tasks/project",      label: "Project Tasks",     icon: ClipboardCheck },
  { href: "/projects",           label: "Projects",          icon: FolderKanban },
  { href: "/requests/inbox",     label: "Requests Inbox",    icon: Inbox,           roles: ["lead", "manager", "delegate", "admin"] },
  { href: "/requests/outbox",    label: "Requests Outbox",   icon: Inbox },
  { href: "/memberships",        label: "Memberships",       icon: Network,         roles: ["lead", "manager", "admin"] },
  { href: "/reviews",            label: "Reviews",           icon: Star,            roles: ["lead", "manager", "delegate", "admin"] },
  { href: "/notifications",      label: "Notifications",     icon: Bell },
];

const BOTTOM_ITEMS: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname   = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { role, roleLabel, user } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  // Filter items by current user's role
  const visibleNavItems = ALL_NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className={cn(
          "flex h-[60px] items-center border-b border-border px-3",
          collapsed ? "justify-center" : "justify-between px-4"
        )}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Star className="h-4 w-4 text-white fill-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-heading font-bold text-base tracking-tight truncate">TeamConnect</span>
                <span className="text-[10px] text-primary font-semibold uppercase tracking-wider truncate">
                  {role}
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Role Tag Banner */}
        {!collapsed && user && (
          <div className="px-3 pt-3">
            <div className="rounded-lg bg-muted/60 border border-border/60 p-2 text-xs flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="truncate">
                <p className="font-medium truncate text-foreground">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{roleLabel}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1">
          {visibleNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon   = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 min-h-[44px] text-sm font-medium transition-colors duration-150",
                  collapsed ? "justify-center" : "",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} aria-hidden />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge != null && item.badge > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom controls */}
      <div className="border-t border-border px-2 py-3 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon   = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center" : "",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Theme toggle */}
        {!collapsed && (
          <div className="flex items-center gap-1 rounded-md border border-border p-1 mt-1">
            {([["light", Sun], ["system", Monitor], ["dark", Moon]] as const).map(([t, Icon]) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "flex-1 flex items-center justify-center rounded p-1.5 transition-colors",
                  mounted && theme === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={`${t} theme`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            "hidden md:flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            collapsed ? "justify-center" : ""
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>
          }
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        data-collapsed={collapsed}
        className={cn(
          "hidden md:flex h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 ease-in-out",
          collapsed ? "w-[60px]" : "w-56"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative flex w-64 max-w-[80vw] flex-col bg-card border-r border-border shadow-xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
