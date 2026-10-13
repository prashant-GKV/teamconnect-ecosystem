"use client";
import * as React from "react";
import {
  BarChart3, Download, TrendingUp, Clock, CheckCircle2,
  AlertTriangle, Users, FolderKanban, ShieldCheck
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { INITIAL_CATEGORIES, INITIAL_PROJECTS, INITIAL_MEMBERSHIPS } from "@/lib/admin-data";

export default function ReportsAdminPage() {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Category,Lead,Members,TaskCompletionRate,ReviewTurnaroundHours,RequestApprovalRate\n" +
      INITIAL_CATEGORIES.map(
        (c) =>
          `"${c.name}","${c.lead?.name || "Vacant"}",${c.memberCount || 0},92%,26.4h,88%`
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `teamconnect-executive-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Organizational Analytics & Performance"
        description="Comprehensive operational metrics, review velocity, cross-category staffing ratios, and SLA compliance."
        actions={
          <Button size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1.5" />
            {downloadSuccess ? "Export Generated!" : "Export CSV Report"}
          </Button>
        }
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Task Completion"
          value="91.4%"
          icon={CheckCircle2}
          description="+3.2% vs previous quarter"
        />
        <StatCard
          label="Avg Review Turnaround"
          value="24.8 hrs"
          icon={Clock}
          description="SLA target is &lt; 48 hours"
        />
        <StatCard
          label="Request Approval Rate"
          value="87.5%"
          icon={TrendingUp}
          description="Cross-category requests approved"
        />
        <StatCard
          label="Expiring Memberships"
          value="1"
          icon={AlertTriangle}
          description="Active within 7-day window"
        />
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Workload Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Departmental Review Velocity & SLAs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border uppercase font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Staff Count</th>
                    <th className="p-3.5">Completion Rate</th>
                    <th className="p-3.5">Avg Turnaround</th>
                    <th className="p-3.5 text-right">SLA Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {INITIAL_CATEGORIES.map((c) => (
                    <tr key={c._id} className="hover:bg-muted/30">
                      <td className="p-3.5 font-semibold text-foreground">{c.name}</td>
                      <td className="p-3.5">{c.memberCount || 0}</td>
                      <td className="p-3.5 text-emerald-600 font-medium">92%</td>
                      <td className="p-3.5 font-mono">22.4h</td>
                      <td className="p-3.5 text-right">
                        <Badge variant="success" className="text-2xs">
                          98.5%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Project Staffing Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Cross-Category Staffing Duration Ratios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Active & Within Schedule (> 14 days)", count: 4, pct: 65, color: "bg-emerald-500" },
                { label: "Expiring Soon (< 7 days)", count: 1, pct: 15, color: "bg-amber-500" },
                { label: "Pending Activation (Future Start)", count: 1, pct: 10, color: "bg-sky-500" },
                { label: "Revoked / Access Terminated", count: 1, pct: 10, color: "bg-rose-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">{item.label}</span>
                    <span className="text-muted-foreground font-mono">{item.count} memberships ({item.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg border border-border bg-card/60 text-xs text-muted-foreground mt-4">
              <p className="font-semibold text-foreground mb-1">Delegated Action Auditing:</p>
              <p>100% of delegated approvals preserve actor identity alongside delegating primary lead in the immutable audit log.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
