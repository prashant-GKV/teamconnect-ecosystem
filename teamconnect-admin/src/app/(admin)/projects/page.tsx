"use client";
import * as React from "react";
import Link from "next/link";
import {
  FolderKanban, Users, Calendar, ArrowRight,
  Search, Filter
} from "lucide-react";
import { INITIAL_PROJECTS } from "@/lib/admin-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/dates";

export default function ProjectsAdminPage() {
  const [projects] = React.useState(INITIAL_PROJECTS);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredProjects = React.useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.originCategory.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Project Portfolio Oversight"
        description="Monitor cross-category initiatives, assigned Project Managers, staffing levels, and schedule health."
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name or origin..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
            >
              <option value="all">All Lifecycle States</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <Card key={proj._id} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">{proj.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {proj.description}
                </p>
              </div>
              <Badge variant={proj.status === "active" ? "success" : "muted"} className="capitalize">
                {proj.status.replace(/_/g, " ")}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pt-4">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Origin Category:</span>
                  <span className="font-semibold text-foreground">{proj.originCategory.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Project Manager:</span>
                  <span className="font-semibold text-foreground">{proj.manager?.name || "Unassigned"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Timeline:</span>
                  <span className="font-mono text-muted-foreground">
                    {formatDate(proj.startAt)} – {formatDate(proj.endAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cross-Category Staff:</span>
                  <span className="font-semibold text-foreground">{proj.memberCount || 0} members</span>
                </div>
              </div>

              <div className="pt-4 mt-auto border-t border-border flex justify-end">
                <Link href={`/projects/${proj._id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Project Oversight Details <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
