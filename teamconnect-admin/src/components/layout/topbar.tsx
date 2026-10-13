"use client";
import * as React from "react";
import Link from "next/link";
import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ROUTES } from "@teamconnect/shared-config";
import type { UserWithRoles } from "@teamconnect/shared-types";

interface TopbarProps {
  user?:              UserWithRoles;
  notificationCount?: number;
  onLogout?:          () => void;
}

export function Topbar({ user, notificationCount = 0, onLogout }: TopbarProps) {
  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-40 flex h-[var(--topbar-height)] items-center gap-3 border-b border-border",
        "bg-card/80 backdrop-blur-sm px-4 md:px-6"
      )}
    >
      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search tasks, projects, people…"
            aria-label="Global search"
            className={cn(
              "h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-3 text-sm",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "transition-colors duration-150"
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <ThemeToggle />

        {/* Notifications bell */}
        <Link href={ROUTES.NOTIFICATIONS} aria-label={`${notificationCount} unread notifications`}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-2xs font-bold text-danger-foreground">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </Button>
        </Link>

        {/* User menu */}
        {user && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar user={user} size="sm" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground leading-none mt-0.5 capitalize">{user.accountType}</p>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" sideOffset={8} className={cn(
              "z-50 min-w-[180px] rounded-xl border border-border bg-card p-1 shadow-medium",
              "data-[state=open]:animate-slide-in-up"
            )}>
              <DropdownMenu.Item asChild>
                <Link href={ROUTES.PROFILE} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" /> Profile
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item asChild>
                <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-danger-subtle text-danger">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>
    </header>
  );
}
