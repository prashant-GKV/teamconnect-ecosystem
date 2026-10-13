"use client";
import * as React from "react";
import Link from "next/link";
import {
  Users, Shield, FolderKanban, Network, AlertTriangle,
  ArrowUpRight, Clock, CheckCircle2, UserPlus, ShieldAlert,
  BarChart3, RefreshCw
} from "lucide-react";
import {
  INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_PROJECTS,
  INITIAL_MEMBERSHIPS, INITIAL_AUDIT_LOGS
} from "@/lib/admin-data";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/dates";

export default function AdminDashboardPage() {
  const [users] = React.useState(INITIAL_USERS);
  const [categories] = React.useState(INITIAL_CATEGORIES);
  const [projects] = React.useState(INITIAL_PROJECTS);
  const [memberships] = React.useState(INITIAL_MEMBERSHIPS);
  const [auditLogs] = React.useState(INITIAL_AUDIT_LOGS);

  const activeUsers = users.filter((u) => u.isActive).length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const expiringMemberships = memberships.filter((m) => m.status === "expiring_soon").length;
  const unassignedCategories = categories.filter((c) => !c.lead && c.isActive).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Executive Oversight Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            System-wide operational governance, cross-category staffing health, and security controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/users/new">
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-1.5" /> Provision User
            </Button>
          </Link>
          <Link href="/reports">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-1.5" /> View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical System Alerts */}
      {(expiringMemberships > 0 || unassignedCategories > 0) && (
        <div className="space-y-2">
          {unassignedCategories > 0 && (
            <div className="p-3 rounded-lg border border-warning/40 bg-warning/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-warning font-medium text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Governance Alert: {unassignedCategories} active category has no primary lead assigned.</span>
              </div>
              <Link href="/categories">
                <Button variant="outline" size="sm" className="h-7 text-xs border-warning/40 text-warning hover:bg-warning/20">
                  Assign Lead
                </Button>
              </Link>
            </div>
          )}
          {expiringMemberships > 0 && (
            <div className="p-3 rounded-lg border border-danger/30 bg-danger/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-danger font-medium text-sm">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{expiringMemberships} cross-category membership nearing expiration (&lt; 7 days).</span>
              </div>
              <Link href="/memberships">
                <Button variant="outline" size="sm" className="h-7 text-xs border-danger/30 text-danger hover:bg-danger/20">
                  Review Access
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Users"
          value={activeUsers}
          icon={Users}
          description="Provisioned employees & contractors"
        />
        <StatCard
          label="Operational Categories"
          value={categories.filter((c) => c.isActive).length}
          icon={Shield}
          description="Governed organizational units"
        />
        <StatCard
          label="Active Projects"
          value={activeProjects}
          icon={FolderKanban}
          description="Cross-category initiatives"
        />
        <StatCard
          label="Expiring Memberships"
          value={expiringMemberships}
          icon={Network}
          description="Requires renewal or transition"
        />
      </div>

      {/* Grid: Categories Overview & Recent Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Governance Status (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Category Governance Health</CardTitle>
              <Link href="/categories" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                Manage all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border text-sm">
                {categories.map((cat) => (
                  <div key={cat._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/categories/${cat._id}`} className="font-semibold text-foreground hover:text-primary">
                          {cat.name}
                        </Link>
                        <Badge variant={cat.isActive ? "success" : "muted"}>
                          {cat.isActive ? "Active" : "Archived"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-foreground">
                        {cat.lead ? cat.lead.name : <span className="text-warning font-semibold">Vacant Lead</span>}
                      </p>
                      <p className="text-2xs text-muted-foreground">{cat.memberCount} members</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cross Category Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Cross-Category Projects</CardTitle>
              <Link href="/projects" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border text-sm">
                {projects.slice(0, 3).map((proj) => (
                  <div key={proj._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div>
                      <Link href={`/projects/${proj._id}`} className="font-medium text-foreground hover:text-primary">
                        {proj.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Manager: {proj.manager?.name} · Origin: {proj.originCategory.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={proj.status === "active" ? "success" : "muted"} className="capitalize">
                        {proj.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{proj.memberCount} staffed</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Stream (1 col) */}
        <div className="space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Audit Events</CardTitle>
              <Link href="/audit" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                Full log <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-y-auto max-h-[500px]">
              <div className="divide-y divide-border text-xs">
                {auditLogs.map((entry) => (
                  <div key={entry._id} className="p-3.5 hover:bg-muted/30 transition-colors space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground font-mono">{entry.action}</span>
                      <span className="text-muted-foreground">{formatDate(entry.createdAt)}</span>
                    </div>
                    <p className="text-muted-foreground">
                      Actor: <span className="text-foreground">{entry.actor.name}</span>
                    </p>
                    <p className="text-2xs text-muted-foreground font-mono">
                      Target: {entry.resource}:{entry.resourceId}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
