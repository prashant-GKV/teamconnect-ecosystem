"use client";
import * as React from "react";
import Link from "next/link";
import {
  Network, Search, Filter, AlertTriangle, Clock,
  CheckCircle2, Ban, RotateCcw, XCircle
} from "lucide-react";
import { INITIAL_MEMBERSHIPS } from "@/lib/admin-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import { formatDate } from "@/lib/dates";
import { MembershipStatus } from "@teamconnect/shared-types";
import type { ProjectMember } from "@teamconnect/shared-types";

export default function MembershipsAdminPage() {
  const [memberships, setMemberships] = React.useState<ProjectMember[]>(INITIAL_MEMBERSHIPS);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [revokeTarget, setRevokeTarget] = React.useState<ProjectMember | null>(null);

  const filteredMemberships = React.useMemo(() => {
    return memberships.filter((m) => {
      const matchSearch =
        m.user.name.toLowerCase().includes(search.toLowerCase()) ||
        m.project.name.toLowerCase().includes(search.toLowerCase()) ||
        m.sourceCategory.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [memberships, search, statusFilter]);

  const handleConfirmRevoke = () => {
    if (!revokeTarget) return;
    setMemberships((prev) =>
      prev.map((m) => (m._id === revokeTarget._id ? { ...m, status: MembershipStatus.Revoked } : m))
    );
    setRevokeTarget(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Cross-Category Membership Governance"
        description="Monitor time-bound project staffing, validity intervals, renewal requests, and emergency revocation authority."
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by member, project, or category..."
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
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="approved_not_yet_active">Approved (Not Yet Active)</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Memberships Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Assigned Project</th>
                  <th className="p-4">Source Category</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status & Validity</th>
                  <th className="p-4 text-right">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMemberships.map((mbr) => (
                  <tr key={mbr._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={mbr.user.name} size="sm" />
                        <div>
                          <p className="font-semibold text-foreground">{mbr.user.name}</p>
                          <p className="text-xs text-muted-foreground">{mbr.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Link href={`/projects/${mbr.project._id}`} className="font-medium text-foreground hover:text-primary">
                        {mbr.project.name}
                      </Link>
                    </td>
                    <td className="p-4 text-xs font-medium text-foreground">
                      {mbr.sourceCategory.name}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize text-2xs">
                        {mbr.role}
                      </Badge>
                    </td>
                    <td className="p-4 min-w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-2xs">
                          <Badge
                            variant={
                              mbr.status === "active"
                                ? "success"
                                : mbr.status === "expiring_soon"
                                ? "warning"
                                : mbr.status === "revoked"
                                ? "danger"
                                : "muted"
                            }
                            className="capitalize text-2xs"
                          >
                            {mbr.status.replace(/_/g, " ")}
                          </Badge>
                          {mbr.renewalPending && (
                            <span className="text-amber-500 font-semibold">Renewal Pending</span>
                          )}
                        </div>
                        <MembershipValidityBar startAt={mbr.startAt} endAt={mbr.endAt} />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {mbr.status !== "revoked" && mbr.status !== "expired" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRevokeTarget(mbr)}
                          className="text-danger hover:bg-danger/10 border-danger/30 text-xs h-7"
                        >
                          Revoke Access
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Access Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Revocation Dialog */}
      <ConfirmDialog
        open={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleConfirmRevoke}
        title="Revoke Project Access"
        description={`Are you sure you want to revoke access for ${revokeTarget?.user.name} on project "${revokeTarget?.project.name}"? This will terminate their project permissions immediately and notify all leads.`}
        confirmText="Confirm Immediate Revocation"
        variant="danger"
      />
    </div>
  );
}
