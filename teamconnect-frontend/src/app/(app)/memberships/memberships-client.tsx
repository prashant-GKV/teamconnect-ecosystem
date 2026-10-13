"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Network, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { ProjectMember } from "@teamconnect/shared-types";
import { MembershipStatus } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import { InlineAlert } from "@/components/ui/inline-alert";
import { CreateRequestModal } from "@/components/shared/create-request-modal";
import { cn } from "@/lib/cn";
import Link from "next/link";

const STATUS_ORDER: Record<string, number> = {
  expiring_soon: 0, active: 1, approved_not_yet_active: 2, expired: 3, revoked: 4,
};

export function MembershipsClient() {
  const [requestModalOpen, setRequestModalOpen] = React.useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["memberships", "mine"],
    queryFn: () => apiClient.get<{ data: ProjectMember[] }>(`${ENDPOINTS.MEMBERSHIPS.LIST}?limit=50`),
    select: r => r.success
      ? r.data.data.sort((a,b) => (STATUS_ORDER[a.status]??99) - (STATUS_ORDER[b.status]??99))
      : [],
  });

  const memberships = data ?? [];
  const expiringSoon = memberships.filter(m => m.status === MembershipStatus.ExpiringSoon);

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Memberships"
        description="Your cross-category project memberships and their validity periods."
        breadcrumbs={[{ label: "Memberships" }]}
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            size="sm"
            onClick={() => setRequestModalOpen(true)}
          >
            Request Member
          </Button>
        }
      />

      {expiringSoon.length > 0 && (
        <InlineAlert
          variant="warning"
          title={`${expiringSoon.length} membership${expiringSoon.length > 1 ? "s" : ""} expiring soon`}
          message="Contact your Project Manager or submit a renewal request to maintain active status."
        />
      )}

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : memberships.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No active memberships"
          description="You are not assigned to any cross-category projects yet. Submit a request to collaborate on active projects."
          action={{ label: "Request Membership", onClick: () => setRequestModalOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memberships.map((m) => (
            <Card key={m._id} className={cn("p-4 space-y-4", m.status === MembershipStatus.Revoked && "opacity-60")}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/projects/${m.project._id}`} className="font-heading font-semibold text-sm hover:text-primary transition-colors line-clamp-1">
                    {m.project.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.sourceCategory.name} · <span className="capitalize">{m.role}</span>
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <MembershipValidityBar startAt={m.startAt} endAt={m.endAt} renewalPending={m.renewalPending} />
              {m.renewalPending && (
                <p className="text-xs text-warning-text font-medium">🔄 Renewal request pending</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <CreateRequestModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
