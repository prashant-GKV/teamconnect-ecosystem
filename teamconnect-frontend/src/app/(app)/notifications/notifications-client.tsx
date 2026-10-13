"use client";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Notification } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/dates";
import { cn } from "@/lib/cn";

export function NotificationsClient() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiClient.get<{ data: Notification[] }>(`${ENDPOINTS.NOTIFICATIONS.LIST}?limit=50`),
    select: r => r.success ? r.data.data : [],
    refetchInterval: 30_000,
  });

  const readAllMutation = useMutation({
    mutationFn: () => apiClient.post(ENDPOINTS.NOTIFICATIONS.READ_ALL, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = data ?? [];
  const unread = notifications.filter(n => !n.read);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description="Stay on top of task updates, membership changes, and request decisions."
        breadcrumbs={[{ label: "Notifications" }]}
        actions={unread.length > 0 && (
          <Button size="sm" variant="outline" leftIcon={<CheckCheck className="h-4 w-4"/>}
            onClick={() => readAllMutation.mutate()} loading={readAllMutation.isPending}>
            Mark all read
          </Button>
        )}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-16 rounded-xl"/>)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You are all caught up!" />
      ) : (
        <Card className="overflow-hidden p-0 divide-y divide-border">
          {notifications.map(n => (
            <div key={n._id} className={cn("flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50",!n.read&&"bg-primary/5")}>
              {!n.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0"/>}
              {n.read  && <div className="mt-1.5 h-2 w-2 rounded-full bg-transparent shrink-0"/>}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm",!n.read?"font-medium":"text-muted-foreground")}>{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.body}</p>
              </div>
              <p className="text-xs text-muted-foreground shrink-0">{formatRelativeTime(n.createdAt)}</p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}