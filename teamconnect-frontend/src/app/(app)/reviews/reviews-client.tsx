"use client";
import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClipboardCheck, CheckCircle2, RotateCcw, Filter,
  Search, ExternalLink, Paperclip, AlertTriangle,
  Clock, Shield, User, ArrowRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatDate, formatRelativeTime } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge, ScopeChip } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { InlineAlert } from "@/components/ui/inline-alert";
import { useToast } from "@/components/ui/toast";
import type { Task, PaginatedResponse, UserWithRoles } from "@teamconnect/shared-types";
import { TaskStatus, TaskScope, TaskPriority } from "@teamconnect/shared-types";

export function ReviewsClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [scopeFilter, setScopeFilter] = React.useState<"all" | TaskScope>("all");
  const [search, setSearch] = React.useState("");
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [reviewAction, setReviewAction] = React.useState<"approve" | "request_revision">("approve");
  const [reviewNotes, setReviewNotes] = React.useState("");

  // Current user info (to enforce self-approval blocked check)
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient.get<UserWithRoles>("/api/v1/auth/me"),
    select: (r) => (r.success ? r.data : null),
  });

  // Query tasks waiting for review
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["reviews-queue"],
    queryFn: () => apiClient.get<PaginatedResponse<Task>>("/api/v1/tasks?status=submitted_for_review"),
    select: (r) => (r.success ? r.data.data : []),
  });

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: ({ taskId, action, notes }: { taskId: string; action: "approve" | "request_revision"; notes?: string }) =>
      apiClient.post(`/api/v1/tasks/${taskId}/review`, { action, notes }),
    onSuccess: (_, vars) => {
      toast({
        title: vars.action === "approve" ? "Task Approved ✓" : "Revision Requested",
        description: vars.action === "approve" ? "Work has reached terminal completion." : "Task moved back to in progress for revisions.",
        variant: vars.action === "approve" ? "success" : "default",
      });
      setSelectedTask(null);
      setReviewNotes("");
      queryClient.invalidateQueries({ queryKey: ["reviews-queue"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: Error) => {
      toast({ title: "Review failed", description: err.message, variant: "danger" });
    },
  });

  const filteredTasks = tasks.filter((t) => {
    if (scopeFilter !== "all" && t.scope !== scopeFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isSelfAssigned = selectedTask && me && selectedTask.assignee?._id === me._id;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (isSelfAssigned && reviewAction === "approve") {
      toast({
        title: "Self-Approval Blocked",
        description: "You cannot approve a task assigned to yourself. This rule is strictly enforced by the backend.",
        variant: "danger",
      });
      return;
    }
    if (reviewAction === "request_revision" && !reviewNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please specify what needs to be revised.",
        variant: "danger",
      });
      return;
    }
    reviewMutation.mutate({
      taskId: selectedTask._id,
      action: reviewAction,
      notes: reviewNotes,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews Center"
        description="Review submitted work deliverables. Submission is not completion until formally reviewed and approved."
      />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex rounded-md border border-input p-0.5 bg-muted/40">
            <button
              onClick={() => setScopeFilter("all")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-colors",
                scopeFilter === "all" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => setScopeFilter(TaskScope.Category)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-colors",
                scopeFilter === TaskScope.Category ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Category Tasks
            </button>
            <button
              onClick={() => setScopeFilter(TaskScope.Project)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-colors",
                scopeFilter === TaskScope.Project ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Project Tasks
            </button>
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} awaiting decision
        </span>
      </div>

      {/* Review Queue List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Reviews Queue Clear"
          description="There are currently no submissions waiting for review in this scope."
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task._id} className="p-4 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <ScopeChip scope={task.scope} size="xs" />
                  <StatusBadge status={task.status} size="xs" />
                  {task.latestSubmission && (
                    <Badge variant="warning" size="xs">
                      v{task.latestSubmission.version}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {task.scope === TaskScope.Category ? task.category?.name : task.project?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/tasks/${task._id}`}>
                    <Button variant="ghost" size="xs" rightIcon={<ExternalLink className="h-3 w-3" />}>
                      Details
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="xs"
                    leftIcon={<ClipboardCheck className="h-3.5 w-3.5" />}
                    onClick={() => {
                      setSelectedTask(task);
                      setReviewAction("approve");
                      setReviewNotes("");
                    }}
                  >
                    Conduct Review
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground">{task.title}</h3>
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{task.description}</p>
                )}
              </div>

              {/* Submitter & submission summary */}
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Submitted by:</span>
                    {task.assignee ? (
                      <span className="font-medium text-foreground">{task.assignee.name}</span>
                    ) : (
                      <span>Assignee</span>
                    )}
                  </div>
                  {task.latestSubmission && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      <span>Submission v{task.latestSubmission.version}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Submitted{" "}
                    {task.latestSubmission?.submittedAt
                      ? formatRelativeTime(task.latestSubmission.submittedAt)
                      : "recently"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={`Review: ${selectedTask.title}`}
          description={`Scope: ${selectedTask.scope === TaskScope.Category ? "Category Task" : "Project Task"}`}
        >
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {isSelfAssigned && (
              <InlineAlert
                variant="danger"
                title="Self-Approval Prohibited"
                message="You are assigned to this task. The TeamConnect engine strictly prevents approving your own work. Another reviewer must approve."
              />
            )}

            {/* Decision choice */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Review Decision</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReviewAction("approve")}
                  disabled={Boolean(isSelfAssigned)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-left transition-colors",
                    reviewAction === "approve"
                      ? "border-success bg-success-subtle/30 text-success"
                      : "border-border hover:bg-muted/50 text-foreground",
                    isSelfAssigned && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Approve</p>
                    <p className="text-xs opacity-80">Mark task complete ✓</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewAction("request_revision")}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-left transition-colors",
                    reviewAction === "request_revision"
                      ? "border-warning bg-warning-subtle/30 text-warning"
                      : "border-border hover:bg-muted/50 text-foreground"
                  )}
                >
                  <RotateCcw className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Request Revision</p>
                    <p className="text-xs opacity-80">Cycle back with feedback</p>
                  </div>
                </button>
              </div>
            </div>

            <Textarea
              label={reviewAction === "approve" ? "Approval Notes (Optional)" : "Revision Feedback (Required)"}
              placeholder={
                reviewAction === "approve"
                  ? "Great work on this delivery..."
                  : "Please address the following items before re-submitting..."
              }
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              required={reviewAction === "request_revision"}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setSelectedTask(null)}>
                Cancel
              </Button>
              <Button
                variant={reviewAction === "approve" ? "success" : "warning"}
                type="submit"
                disabled={Boolean(isSelfAssigned && reviewAction === "approve")}
                loading={reviewMutation.isPending}
              >
                {reviewAction === "approve" ? "Confirm Approval" : "Request Revision"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
