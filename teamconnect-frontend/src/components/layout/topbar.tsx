"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Search, ChevronDown, LogOut, User,
  Settings, Menu, Shield,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

const BREADCRUMB_MAP: Record<string, string> = {
  dashboard:    "Dashboard",
  tasks:        "Tasks",
  category:     "Category Tasks",
  project:      "Project Tasks",
  projects:     "Projects",
  requests:     "Requests",
  inbox:        "Inbox",
  outbox:       "Outbox",
  memberships:  "Memberships",
  reviews:      "Reviews",
  notifications:"Notifications",
  profile:      "Profile",
  settings:     "Settings",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label:  BREADCRUMB_MAP[seg] ?? seg,
    href:   "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

interface TopbarProps {
  user?: { name: string; email: string; avatarUrl?: string | null } | null | undefined;
  unreadCount?: number | undefined;
  onOpenMobile?: () => void;
}

export function Topbar({ user: userProp, unreadCount = 0, onOpenMobile }: TopbarProps) {
  const crumbs  = useBreadcrumbs();
  const [search, setSearch]   = React.useState("");
  const [userMenu, setUserMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { user: authUser, roleLabel, logout } = useAuth();

  const user = userProp ?? authUser;

  // Close menu on outside click
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-6">
      {/* Mobile Menu Hamburger button */}
      {onOpenMobile && (
        <button
          onClick={onOpenMobile}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Breadcrumbs */}
      <nav className="flex-1 min-w-0 hidden sm:flex items-center gap-1 text-sm">
        {crumbs.map((c, i) => (
          <React.Fragment key={c.href}>
            {i > 0 && <span className="text-muted-foreground/50">/</span>}
            {c.isLast
              ? <span className="font-medium text-foreground truncate">{c.label}</span>
              : <Link href={c.href} className="text-muted-foreground hover:text-foreground transition-colors truncate">{c.label}</Link>
            }
          </React.Fragment>
        ))}
      </nav>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks, projects…"
          className="h-8 w-48 lg:w-56 rounded-lg border border-border bg-muted/40 pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-[width,box-shadow] duration-200 focus:w-64"
        />
      </div>

      {/* Notifications */}
      <Link
        href="/notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount > 9 ? "9+" : unreadCount})` : "Notifications"}
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setUserMenu(v => !v)}
          className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted transition-colors"
          aria-label={user ? `${user.name.split(" ").map(p => p[0] ?? "").join("").toUpperCase().slice(0, 2)} ${user.name} account menu` : "User account menu"}
          aria-expanded={userMenu}
        >
          <Avatar
            user={user ?? { name: "Loading…" }}
            size="sm"
            aria-hidden="true"
          />
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium leading-none truncate max-w-[120px]">{user ? user.name : "—"}</p>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5 truncate max-w-[120px]">{roleLabel}</p>
          </div>
          <ChevronDown className={cn("hidden md:block h-3.5 w-3.5 text-muted-foreground transition-transform", userMenu && "rotate-180")} />
        </button>

        {userMenu && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                <Shield className="h-3 w-3" />
                <span>{roleLabel}</span>
              </div>
            </div>
            <Link href="/profile" onClick={() => setUserMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
              <User className="h-4 w-4 text-muted-foreground" /> Profile
            </Link>
            <Link href="/settings" onClick={() => setUserMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" /> Settings
            </Link>
            <div className="border-t border-border mt-1 pt-1">
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5 transition-colors"
                onClick={() => {
                  setUserMenu(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
