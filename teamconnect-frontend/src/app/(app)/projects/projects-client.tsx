"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Plus, Search, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Project } from "@teamconnect/shared-types";
import { ProjectStatus } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/cn";

const STATUS_FILTERS = [
  { label: "All",       value: "" },
  { label: "Active",    value: ProjectStatus.Active },
  { label: "On Hold",   value: ProjectStatus.OnHold },
  { label: "Completed", value: ProjectStatus.Completed },
];

function ProjectCard({ project }: { project: Project }) {
  const totalMilestones     = project.milestones.length;
  const completedMilestones = project.milestones.filter(m => m.status === "completed").length;
  const progress            = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <Link href={`/projects/${project._id}`}>
      <Card hover className="p-5 space-y-4 cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={project.status} />
            </div>
            <h3 className="font-heading font-semibold text-base leading-snug line-clamp-2">{project.name}</h3>
            {project.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(project.endAt, "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {project.memberCount} members
          </span>
        </div>

        {totalMilestones > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Milestones</span>
              <span>{completedMilestones}/{totalMilestones}</span>
            </div>
            <ProgressBar value={progress} size="sm" variant={progress === 100 ? "success" : "primary"} />
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar user={project.manager} size="xs" />
            <span className="text-xs text-muted-foreground">{project.manager.name}</span>
          </div>
          <Badge variant="muted" size="sm">{project.originCategory.name}</Badge>
        </div>
      </Card>
    </Link>
  );
}

export function ProjectsClient() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const debounced = useDebounce(search, 350);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", { search: debounced, status }],
    queryFn: () => {
      const p = new URLSearchParams({ limit: "50" });
      if (debounced) p.set("search", debounced);
      if (status)    p.set("status", status);
      return apiClient.get<{ data: Project[] }>(`${ENDPOINTS.PROJECTS.LIST}?${p}`);
    },
    select: r => r.success ? r.data.data : [],
  });

  const projects = data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Projects"
        description="Cross-category projects you are a member of or manage."
        breadcrumbs={[{ label: "Projects" }]}
        actions={
          <Link href="/projects/new">
            <Button leftIcon={<Plus className="h-4 w-4" />} size="sm">New Project</Button>
          </Link>
        }
      />
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects…"
            className="h-10 sm:h-9 w-full rounded-lg border border-border bg-card pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"/>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={()=>setStatus(f.value)}
              className={cn("rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
                status===f.value?"bg-primary text-white border-primary":"border-border text-muted-foreground hover:border-primary/40")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-52 rounded-xl"/>)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects here yet"
          description="You are not a member of any active projects yet. Launch a new initiative or request to join a project."
          action={{ label: "New Project", onClick: () => window.location.href = "/projects/new" }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => <ProjectCard key={p._id} project={p}/>)}
        </div>
      )}
    </div>
  );
}