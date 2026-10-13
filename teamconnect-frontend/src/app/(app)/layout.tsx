"use client";
import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Notification } from "@teamconnect/shared-types";
import { AuthGuard, useAuth } from "@/contexts/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user } = useAuth();

  const closeMobile  = React.useCallback(() => setMobileOpen(false), []);
  const openMobile   = React.useCallback(() => setMobileOpen(true),  []);

  const { data: notifications } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn:  () => apiClient.get<{ data: Notification[] }>(ENDPOINTS.NOTIFICATIONS.LIST),
    select:   (r) => r.success ? r.data.data.filter(n => !n.read).length : 0,
    refetchInterval: 30_000,
    // bfcache fix: stop polling when tab is hidden so the page can enter bfcache
    refetchIntervalInBackground: false,
  });

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar
          mobileOpen={mobileOpen}
          onCloseMobile={closeMobile}
        />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Topbar
            user={user}
            unreadCount={notifications ?? 0}
            onOpenMobile={openMobile}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
