"use client";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Inbox, Send, Check, X, RefreshCw, Plus } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Request } from "@teamconnect/shared-types";
import { RequestStatus } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import { CreateRequestModal } from "@/components/shared/create-request-modal";
import { formatRelativeTime, formatDate } from "@/lib/dates";
import { cn } from "@/lib/cn";

interface Props { type: "inbox" | "outbox" }

function RequestCard({ req, type, onApprove, onReject, onCancel, isActing }: {
  req: Request; type: "inbox"|"outbox";
  onApprove?: () => void; onReject?: () => void; onCancel?: () => void;
  isActing?: boolean;
}) {
  const isPending = req.status === RequestStatus.Pending;
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Avatar user={type === "inbox" ? req.requester : req.targetUser} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/requests/${req._id}`}
              className="font-medium text-sm hover:text-primary hover:underline transition-colors"
            >
              {type === "inbox" ? req.requester.name : req.targetUser.name}
            </Link>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {type === "inbox"
              ? `Requesting ${req.role} access for ${req.targetUser.name}`
              : `Requested ${req.role} in ${req.project.name}`
            }
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 px-3 py-2.5 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Project</p>
        <p className="text-sm font-semibold">{req.project.name}</p>
        <p className="text-xs text-muted-foreground">
          {req.requestingCategory.name} → {req.targetCategory.name}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Membership period</p>
        <MembershipValidityBar startAt={req.startAt} endAt={req.endAt} compact />
      </div>

      {req.justification && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Justification</p>
          <p className="text-xs text-foreground leading-relaxed line-clamp-3">{req.justification}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{formatRelativeTime(req.createdAt)}</p>
        {isPending && (
          <div className="flex gap-2">
            {type === "inbox" ? (
              <>
                <Button size="xs" variant="danger-outline" leftIcon={<X className="h-3 w-3"/>} onClick={onReject} loading={isActing}>Reject</Button>
                <Button size="xs" variant="success" leftIcon={<Check className="h-3 w-3"/>} onClick={onApprove} loading={isActing}>Approve</Button>
              </>
            ) : (
              <Button size="xs" variant="outline" leftIcon={<X className="h-3 w-3"/>} onClick={onCancel} loading={isActing}>Cancel</Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export function RequestsClient({ type }: Props) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [acting, setActing] = React.useState<string | null>(null);
  const [confirmReject, setConfirmReject] = React.useState<string | null>(null);
  const [requestModalOpen, setRequestModalOpen] = React.useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["requests", type],
    queryFn: () => apiClient.get<{ data: Request[] }>(`${ENDPOINTS.REQUESTS.LIST}?type=${type}&limit=50`),
    select: r => r.success ? r.data.data : [],
    refetchInterval: 30_000,
  });

  const requests = data ?? [];
  const pending  = requests.filter(r => r.status === RequestStatus.Pending);
  const past     = requests.filter(r => r.status !== RequestStatus.Pending);

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(ENDPOINTS.REQUESTS.APPROVE(id), {}),
    onSuccess: (_,id) => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Request approved", variant: "success" });
      setActing(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(ENDPOINTS.REQUESTS.REJECT(id), { reason: "Declined by category lead." }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Request rejected", variant: "info" });
      setConfirmReject(null);
      setActing(null);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(ENDPOINTS.REQUESTS.CANCEL(id), {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Request cancelled", variant: "info" });
      setActing(null);
    },
  });

  const tabs = [
    { label: "Pending", count: pending.length },
    { label: "History", count: past.length },
  ];
  const [tab, setTab] = React.useState<"Pending"|"History">("Pending");
  const shown = tab === "Pending" ? pending : past;

  return (
    <div className="space-y-5">
      <PageHeader
        title={type === "inbox" ? "Requests Inbox" : "Requests Outbox"}
        description={type === "inbox"
          ? "Cross-category membership requests awaiting your decision as Category Lead."
          : "Requests you have submitted for team members."}
        breadcrumbs={[{ label: "Requests" }, { label: type === "inbox" ? "Inbox" : "Outbox" }]}
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            size="sm"
            onClick={() => setRequestModalOpen(true)}
          >
            New Request
          </Button>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button key={t.label} onClick={()=>setTab(t.label as any)}
            className={cn("flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab===t.label?"border-primary text-primary":"border-transparent text-muted-foreground hover:text-foreground")}>
            {t.label}
            {t.count > 0 && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[1.25rem] text-center",
                tab===t.label?"bg-primary text-white":"bg-muted text-muted-foreground")}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-56 rounded-xl"/>)}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState icon={type==="inbox"?Inbox:Send}
          title={`No ${tab.toLowerCase()} requests`}
          description={tab==="Pending"?"All caught up! No requests awaiting action.":"No historical requests found."} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shown.map(req => (
            <RequestCard key={req._id} req={req} type={type}
              isActing={acting===req._id}
              onApprove={() => { setActing(req._id); approveMutation.mutate(req._id); }}
              onReject={()  => setConfirmReject(req._id)}
              onCancel={() => { setActing(req._id); cancelMutation.mutate(req._id); }}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmReject}
        onOpenChange={o => !o && setConfirmReject(null)}
        title="Reject Request"
        description="Are you sure you want to reject this request? The requester will be notified."
        confirmLabel="Reject"
        variant="danger"
        onConfirm={async () => { if (confirmReject) { setActing(confirmReject); rejectMutation.mutate(confirmReject); }}}
      />

      <CreateRequestModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        onSuccess={refetch}
      />
    </div>
  );
}