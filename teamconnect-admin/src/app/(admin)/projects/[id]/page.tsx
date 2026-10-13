"use client";
import * as React from "react";
import Link from "next/link";
import {
  FolderKanban, ChevronLeft, Users, Calendar,
  Shield, CheckCircle2, Clock, AlertTriangle
} from "lucide-react";
import { INITIAL_PROJECTS, INITIAL_MEMBERSHIPS } from "@/lib/admin-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import { formatDate } from "@/lib/dates";

export default function ProjectAdminDetailPage({ params }: { params: { id: string } }) {
  const project = (INITIAL_PROJECTS.find((p) => p._id === params.id) || INITIAL_PROJECTS[0])!;
  const members = INITIAL_MEMBERSHIPS.filter((m) => m.project._id === project._id);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Projects
          </Button>
        </Link>
      </div>

      <PageHeader
        title={project.name}
        description={project.description || "Project governance, assigned manager, milestones, and cross-category team roster."}
        badges={
          <Badge variant={project.status === "active" ? "success" : "muted"} className="capitalize">
            {project.status.replace(/_/g, " ")}
          </Badge>
        }
      />

      {/* Meta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Governance & Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Project Manager</p>
              <div className="flex items-center gap-2 mt-1">
                <Avatar name={project.manager?.name || "Unassigned"} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{project.manager?.name}</p>
                  <p className="text-xs text-muted-foreground">{project.manager?.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Origin Category</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{project.originCategory.name}</p>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Duration Bounds</p>
              <p className="text-xs font-mono text-foreground mt-0.5">
                {formatDate(project.startAt)} – {formatDate(project.endAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Staffing & Memberships (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Cross-Category Staffing Roster</CardTitle>
              <span className="text-xs text-muted-foreground">{members.length} allocated</span>
            </CardHeader>
            <CardContent className="p-0">
              {members.length === 0 ? (
                <p className="p-6 text-xs text-muted-foreground text-center">
                  No cross-category members currently assigned to this project.
                </p>
              ) : (
                <div className="divide-y divide-border text-sm">
                  {members.map((mbr) => (
                    <div key={mbr._id} className="p-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Avatar name={mbr.user.name} size="xs" />
                          <div>
                            <p className="font-semibold text-foreground">{mbr.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Origin: {mbr.sourceCategory.name} · Role: {mbr.role}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize text-2xs self-start sm:self-center">
                          {mbr.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <MembershipValidityBar startAt={mbr.startAt} endAt={mbr.endAt} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Project Milestones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!project.milestones || project.milestones.length === 0) ? (
                <p className="p-4 text-xs text-muted-foreground">No specific milestones configured for this project.</p>
              ) : (
                <div className="divide-y divide-border text-sm">
                  {project.milestones.map((ms) => (
                    <div key={ms._id} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${ms.status === "completed" ? "text-emerald-500" : "text-muted-foreground"}`} />
                        <span className="font-medium text-foreground">{ms.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(ms.targetDate)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
