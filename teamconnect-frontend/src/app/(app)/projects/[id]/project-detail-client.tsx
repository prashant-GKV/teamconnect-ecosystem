"use client";
import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Calendar, Users, CheckSquare, Flag,
  UserPlus, Plus, Shield, Clock, ExternalLink,
  FolderKanban, CheckCircle2, ChevronRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatDate, formatRelativeTime } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge, ScopeChip } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import type {
  Project, ProjectMember, Task, ApiResponse, PaginatedResponse,
} from "@teamconnect/shared-types";
import { TaskStatus, TaskPriority, ProjectMemberRole } from "@teamconnect/shared-types";

interface Props {
  id: string;
}

export function ProjectDetailClient({ id }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"tasks" | "members" | "milestones">("tasks");
  const [staffingModal, setStaffingModal] = React.useState(false);
  const [taskModal, setTaskModal] = React.useState(false);

  // Form states
  const [targetCategory, setTargetCategory] = React.useState("");
  const [targetUser, setTargetUser] = React.useState("");
  const [staffRole, setStaffRole] = React.useState<ProjectMemberRole>(ProjectMemberRole.Member);
  const [startAt, setStartAt] = React.useState("");
  const [endAt, setEndAt] = React.useState("");
  const [justification, setJustification] = React.useState("");

  // Task form
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskPriority, setTaskPriority] = React.useState<TaskPriority>(TaskPriority.Medium);
  const [taskDueAt, setTaskDueAt] = React.useState("");
  const [taskAssignee, setTaskAssignee] = React.useState("");

  // Fetch project details
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => apiClient.get<Project>(`/api/v1/projects/${id}`),
    select: (r) => (r.success ? r.data : null),
  });

  // Fetch project members
  const { data: members = [] } = useQuery({
    queryKey: ["project-members", id],
    queryFn: () => apiClient.get<PaginatedResponse<ProjectMember>>(`/api/v1/projects/${id}/members`),
    select: (r) => (r.success ? r.data.data : []),
  });

  // Fetch project tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["project-tasks", id],
    queryFn: () => apiClient.get<PaginatedResponse<Task>>(`/api/v1/tasks?scope=project&projectId=${id}`),
    select: (r) => (r.success ? r.data.data : []),
  });

  // Request Staffing Mutation
  const staffingMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.post("/api/v1/requests", data),
    onSuccess: () => {
      toast({ title: "Staffing request submitted", description: "Category Lead will review your request." });
      setStaffingModal(false);
      setJustification("");
      setStartAt("");
      setEndAt("");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to submit request", description: err.message, variant: "danger" });
    },
  });

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.post("/api/v1/tasks", data),
    onSuccess: () => {
      toast({ title: "Project task created", description: "Task has been added to the project backlog." });
      setTaskModal(false);
      setTaskTitle("");
      setTaskDescription("");
      queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create task", description: err.message, variant: "danger" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-32 bg-card rounded-xl border border-border" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-danger font-medium">Project not found or failed to load.</p>
        <Link href="/projects">
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const completedMilestones = project.milestones?.filter((m) => m.status === "completed").length ?? 0;
  const totalMilestones = project.milestones?.length ?? 0;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const handleStaffingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    staffingMutation.mutate({
      projectId: id,
      targetUserId: targetUser || "u-emp-1",
      targetCategoryId: targetCategory || project.originCategory._id,
      role: staffRole,
      startAt: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
      endAt: endAt ? new Date(endAt).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      justification: justification || "Staffing needed for project milestone execution.",
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate({
      title: taskTitle,
      description: taskDescription,
      projectId: id,
      priority: taskPriority,
      assigneeId: taskAssignee || undefined,
      dueAt: taskDueAt ? new Date(taskDueAt).toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumbs */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </Link>
        <PageHeader
          title={project.name}
          description={project.description ?? "Cross-category collaborative project"}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<UserPlus className="h-4 w-4" />}
                onClick={() => setStaffingModal(true)}
              >
                Request Staffing
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setTaskModal(true)}
              >
                New Task
              </Button>
            </div>
          }
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</p>
          <div className="pt-1">
            <StatusBadge status={project.status} size="md" />
          </div>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Project Manager</p>
          <div className="flex items-center gap-2 pt-1">
            <Avatar user={project.manager} size="sm" />
            <span className="text-sm font-medium">{project.manager.name}</span>
          </div>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Origin Category</p>
          <div className="pt-1">
            <Badge variant="primary" size="sm">{project.originCategory.name}</Badge>
          </div>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Timeline</p>
          <p className="text-xs font-mono pt-1 text-foreground">
            {formatDate(project.startAt, "MMM d, yyyy")} – {formatDate(project.endAt, "MMM d, yyyy")}
          </p>
        </Card>
      </div>

      {/* Progress & Objectives */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Milestones Progress</h3>
            <p className="text-xs text-muted-foreground">
              {completedMilestones} of {totalMilestones} completed
            </p>
          </div>
          <span className="text-sm font-heading font-bold">{progress}%</span>
        </div>
        <ProgressBar value={progress} variant={progress === 100 ? "success" : "default"} />
      </Card>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("tasks")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2",
              activeTab === "tasks"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <CheckSquare className="h-4 w-4" />
            Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2",
              activeTab === "members"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            Team Roster ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2",
              activeTab === "milestones"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Flag className="h-4 w-4" />
            Milestones ({totalMilestones})
          </button>
        </div>
      </div>

      {/* Tab: Tasks */}
      {activeTab === "tasks" && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks in this project"
              description="Create tasks to assign work to project members."
              action={{
                label: "Create First Task",
                onClick: () => setTaskModal(true),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tasks.map((t) => (
                <Link key={t._id} href={`/tasks/${t._id}`}>
                  <Card className="p-4 hover:border-primary/50 transition-colors h-full flex flex-col justify-between group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <ScopeChip scope={t.scope} size="xs" />
                        <StatusBadge status={t.status} size="xs" />
                      </div>
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {t.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        {t.assignee ? (
                          <>
                            <Avatar user={t.assignee} size="xs" />
                            <span>{t.assignee.name}</span>
                          </>
                        ) : (
                          <span>Unassigned</span>
                        )}
                      </div>
                      {t.dueAt && <span>Due {formatDate(t.dueAt, "MMM d")}</span>}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Members */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Cross-category staffed team members with active validity periods.
            </p>
            <Button
              variant="outline"
              size="xs"
              leftIcon={<UserPlus className="h-3.5 w-3.5" />}
              onClick={() => setStaffingModal(true)}
            >
              Request Member
            </Button>
          </div>

          {members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members staffed yet"
              description="Request employees from other categories to join this project."
              action={{
                label: "Request Staffing",
                onClick: () => setStaffingModal(true),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((m) => (
                <Card key={m._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar user={m.user} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{m.user.name}</p>
                        <p className="text-xs text-muted-foreground">{m.user.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={m.status} size="xs" />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="primary" size="xs" className="capitalize">
                      {m.role}
                    </Badge>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {formatDate(m.startAt, "MMM d")} – {formatDate(m.endAt, "MMM d, yyyy")}
                    </span>
                  </div>

                  {/* Validity countdown bar */}
                  <MembershipValidityBar
                    startAt={m.startAt}
                    endAt={m.endAt}
                    status={m.status}
                    showDaysLeft
                  />
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Milestones */}
      {activeTab === "milestones" && (
        <div className="space-y-3">
          {totalMilestones === 0 ? (
            <EmptyState
              icon={Flag}
              title="No milestones defined"
              description="Define key milestones to track project deliverables."
            />
          ) : (
            <div className="space-y-2 max-w-2xl">
              {project.milestones?.map((m) => {
                const isDone = m.status === "completed";
                return (
                  <div
                    key={m._id}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-lg border",
                      isDone ? "border-success/30 bg-success-subtle/20" : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center border",
                          isDone ? "bg-success text-white border-success" : "border-muted-foreground text-transparent"
                        )}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", isDone && "line-through text-muted-foreground")}>
                          {m.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Target: {formatDate(m.targetDate, "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    {isDone && (
                      <span className="text-xs text-success font-medium">Completed ✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Staffing Request Modal */}
      <Modal
        isOpen={staffingModal}
        onClose={() => setStaffingModal(false)}
        title="Request Cross-Category Staffing"
        description="Formal staffing request will be sent to the target user's Category Lead for review."
      >
        <form onSubmit={handleStaffingSubmit} className="space-y-4">
          <Input
            label="Target User ID or Name"
            placeholder="e.g. Morgan Blake"
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            required
            hint="User from another category to be staffed"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Project Role</label>
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value as ProjectMemberRole)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
            >
              <option value={ProjectMemberRole.Member}>Member</option>
              <option value={ProjectMemberRole.Reviewer}>Reviewer</option>
              <option value={ProjectMemberRole.Manager}>Manager</option>
            </select>
          </div>

          <Textarea
            label="Justification"
            placeholder="Describe the skills needed, expected deliverables, and time commitment (min 20 chars)..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            required
            hint="Category Lead requires clear business justification to approve"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setStaffingModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={staffingMutation.isPending}>
              Submit Staffing Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={taskModal}
        onClose={() => setTaskModal(false)}
        title="Create Project Task"
        description={`Assign a task under ${project.name}. Review will be conducted by project reviewers.`}
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement payment gateway webhook"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />

          <Textarea
            label="Description & Acceptance Criteria"
            placeholder="Details of the task and clear criteria for approval..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value={TaskPriority.Low}>Low</option>
                <option value={TaskPriority.Medium}>Medium</option>
                <option value={TaskPriority.High}>High</option>
                <option value={TaskPriority.Urgent}>Urgent</option>
              </select>
            </div>
            <Input
              label="Due Date"
              type="date"
              value={taskDueAt}
              onChange={(e) => setTaskDueAt(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setTaskModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={createTaskMutation.isPending}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
