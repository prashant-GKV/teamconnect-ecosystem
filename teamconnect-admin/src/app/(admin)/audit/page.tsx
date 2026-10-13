"use client";
import * as React from "react";
import {
  ScrollText, Search, Filter, ShieldCheck,
  Calendar, User, Lock, ArrowRight
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { INITIAL_AUDIT_LOGS } from "@/lib/admin-data";
import { formatDate } from "@/lib/dates";

export default function AuditAdminPage() {
  const [logs] = React.useState(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("all");

  const filteredLogs = React.useMemo(() => {
    return logs.filter((entry) => {
      const matchSearch =
        entry.actor.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.action.toLowerCase().includes(search.toLowerCase()) ||
        entry.resourceId.toLowerCase().includes(search.toLowerCase());
      const matchAction = actionFilter === "all" || entry.action === actionFilter;
      return matchSearch && matchAction;
    });
  }, [logs, search, actionFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Immutable Audit Trail"
        description="Append-only cryptographic record of all administrative actions, role assignments, category lead modifications, and delegated approvals."
        badges={
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
            <Lock className="h-3 w-3" />
            <span>Tamper-evident log</span>
          </div>
        }
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by actor, action, or resource ID..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
            >
              <option value="all">All Action Types</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="approve">Approve</option>
              <option value="revoke">Revoke</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Timestamp (UTC)</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor & Authority Scope</th>
                  <th className="p-4">Target Resource</th>
                  <th className="p-4">Context Metadata</th>
                  <th className="p-4">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((entry) => (
                  <tr key={entry._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-foreground font-mono bg-muted px-2 py-0.5 rounded">
                        {entry.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-foreground">{entry.actor.name}</p>
                        <p className="text-2xs text-muted-foreground">{entry.actor.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="uppercase text-muted-foreground">{entry.resource}:</span>{" "}
                      <span className="text-foreground">{entry.resourceId}</span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                      {entry.reason || "Administrative state transition"}
                    </td>
                    <td className="p-4 font-mono text-2xs text-muted-foreground">
                      {entry.ip || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
