"use client";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2, RotateCcw, Send, Play, Ban, ArrowLeft,
  User, Calendar, Tag, AlertTriangle, Clock, Paperclip,
  MessageSquare, Shield, Link2,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Task } from "@teamconnect/shared-types";
import { TaskStatus, TaskScope } from "@teamconnect/shared-types";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge, ScopeChip } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { InlineAlert } from "@/components/ui/inline-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Timeline } from "@/components/shared/timeline";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { SubmitTaskModal } from "@/components/shared/submit-task-modal";
import { formatDate, isOverdue } from "@/lib/dates";
import { cn } from "@/lib/cn";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-danger/10 text-danger border-danger/30",
  high:   "bg-warning/10 text-warning border-warning/30",
  medium: "bg-info/10 text-info border-info/30",
  low:    "bg-muted text-muted-foreground border-border",
};

interface TaskDetailClientProps {
  id: string;
  initialAction?: "submit" | "review";
}

export function TaskDetailClient({ id, initialAction }: TaskDetailClientProps) {
  const qc   = useQueryClient();
  const [confirmAction, setConfirmAction] = React.useState<"start" | "submit" | null>(
    initialAction === "submit" ? "submit" : null
  );

  const { data: task, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks", id],
    queryFn:  () => apiClient.get<Task>(ENDPOINTS.TASKS.BY_ID(id)),
    select:   r => r.success ? r.data : undefined,
  });

  const startMutation = useMutation({
    mutationFn: () => apiClient.post(ENDPOINTS.TASKS.START(id), {}),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ["tasks", id] }); setConfirmAction(null); },
  });

  if (isLoading) return <TaskDetailSkeleton />;
  if (isError || !task) return (
    <ErrorState title="Task not found" message="This task may have been deleted or you don't have access." onRetry={refetch} />
  );

  const overdue = isOverdue(task.dueAt);
  const canStart  = task.status === TaskStatus.Assigned;
  const canSubmit = task.status === TaskStatus.InProgress || task.status === TaskStatus.RevisionRequested;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Link href={task.scope === TaskScope.Category ? "/tasks/category" : "/tasks/project"}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {task.scope === TaskScope.Category ? "Category" : "Project"} Tasks
        </Link>

        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <ScopeChip scope={task.scope} />
              <StatusBadge status={task.status} size="md" />
              <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", PRIORITY_COLORS[task.priority])}>
                {task.priority}
              </span>
              {overdue && (
                <span className="flex items-center gap-1 rounded-full bg-danger/10 text-danger border border-danger/30 px-2.5 py-0.5 text-xs font-medium">
                  <AlertTriangle className="h-3 w-3" /> Overdue
                </span>
              )}
            </div>
            <h1 className="font-heading text-2xl font-bold leading-tight">{task.title}</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canStart && (
              <Button
                variant="primary"
                leftIcon={<Play className="h-4 w-4" />}
                onClick={() => setConfirmAction("start")}
              >
                Start Task
              </Button>
            )}
            {canSubmit && (
              <Button
                variant="success"
                leftIcon={<Send className="h-4 w-4" />}
                onClick={() => setConfirmAction("submit")}
              >
                Submit for Review
              </Button>
            )}
          </div>
        </div>

        {overdue && (
          <InlineAlert variant="warning" message={`This task is overdue. Due date was ${formatDate(task.dueAt!, "MMMM d, yyyy")}.`} />
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Main content */}
        <div className="xl:col-span-2 space-y-6">

          {/* Description */}
          {task.description && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Description</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Acceptance criteria */}
          {task.acceptanceCriteria && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Acceptance Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {task.acceptanceCriteria}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Dependencies */}
          {task.dependsOn.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" /> Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {task.dependsOn.map(dep => (
                  <Link key={dep.task._id} href={`/tasks/${dep.task._id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 hover:bg-muted transition-colors">
                    <span className="text-sm font-medium truncate">{dep.task.title}</span>
                    <StatusBadge status={dep.status} />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Submissions */}
          {task.submissionCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  Submissions ({task.submissionCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {task.latestSubmission && (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium">Submission v{task.latestSubmission.version}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(task.latestSubmission.submittedAt)}</p>
                    </div>
                    <StatusBadge status={task.latestSubmission.status} />
                  </div>
                )}
                {task.submissionCount > 1 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    + {task.submissionCount - 1} earlier submission{task.submissionCount - 1 !== 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" /> Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline events={[
                {
                  id: "created",
                  title: "Task created",
                  actor: "System",
                  timestamp: task.createdAt,
                  variant: "default",
                },
              ]} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar metadata */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <MetaRow icon={User} label="Assignee">
                {task.assignee
                  ? <div className="flex items-center gap-2">
                      <Avatar user={task.assignee} size="xs" />
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  : <span className="text-sm text-muted-foreground">Unassigned</span>
                }
              </MetaRow>

              <MetaRow icon={Shield} label="Reviewer">
                {task.reviewer
                  ? <div className="flex items-center gap-2">
                      <Avatar user={task.reviewer} size="xs" />
                      <span className="text-sm">{task.reviewer.name}</span>
                    </div>
                  : <span className="text-sm text-muted-foreground">Not set</span>
                }
              </MetaRow>

              <MetaRow icon={Calendar} label="Due date">
                <span className={cn("text-sm", overdue && "text-danger font-medium")}>
                  {task.dueAt ? formatDate(task.dueAt, "MMMM d, yyyy") : "No due date"}
                </span>
              </MetaRow>

              <MetaRow icon={Tag} label="Tags">
                {task.tags.length > 0
                  ? <div className="flex flex-wrap gap-1">
                      {task.tags.map(t => (
                        <Badge key={t} variant="outline" size="sm">{t}</Badge>
                      ))}
                    </div>
                  : <span className="text-sm text-muted-foreground">No tags</span>
                }
              </MetaRow>

              {task.scope === TaskScope.Category && task.category && (
                <MetaRow icon={Shield} label="Category">
                  <span className="text-sm">{task.category.name}</span>
                </MetaRow>
              )}

              {task.scope === TaskScope.Project && task.project && (
                <MetaRow icon={Shield} label="Project">
                  <Link href={`/projects/${task.project._id}`} className="text-sm text-primary hover:underline">
                    {task.project.name}
                  </Link>
                </MetaRow>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Timestamps</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{formatDate(task.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{formatDate(task.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm: start task */}
      <ConfirmDialog
        open={confirmAction === "start"}
        onOpenChange={o => !o && setConfirmAction(null)}
        title="Start Task"
        description="Move this task to 'In Progress'? You can submit it for review once you're done."
        confirmLabel="Start"
        onConfirm={async () => { await startMutation.mutateAsync(); }}
      />

      {/* Submit for Review Modal with inputs and validation */}
      <SubmitTaskModal
        open={confirmAction === "submit"}
        onOpenChange={o => !o && setConfirmAction(null)}
        taskId={task._id}
        taskTitle={task.title}
        onSuccess={() => {
          setConfirmAction(null);
          refetch();
        }}
      />
    </div>
  );
}

function MetaRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="pl-4">{children}</div>
    </div>
  );
}

function TaskDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-6 w-full max-w-lg" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
