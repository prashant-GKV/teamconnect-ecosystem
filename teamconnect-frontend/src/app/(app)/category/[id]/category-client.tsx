"use client";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderKanban, Users, Shield, Clock, Plus, CheckCircle2,
  AlertTriangle, RotateCcw, FileText, Send, ChevronRight, UserCheck, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type {
  Category, CategoryDelegate, Task, UserWithRoles, Request
} from "@teamconnect/shared-types";
import { TaskStatus, DelegatePermission, TaskPriority, TaskScope } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge, ScopeChip, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/dates";

interface Props {
  categoryId: string;
}

export function CategoryDetailClient({ categoryId }: { categoryId: string }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<"tasks" | "reviews" | "members" | "requests" | "delegates" | "notices">("tasks");
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskDesc, setNewTaskDesc] = React.useState("");
  const [newTaskPriority, setNewTaskPriority] = React.useState<TaskPriority>(TaskPriority.Medium);

  // Queries
  const { data: category, isLoading: loadingCat, error: catError, refetch: refetchCat } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => apiClient.get<Category>(`/api/v1/categories/${categoryId}`),
    select: (r) => (r.success ? r.data : undefined),
  });

  const { data: delegates = [] } = useQuery({
    queryKey: ["category", categoryId, "delegates"],
    queryFn: () => apiClient.get<{ data: CategoryDelegate[] }>(`/api/v1/categories/${categoryId}/delegates`),
    select: (r) => (r.success ? r.data.data : []),
  });

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks", "category", categoryId],
    queryFn: () => apiClient.get<{ data: Task[] }>(`${ENDPOINTS.TASKS.LIST}?scope=category&categoryId=${categoryId}`),
    select: (r) => (r.success ? r.data.data : []),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["requests", "category", categoryId],
    queryFn: () => apiClient.get<{ data: Request[] }>(`${ENDPOINTS.REQUESTS.LIST}?categoryId=${categoryId}`),
    select: (r) => (r.success ? r.data.data : []),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get<{ data: UserWithRoles[] }>(ENDPOINTS.USERS.LIST),
    select: (r) => (r.success ? r.data.data : []),
  });

  // Derived Review Queue
  const reviewQueue = React.useMemo(() => {
    return tasks.filter((t) => t.status === TaskStatus.SubmittedForReview);
  }, [tasks]);

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post<Task>(ENDPOINTS.TASKS.CREATE, {
        title: newTaskTitle,
        description: newTaskDesc,
        scope: "category",
        categoryId,
        priority: newTaskPriority,
      });
    },
    onSuccess: () => {
      setIsTaskModalOpen(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
      queryClient.invalidateQueries({ queryKey: ["tasks", "category", categoryId] });
    },
  });

  if (loadingCat) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (catError || !category) {
    return (
      <ErrorState
        title="Category Not Found"
        description="Could not load the category details or permissions."
        onRetry={() => refetchCat()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={category.name}
        description={category.description || "Operational category workspace for department-level tasks, reviews, and cross-category staffing."}
        badges={
          <div className="flex items-center gap-2">
            <ScopeChip scope={TaskScope.Category} />
            <Badge variant={category.isActive ? "success" : "muted"}>
              {category.isActive ? "Active" : "Archived"}
            </Badge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/projects/new">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1.5" /> Initiate Project
              </Button>
            </Link>
            <Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> New Category Task
            </Button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Category Tasks"
          value={tasks.length}
          icon={FolderKanban}
          description="Total category scope tasks"
        />
        <StatCard
          label="Review Queue"
          value={reviewQueue.length}
          icon={CheckCircle2}
          description="Submissions awaiting approval"
        />
        <StatCard
          label="Members Roster"
          value={category.memberCount || 1}
          icon={Users}
          description="Active category members"
        />
        <StatCard
          label="Active Delegates"
          value={delegates.filter((d) => d.status === "active").length}
          icon={Shield}
          description="Scoped approvers"
        />
      </div>

      {/* Primary Lead Card */}
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={category.lead?.name || "Unassigned"} size="md" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Primary Category Lead</p>
              <p className="text-base font-medium text-foreground">{category.lead?.name || "No Primary Lead Assigned"}</p>
              <p className="text-xs text-muted-foreground">{category.lead?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <span>Sole authority for cross-category staff requests & delegations</span>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-border flex gap-4 overflow-x-auto text-sm font-medium">
        {(
          [
            { id: "tasks", label: "Category Tasks", count: tasks.length },
            { id: "reviews", label: "Review Queue", count: reviewQueue.length },
            { id: "members", label: "Members Roster", count: category.memberCount || 0 },
            { id: "requests", label: "Cross-Category Requests", count: requests.length },
            { id: "delegates", label: "Delegated Approvers", count: delegates.length },
            { id: "notices", label: "Notices & Announcements", count: 2 },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab: Tasks */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No Category Tasks"
              description="Create a task strictly scoped to this category to get started."
              action={
                <Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1.5" /> Create Category Task
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {tasks.map((task) => (
                <Card key={task._id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <ScopeChip scope={TaskScope.Category} />
                      <div className="min-w-0">
                        <Link
                          href={`/tasks/${task._id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {task.title}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {task.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <StatusBadge status={task.status} />
                      <Badge variant="outline">{task.priority}</Badge>
                      <Link href={`/tasks/${task._id}`}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Review Queue */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviewQueue.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Review Queue Clear"
              description="No submissions are currently pending approval for this category."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {reviewQueue.map((task) => (
                <Card key={task._id} className="border-amber-500/30 bg-amber-500/5">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ScopeChip scope={TaskScope.Category} />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          Awaiting Review
                        </span>
                      </div>
                      <Link href={`/tasks/${task._id}`} className="font-semibold text-foreground hover:underline">
                        {task.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Assigned to: {task.assignee?.name || "Unassigned"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/tasks/${task._id}`}>
                        <Button size="sm">
                          Review Submission
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Members Roster */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.slice(0, 6).map((u) => (
              <Card key={u._id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar name={u.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    <Badge variant="outline" className="mt-1 text-2xs uppercase">
                      {u.accountType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Requests */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No Active Requests"
              description="No incoming or outgoing staffing requests for this category."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {requests.map((req) => (
                <Card key={req._id}>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{req.role}</Badge>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="font-medium text-sm text-foreground mt-1">
                        Target Member: {req.targetUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Project: {req.project.name} · Expected: {formatDate(req.startAt)} – {formatDate(req.endAt)}
                      </p>
                    </div>
                    <Link href={`/requests/${req._id}`}>
                      <Button variant="outline" size="sm">View Request</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Delegates */}
      {activeTab === "delegates" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Delegates act with specific allowlisted permissions on behalf of the Primary Lead.
            </p>
          </div>
          {delegates.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="No Delegated Approvers"
              description="No active delegations currently assigned for this category."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {delegates.map((del) => (
                <Card key={del._id}>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={del.delegate.name} size="md" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{del.delegate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Granted by: {del.grantedBy.name} · Valid until: {formatDate(del.effectiveTo)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {del.permissions.map((p) => (
                            <span key={p} className="text-2xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant={del.status === "active" ? "success" : "muted"}>
                      {del.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Notices & Announcements */}
      {activeTab === "notices" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Quarterly Category Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Sprint deliverables and project allocations must be finalized by the end of this week. Category review items must be processed within 48 business hours.
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: New Category Task */}
      <Modal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create Category Task"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Category tasks belong strictly to {category.name} and cannot belong to a project.
          </p>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Task Title</label>
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Infrastructure Security Audit"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Description</label>
            <Textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Describe requirements and acceptance criteria..."
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Priority</label>
            <div className="flex gap-2">
              {[TaskPriority.Low, TaskPriority.Medium, TaskPriority.High, TaskPriority.Urgent].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewTaskPriority(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border capitalize ${
                    newTaskPriority === p
                      ? "bg-primary text-white border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
              onClick={() => createTaskMutation.mutate()}
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
