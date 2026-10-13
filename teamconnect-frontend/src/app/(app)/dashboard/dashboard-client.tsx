"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckSquare, FolderKanban, Inbox, AlertTriangle,
  Clock, TrendingUp, ArrowRight, RefreshCw, Star,
  Shield, Users, Layers, CheckCircle2, ChevronRight,
  PlusCircle, FileText, Send, Building2,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Task, Request, Category, Project } from "@teamconnect/shared-types";
import { TaskStatus } from "@teamconnect/shared-types";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge, ScopeChip } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime, formatDate, isOverdue } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { useAuth } from "@/contexts/auth-context";

// ── API helpers ────────────────────────────────────────────────────────────────
const DASHBOARD_STALE = 30_000; // 30 s — dashboard data is fresh enough at this cadence

const useDashboardData = () => {
  const { user, role } = useAuth();

  const allTasks = useQuery({
    queryKey: ["tasks", "dashboard"],
    queryFn:  () => apiClient.get<{ data: Task[] }>(ENDPOINTS.TASKS.LIST + "?limit=50"),
    select:   r => r.success ? r.data.data : [],
    staleTime: DASHBOARD_STALE,
  });

  const inboxRequests = useQuery({
    queryKey: ["requests", "inbox", "dashboard"],
    queryFn:  () => apiClient.get<{ data: Request[] }>(ENDPOINTS.REQUESTS.LIST + "?type=inbox&status=pending&limit=10"),
    select:   r => r.success ? r.data.data : [],
    staleTime: DASHBOARD_STALE,
  });

  const outboxRequests = useQuery({
    queryKey: ["requests", "outbox", "dashboard"],
    queryFn:  () => apiClient.get<{ data: Request[] }>(ENDPOINTS.REQUESTS.LIST + "?type=outbox&limit=10"),
    select:   r => r.success ? r.data.data : [],
    staleTime: DASHBOARD_STALE,
  });

  const categories = useQuery({
    queryKey: ["categories", "dashboard"],
    queryFn:  () => apiClient.get<{ data: Category[] }>(ENDPOINTS.CATEGORIES.LIST),
    select:   r => r.success ? r.data.data : [],
    staleTime: DASHBOARD_STALE,
  });

  const projects = useQuery({
    queryKey: ["projects", "dashboard"],
    queryFn:  () => apiClient.get<{ data: Project[] }>(ENDPOINTS.PROJECTS.LIST),
    select:   r => r.success ? r.data.data : [],
    staleTime: DASHBOARD_STALE,
  });

  return { user, role, allTasks, inboxRequests, outboxRequests, categories, projects };
};

// ── Task row ──────────────────────────────────────────────────────────────────
const TaskRow = React.memo(function TaskRow({ task }: { task: Task }) {
  const overdue = isOverdue(task.dueAt);
  return (
    <Link
      href={`/tasks/${task._id}`}
      className="group flex items-start gap-3 rounded-lg p-3 hover:bg-muted/60 transition-colors"
    >
      <div className="mt-0.5">
        <ScopeChip scope={task.scope} size="xs" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate group-hover:text-primary transition-colors",
          overdue && "text-danger"
        )}>
          {task.title}
        </p>
        {task.dueAt && (
          <p className={cn("text-xs mt-0.5", overdue ? "text-danger font-medium" : "text-muted-foreground")}>
            {overdue ? "Overdue · " : "Due "}{formatDate(task.dueAt, "MMM d")}
          </p>
        )}
      </div>
      <StatusBadge status={task.status} />
    </Link>
  );
});

