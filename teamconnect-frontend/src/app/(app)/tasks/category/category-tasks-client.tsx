"use client";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Filter, Search, LayoutGrid, List,
  SortAsc, CheckSquare, MoreHorizontal, ChevronDown,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Task } from "@teamconnect/shared-types";
import { TaskStatus, TaskScope, TaskPriority } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge, ScopeChip } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate, isOverdue } from "@/lib/dates";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { CreateTaskModal } from "@/components/shared/create-task-modal";

// ── Filters ────────────────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { label: "All",         value: "" },
  { label: "Assigned",    value: TaskStatus.Assigned },
  { label: "In Progress", value: TaskStatus.InProgress },
  { label: "In Review",   value: TaskStatus.SubmittedForReview },
  { label: "Approved",    value: TaskStatus.Approved },
  { label: "Blocked",     value: TaskStatus.Blocked },
];

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "text-danger",
  high:   "text-warning",
  medium: "text-info",
  low:    "text-muted-foreground",
};

// ── Task Card (grid view) ──────────────────────────────────────────────────────
function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task.dueAt);
  return (
    <Link href={`/tasks/${task._id}`}>
      <Card
        hover
        className={cn(
          "p-4 space-y-3 cursor-pointer",
          overdue && "border-danger/30 bg-danger/5"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <ScopeChip scope={task.scope} size="xs" />
              <span className={cn("text-xs font-medium capitalize", PRIORITY_COLORS[task.priority])}>
                {task.priority}
              </span>
            </div>
            <h3 className="text-sm font-medium leading-snug line-clamp-2">{task.title}</h3>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {task.dueAt && (
          <p className={cn("text-xs", overdue ? "text-danger font-medium" : "text-muted-foreground")}>
            {overdue ? "⚠ Overdue · " : "Due "}{formatDate(task.dueAt, "MMM d, yyyy")}
          </p>
        )}

        <div className="flex items-center justify-between">
          {task.assignee
            ? <Avatar user={task.assignee} size="xs" showTooltip />
            : <span className="text-xs text-muted-foreground">Unassigned</span>
          }
          {task.latestSubmission && (
            <Badge variant={task.status === TaskStatus.Approved ? "success" : "muted"} size="sm">
              v{task.latestSubmission.version}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}

// ── Task Row (list view) ───────────────────────────────────────────────────────
function TaskRow({ task }: { task: Task }) {
  const overdue = isOverdue(task.dueAt);
  return (
    <Link
      href={`/tasks/${task._id}`}
      className={cn(
        "group grid items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors",
        "grid-cols-[1fr_auto_auto_auto_auto]"
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <ScopeChip scope={task.scope} size="xs" />
          <span className={cn("text-xs font-medium capitalize", PRIORITY_COLORS[task.priority])}>
            {task.priority}
          </span>
        </div>
        <p className={cn(
          "text-sm font-medium truncate group-hover:text-primary transition-colors",
          overdue && "text-danger"
        )}>
          {task.title}
        </p>
      </div>
      <StatusBadge status={task.status} />
      {task.assignee
        ? <Avatar user={task.assignee} size="xs" showTooltip />
        : <span className="text-xs text-muted-foreground">—</span>
      }
      <p className={cn("text-xs", overdue ? "text-danger font-medium" : "text-muted-foreground")}>
        {task.dueAt ? formatDate(task.dueAt, "MMM d") : "—"}
      </p>
      <span className="text-xs text-muted-foreground">{task.category?.name ?? "—"}</span>
    </Link>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export function CategoryTasksClient() {
  const [view, setView]     = React.useState<"grid" | "list">("list");
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const debouncedSearch     = useDebounce(search, 350);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tasks", "category", { search: debouncedSearch, status }],
    queryFn:  () => {
      const params = new URLSearchParams({ scope: TaskScope.Category, limit: "50" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (status)          params.set("status", status);
      return apiClient.get<{ data: Task[] }>(`${ENDPOINTS.TASKS.LIST}?${params}`);
    },
    select: r => r.success ? r.data.data : [],
  });

  const tasks = data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Category Tasks"
        description="Tasks scoped to your category. Only category leads and delegates can create and review these."
        breadcrumbs={[{ label: "Tasks" }, { label: "Category" }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setCreateModalOpen(true)}>
            New Task
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="h-9 w-full rounded-lg border border-border bg-muted/40 pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                status === f.value
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden ml-auto">
          <button
            onClick={() => setView("list")}
            className={cn("p-2 transition-colors", view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("grid")}
            className={cn("p-2 transition-colors", view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden p-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-none border-b border-border last:border-b-0" />
            ))}
          </Card>
        )
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks here yet"
          description={search ? `No category tasks match "${search}". Try clearing your filters.` : "Nothing here yet — add your first task to start organizing category work."}
          action={search ? { label: "Clear search", onClick: () => setSearch("") } : { label: "Add First Task", onClick: () => setCreateModalOpen(true) }}
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(t => <TaskCard key={t._id} task={t} />)}
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          {/* List header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-2.5 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Task</span>
            <span>Status</span>
            <span>Assignee</span>
            <span>Due</span>
            <span>Category</span>
          </div>
          {tasks.map(t => <TaskRow key={t._id} task={t} />)}
        </Card>
      )}

      {/* Count */}
      {!isLoading && tasks.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </p>
      )}

      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        defaultScope={TaskScope.Category}
        onSuccess={refetch}
      />
    </div>
  );
}
