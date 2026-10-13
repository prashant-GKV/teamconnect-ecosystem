"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FolderKanban, Network, BarChart3,
  ScrollText, Settings, Star, Shield,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeProvider } from "next-themes";

const adminNav = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/users",       label: "Users",        icon: Users },
  { href: "/categories",  label: "Categories",   icon: Shield },
  { href: "/projects",    label: "Projects",     icon: FolderKanban },
  { href: "/memberships", label: "Memberships",  icon: Network },
  { href: "/reports",     label: "Reports",      icon: BarChart3 },
  { href: "/audit",       label: "Audit Log",    icon: ScrollText },
  { href: "/settings",    label: "Settings",     icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card h-screen sticky top-0">
        <div className="flex h-[60px] items-center gap-2 border-b border-border px-4">
          <Star className="h-5 w-5 text-primary" />
          <span className="font-heading font-bold text-base">TeamConnect</span>
          <span className="ml-auto rounded-md bg-danger/10 px-1.5 py-0.5 text-2xs font-semibold uppercase text-danger tracking-wider">
            Admin
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {adminNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon   = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-[60px] items-center gap-3 border-b border-border bg-card/80 backdrop-blur-sm px-6">
          <p className="text-sm font-medium text-muted-foreground">
            Logged in as <span className="text-foreground">Avery Singh</span> · Super Admin
          </p>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