// ── Request row ────────────────────────────────────────────────────────────────
const RequestRow = React.memo(function RequestRow({ req }: { req: Request }) {
  return (
    <Link
      href={`/requests/${req._id}`}
      className="group flex items-center gap-3 rounded-lg p-3 hover:bg-muted/60 transition-colors"
    >
      <Avatar user={req.requester} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
          {req.requester.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          → {req.project.name} · {req.role}
        </p>
      </div>
      <p className="text-xs text-muted-foreground shrink-0">
        {formatRelativeTime(req.createdAt)}
      </p>
    </Link>
  );
});

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export function DashboardClient() {
  const { user, role, roleLabel, categoryName, projectName } = useAuth();
  const { allTasks, inboxRequests, outboxRequests, categories, projects } = useDashboardData();

  const tasksList = React.useMemo(() => allTasks.data ?? [], [allTasks.data]);
  const inboxList = inboxRequests.data ?? [];
  const outboxList = outboxRequests.data ?? [];
  const catList = categories.data ?? [];
  const projList = projects.data ?? [];

  // Memoized derived lists — only recompute when source data or user changes
  const myAssignedTasks = React.useMemo(
    () => tasksList.filter(
      (t) => t.assignee?._id === user?._id || t.assignee?.email === user?.email
    ),
    [tasksList, user?._id, user?.email]
  );

  const leadCatId = user?.categoryRoles?.find((r) => r.isPrimaryLead)?.categoryId;
  const categoryTasks = React.useMemo(
    () => leadCatId
      ? tasksList.filter((t) => t.category?._id === leadCatId)
      : tasksList.filter((t) => t.scope === "category"),
    [tasksList, leadCatId]
  );

  const reviewQueueTasks = React.useMemo(
    () => tasksList.filter((t) => t.status === TaskStatus.SubmittedForReview),
    [tasksList]
  );

  const pmProjectId = user?.projectRoles?.find((r) => r.role === "manager")?.projectId;
  const projectTasks = React.useMemo(
    () => pmProjectId
      ? tasksList.filter((t) => t.project?._id === pmProjectId)
      : tasksList.filter((t) => t.scope === "project"),
    [tasksList, pmProjectId]
  );

  const isLoading = allTasks.isLoading;


  return (
    <div className="space-y-6">
      {/* Header with Role Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title={user ? `Good Day, ${user.name.split(" ")[0]}!` : "Dashboard"}
          description={
            role === "admin"
              ? "Organization Oversight & System Administration Dashboard."
              : role === "lead"
                ? `Category Lead Operations for ${categoryName || "your department"}.`
                : role === "manager"
                  ? `Project Management & Resource Allocation for ${projectName || "your projects"}.`
                  : "Here is your task queue and active collaborations for today."
          }
          breadcrumbs={[{ label: "Dashboard" }]}
        />
        <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
          <Shield className="h-3.5 w-3.5" />
          <span>{roleLabel}</span>
        </div>
      </div>

      {/* KPI row — tailored by role */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : role === "lead" ? (
          <>
            <StatCard
              label="Category Tasks"
              value={categoryTasks.length}
              icon={CheckSquare}
              variant="primary"
            />
            <StatCard
              label="Review Queue"
              value={reviewQueueTasks.length}
              icon={Star}
              variant="warning"
            />
            <StatCard
              label="Pending Requests"
              value={inboxList.length}
              icon={Inbox}
              variant="info"
            />
            <StatCard
              label="Overdue Tasks"
              value={categoryTasks.filter((t) => isOverdue(t.dueAt)).length}
              icon={AlertTriangle}
              variant={categoryTasks.some((t) => isOverdue(t.dueAt)) ? "danger" : "success"}
            />
          </>
        ) : role === "manager" ? (
          <>
            <StatCard
              label="Project Tasks"
              value={projectTasks.length}
              icon={FolderKanban}
              variant="primary"
            />
            <StatCard
              label="In Progress"
              value={projectTasks.filter((t) => t.status === TaskStatus.InProgress).length}
              icon={TrendingUp}
              variant="info"
            />
            <StatCard
              label="Outbox Requests"
              value={outboxList.length}
              icon={Send}
              variant="warning"
            />
            <StatCard
              label="Active Projects"
              value={projList.length}
              icon={Layers}
              variant="success"
            />
          </>
        ) : role === "admin" ? (
          <>
            <StatCard
              label="Total Categories"
              value={catList.length}
              icon={Building2}
              variant="primary"
            />
            <StatCard
              label="Active Projects"
              value={projList.length}
              icon={FolderKanban}
              variant="info"
            />
            <StatCard
              label="Global Tasks"
              value={tasksList.length}
              icon={CheckSquare}
              variant="warning"
            />
            <StatCard
              label="Pending Approvals"
              value={inboxList.length + reviewQueueTasks.length}
              icon={Star}
              variant="success"
            />
          </>
        ) : (
          <>
            <StatCard
              label="My Assigned Tasks"
              value={myAssignedTasks.length}
              icon={CheckSquare}
              variant="primary"
            />
            <StatCard
              label="In Progress"
              value={myAssignedTasks.filter((t) => t.status === TaskStatus.InProgress).length}
              icon={TrendingUp}
              variant="info"
            />
            <StatCard
              label="Submitted Reviews"
              value={myAssignedTasks.filter((t) => t.status === TaskStatus.SubmittedForReview).length}
              icon={Clock}
              variant="warning"
            />
            <StatCard
              label="Pending Requests"
              value={outboxList.length}
              icon={Inbox}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Two-column role-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Primary Task / Queue View */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">
              {role === "lead"
                ? "Category Task Queue"
                : role === "manager"
                  ? "Project Task Board"
                  : role === "admin"
                    ? "Recent Organization Tasks"
                    : "My Assigned Tasks"}
            </CardTitle>
            <Link href={role === "manager" ? "/tasks/project" : "/tasks/category"} aria-label="View all assigned tasks">
              <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="h-3 w-3" />} aria-label="View all assigned tasks">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-1 p-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (role === "lead" ? categoryTasks : role === "manager" ? projectTasks : role === "admin" ? tasksList : myAssignedTasks).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <CheckSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-semibold text-foreground">You are all caught up!</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  {role === "lead"
                    ? "All category tasks are up to date."
                    : "No pending tasks in your queue right now. Enjoy your day or browse available tasks."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {(role === "lead" ? categoryTasks : role === "manager" ? projectTasks : role === "admin" ? tasksList : myAssignedTasks)
                  .slice(0, 6)
                  .map((t) => (
                    <TaskRow key={t._id} task={t} />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Column 2: Role-tailored requests / approvals & quick actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">
                {role === "lead" || role === "admin"
                  ? "Pending Inbound Requests"
                  : role === "manager"
                    ? "Project Resource Outbox"
                    : "My Collaboration Requests"}
              </CardTitle>
              <Link href={role === "lead" || role === "admin" ? "/requests/inbox" : "/requests/outbox"} aria-label="View all collaboration requests">
                <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="h-3 w-3" />} aria-label="View all collaboration requests">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {inboxRequests.isLoading ? (
                <div className="space-y-1 p-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : (role === "lead" || role === "admin" ? inboxList : outboxList).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Inbox className="h-7 w-7 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No pending requests right now.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {(role === "lead" || role === "admin" ? inboxList : outboxList).slice(0, 5).map((r) => (
                    <RequestRow key={r._id} req={r} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role-specific Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {role === "admin"
                  ? "Admin Controls"
                  : role === "lead"
                    ? "Category Lead Actions"
                    : role === "manager"
                      ? "Project Manager Actions"
                      : "Quick Actions"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pt-0">
              {role === "lead" ? (
                [
                  { href: "/reviews",            label: "Review Queue",       icon: Star,         color: "text-warning" },
                  { href: "/tasks/category",     label: "Category Board",     icon: CheckSquare,  color: "text-primary" },
                  { href: "/requests/inbox",     label: "Inbound Requests",   icon: Inbox,        color: "text-info" },
                  { href: "/memberships",        label: "Team Memberships",   icon: Users,        color: "text-success" },
                ].map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:p-4 hover:bg-muted hover:border-primary/30 transition-colors text-center"
                  >
                    <div className={cn("rounded-lg bg-background p-2.5 shadow-xs group-hover:scale-110 transition-transform", color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </Link>
                ))
              ) : role === "manager" ? (
                [
                  { href: "/projects/new",       label: "New Project",        icon: PlusCircle,   color: "text-primary" },
                  { href: "/tasks/project",      label: "Project Tasks",      icon: FolderKanban, color: "text-success" },
                  { href: "/requests/outbox",    label: "Request Member",     icon: Send,         color: "text-warning" },
                  { href: "/reviews",            label: "Review Submissions", icon: Star,         color: "text-info" },
                ].map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:p-4 hover:bg-muted hover:border-primary/30 transition-colors text-center"
                  >
                    <div className={cn("rounded-lg bg-background p-2.5 shadow-xs group-hover:scale-110 transition-transform", color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </Link>
                ))
              ) : role === "admin" ? (
                [
                  { href: "/category/cat-1",     label: "Category View",      icon: Building2,    color: "text-primary" },
                  { href: "/projects",           label: "All Projects",       icon: FolderKanban, color: "text-success" },
                  { href: "/reviews",            label: "System Reviews",     icon: Star,         color: "text-warning" },
                  { href: "/settings",           label: "Platform Settings",  icon: Shield,       color: "text-info" },
                ].map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:p-4 hover:bg-muted hover:border-primary/30 transition-colors text-center"
                  >
                    <div className={cn("rounded-lg bg-background p-2.5 shadow-xs group-hover:scale-110 transition-transform", color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </Link>
                ))
              ) : (
                [
                  { href: "/tasks/category",     label: "Category Tasks",     icon: CheckSquare,  color: "text-primary" },
                  { href: "/tasks/project",      label: "Project Tasks",      icon: FolderKanban, color: "text-success" },
                  { href: "/requests/outbox",    label: "Send Request",       icon: Send,         color: "text-warning" },
                  { href: "/notifications",      label: "Notifications",      icon: Clock,        color: "text-info" },
                ].map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:p-4 hover:bg-muted hover:border-primary/30 transition-colors text-center"
                  >
                    <div className={cn("rounded-lg bg-background p-2.5 shadow-xs group-hover:scale-110 transition-transform", color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
