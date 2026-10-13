"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Search, Plus } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Task } from "@teamconnect/shared-types";
import { TaskScope } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ScopeChip } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate, isOverdue } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { CreateTaskModal } from "@/components/shared/create-task-modal";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "text-danger-text",
  high:   "text-warning-text",
  medium: "text-info-text",
  low:    "text-muted-foreground",
};

export function ProjectTasksClient() {
  const [search, setSearch] = React.useState("");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const debounced = useDebounce(search, 350);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tasks", "project", { search: debounced }],
    queryFn: () => {
      const p = new URLSearchParams({ scope: TaskScope.Project, limit: "50" });
      if (debounced) p.set("search", debounced);
      return apiClient.get<{ data: Task[] }>(`${ENDPOINTS.TASKS.LIST}?${p}`);
    },
    select: (r) => (r.success ? r.data.data : []),
  });

  const tasks = data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Project Tasks"
        description="Cross-category project tasks. Requires active project membership."
        breadcrumbs={[{ label: "Tasks" }, { label: "Project" }]}
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            size="sm"
            onClick={() => setCreateModalOpen(true)}
          >
            New Project Task
          </Button>
        }
      />
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search project tasks…"
          className="h-10 sm:h-9 w-full rounded-lg border border-border bg-card pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      {isLoading ? (
        <Card className="overflow-hidden p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-none border-b border-border last:border-b-0" />
          ))}
        </Card>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No project tasks yet"
          description={search ? `No project tasks match "${search}".` : "You have no project tasks yet. Create one to assign milestones or track deliverable progress."}
          action={search ? { label: "Clear search", onClick: () => setSearch("") } : { label: "Add Project Task", onClick: () => setCreateModalOpen(true) }}
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-2.5 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Task</span>
            <span>Status</span>
            <span>Assignee</span>
            <span>Due</span>
            <span>Project</span>
          </div>
          {tasks.map((t) => {
            const overdue = isOverdue(t.dueAt);
            return (
              <Link
                key={t._id}
                href={`/tasks/${t._id}`}
                className="group grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <ScopeChip scope={t.scope} size="xs" />
                    <span className={cn("text-xs font-semibold capitalize", PRIORITY_COLORS[t.priority])}>
                      {t.priority}
                    </span>
                  </div>
                  <p className={cn("text-sm font-medium truncate group-hover:text-primary transition-colors", overdue && "text-danger-text font-semibold")}>
                    {t.title}
                  </p>
                </div>
                <StatusBadge status={t.status} />
                {t.assignee ? <Avatar user={t.assignee} size="xs" showTooltip /> : <span className="text-xs text-muted-foreground">—</span>}
                <p className={cn("text-xs", overdue ? "text-danger-text font-semibold" : "text-muted-foreground")}>
                  {t.dueAt ? formatDate(t.dueAt, "MMM d") : "—"}
                </p>
                <span className="text-xs text-muted-foreground">{t.project?.name ?? "—"}</span>
              </Link>
            );
          })}
        </Card>
      )}

      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        defaultScope={TaskScope.Project}
        onSuccess={refetch}
      />
    </div>
  );
}
