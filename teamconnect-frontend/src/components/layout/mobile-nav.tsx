"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, FolderKanban, Bell, Inbox,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@teamconnect/shared-config";

const mobileNav = [
  { href: ROUTES.DASHBOARD,      label: "Home",        icon: LayoutDashboard },
  { href: ROUTES.TASKS_CATEGORY, label: "Tasks",       icon: CheckSquare },
  { href: ROUTES.PROJECTS,       label: "Projects",    icon: FolderKanban },
  { href: ROUTES.REQUESTS_INBOX, label: "Requests",    icon: Inbox },
  { href: ROUTES.NOTIFICATIONS,  label: "Alerts",      icon: Bell },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-border bg-card/90 backdrop-blur-sm",
        "md:hidden" // only show on mobile
      )}
    >
      {mobileNav.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-2xs font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", active ? "text-primary" : "")} aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}