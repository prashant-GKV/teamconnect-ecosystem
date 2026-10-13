"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Check, X, Calendar, User, Briefcase,
  Building, Clock, FileText, Percent, AlertCircle, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Request, UserWithRoles } from "@teamconnect/shared-types";
import { RequestStatus } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import { formatRelativeTime, formatDate } from "@/lib/dates";

interface Props {
  id: string;
}

export function RequestDetailClient({ id }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [confirmReject, setConfirmReject] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");

  // Current user
  const { data: currentUser } = useQuery({
    queryKey: ["me-request-detail"],
    queryFn: () => apiClient.get<UserWithRoles>("/api/v1/users/me/profile"),
    select: (r) => (r.success ? r.data : null),
  });

  // Request details
  const { data: request, isLoading, error, refetch } = useQuery({
    queryKey: ["request", id],
    queryFn: () => apiClient.get<Request>(`${ENDPOINTS.REQUESTS.LIST}/${id}`),
    select: (r) => (r.success ? r.data : null),
  });

  const approveMutation = useMutation({
    mutationFn: () => apiClient.post(`${ENDPOINTS.REQUESTS.LIST}/${id}/approve`),
    onSuccess: () => {
      toast({ title: "Request approved", description: "Membership has been granted.", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (err: any) => {
      toast({ title: "Failed to approve request", description: err.message, variant: "danger" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) =>
      apiClient.post(`${ENDPOINTS.REQUESTS.LIST}/${id}/reject`, { reason }),
    onSuccess: () => {
      toast({ title: "Request rejected", description: "The requester has been notified.", variant: "default" });
      setConfirmReject(false);
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (err: any) => {
      toast({ title: "Failed to reject request", description: err.message, variant: "danger" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => apiClient.post(`${ENDPOINTS.REQUESTS.LIST}/${id}/cancel`),
    onSuccess: () => {
      toast({ title: "Request cancelled", description: "The request has been withdrawn.", variant: "default" });
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (err: any) => {
      toast({ title: "Failed to cancel request", description: err.message, variant: "danger" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <ErrorState
        title="Request not found"
        description="The request you are trying to view does not exist or you lack permission."
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  const isPending = request.status === RequestStatus.Pending;
  const isRequester = currentUser?._id === request.requester._id;

  return (
    <div className="space-y-6">
      {/* Top back nav & Header */}
      <div>
        <Link
          href="/requests/inbox"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Requests
        </Link>
        <PageHeader
          title={`Staffing Request: ${request.targetUser.name}`}
          description={`Requested by ${request.requester.name} for project ${request.project.name}`}
          action={
            <div className="flex items-center gap-2">
              <StatusBadge status={request.status} />
              {isPending && isRequester && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate()}
                >
                  Cancel Request
                </Button>
              )}
              {isPending && !isRequester && (
                <>
                  <Button
                    size="sm"
                    variant="danger-outline"
                    leftIcon={<X className="h-3.5 w-3.5" />}
                    onClick={() => setConfirmReject(true)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    leftIcon={<Check className="h-3.5 w-3.5" />}
                    loading={approveMutation.isPending}
                    onClick={() => approveMutation.mutate()}
                  >
                    Approve Staffing
                  </Button>
                </>
              )}
            </div>
          }
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Request Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Staffing Justification & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Justification</p>
                <div className="rounded-lg bg-muted/40 p-3.5 border border-border/50 text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {request.justification || "No justification provided."}
                </div>
              </div>

              {request.expectedContribution && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Expected Contribution</p>
                  <div className="rounded-lg bg-muted/40 p-3.5 border border-border/50 text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {request.expectedContribution}
                  </div>
                </div>
              )}

              {/* Validity & Timeline */}
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Requested Membership Period</span>
                  <span>
                    {formatDate(request.startAt)} – {formatDate(request.endAt)}
                  </span>
                </div>
                <MembershipValidityBar startAt={request.startAt} endAt={request.endAt} showDaysLeft />
              </div>
            </CardContent>
          </Card>

          {/* Decision Record Card (if decided) */}
          {request.status !== RequestStatus.Pending && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Decision Record
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Status</span>
                  <StatusBadge status={request.status} />
                </div>
                {request.decidedBy && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Decided By</span>
                    <span className="font-medium text-foreground">{request.decidedBy.name}</span>
                  </div>
                )}
                {request.decidedAt && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Decision Date</span>
                    <span className="font-medium text-foreground">{formatDate(request.decidedAt)}</span>
                  </div>
                )}
                {request.rejectionReason && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-destructive mb-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Rejection Reason
                    </p>
                    <p className="text-xs text-foreground bg-destructive/10 p-2.5 rounded border border-destructive/20">
                      {request.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: People & Target Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Target Project & Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-2xs text-muted-foreground uppercase font-semibold">Project</p>
                <Link
                  href={`/projects/${request.project._id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {request.project.name}
                </Link>
              </div>

              <div>
                <p className="text-2xs text-muted-foreground uppercase font-semibold">Assigned Project Role</p>
                <span className="inline-block mt-0.5 capitalize px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground">
                  {request.role}
                </span>
              </div>

              {request.workloadPercent != null && (
                <div>
                  <p className="text-2xs text-muted-foreground uppercase font-semibold">Expected Workload</p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium text-foreground">
                    <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{request.workloadPercent}% Allocation</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <p className="text-2xs text-muted-foreground uppercase font-semibold mb-1">Transfer Route</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{request.requestingCategory.name}</span>
                  {" → "}
                  <span className="font-medium text-foreground">{request.targetCategory.name}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Involved Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target User */}
              <div className="flex items-center gap-3">
                <Avatar user={request.targetUser} size="md" />
                <div className="min-w-0">
                  <p className="text-2xs text-muted-foreground uppercase font-semibold">Candidate</p>
                  <p className="text-xs font-semibold text-foreground truncate">{request.targetUser.name}</p>
                  <p className="text-2xs text-muted-foreground truncate">{request.targetUser.email}</p>
                </div>
              </div>

              {/* Requester */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Avatar user={request.requester} size="md" />
                <div className="min-w-0">
                  <p className="text-2xs text-muted-foreground uppercase font-semibold">Requester</p>
                  <p className="text-xs font-semibold text-foreground truncate">{request.requester.name}</p>
                  <p className="text-2xs text-muted-foreground truncate">{request.requester.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Dialog */}
      <ConfirmDialog
        open={confirmReject}
        onOpenChange={setConfirmReject}
        title="Reject Staffing Request"
        description="Provide a reason for rejecting this staffing request. The requester will be notified."
        confirmLabel="Confirm Rejection"
        variant="danger"
        loading={rejectMutation.isPending}
        onConfirm={() => rejectMutation.mutate(rejectReason)}
      >
        <div className="mt-3">
          <label className="text-xs font-medium text-foreground block mb-1">
            Reason for rejection (required)
          </label>
          <textarea
            className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
            rows={3}
            placeholder="e.g. Current workload in department does not permit 30% allocation..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
