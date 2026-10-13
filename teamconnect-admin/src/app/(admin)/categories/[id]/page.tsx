"use client";
import * as React from "react";
import Link from "next/link";
import {
  Shield, ChevronLeft, UserCheck, AlertTriangle,
  UserX, Plus, CheckCircle2, Calendar, Lock
} from "lucide-react";
import {
  INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_DELEGATES
} from "@/lib/admin-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { InlineAlert } from "@/components/ui/inline-alert";
import { formatDate } from "@/lib/dates";
import { DelegatePermission, DelegationStatus } from "@teamconnect/shared-types";
import type { CategoryDelegate, Category } from "@teamconnect/shared-types";

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const fallbackCat = INITIAL_CATEGORIES[0] as Category;
  const [category, setCategory] = React.useState<Category>(() =>
    INITIAL_CATEGORIES.find((c) => c._id === params.id) ?? fallbackCat
  );
  const [delegates, setDelegates] = React.useState<CategoryDelegate[]>(() =>
    INITIAL_DELEGATES.filter((d) => d.categoryId === category._id)
  );

  // Modals & form state
  const [isAssignLeadOpen, setIsAssignLeadOpen] = React.useState(false);
  const [selectedLeadId, setSelectedLeadId] = React.useState("");
  const [leadError, setLeadError] = React.useState<string | null>(null);

  const [isAddDelegateOpen, setIsAddDelegateOpen] = React.useState(false);
  const [delegateUserId, setDelegateUserId] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<DelegatePermission[]>([
    DelegatePermission.ReviewTask,
  ]);
  const [effectiveFrom, setEffectiveFrom] = React.useState(new Date().toISOString().slice(0, 10));
  const [effectiveTo, setEffectiveTo] = React.useState(
    new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10)
  );
  const [delegateError, setDelegateError] = React.useState<string | null>(null);

  // Assign or reassign primary lead
  const handleAssignLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    const user = INITIAL_USERS.find((u) => u._id === selectedLeadId);
    if (!user) return;

    setCategory((prev: Category) => ({
      ...prev,
      lead: { _id: user._id, name: user.name, email: user.email, accountType: user.accountType },
      updatedAt: new Date().toISOString(),
    }));
    setIsAssignLeadOpen(false);
  };

  // Add delegate with allowlisted permissions
  const handleAddDelegate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateUserId) {
      setDelegateError("Please select a target user.");
      return;
    }
    if (selectedPermissions.length === 0) {
      setDelegateError("At least one allowlisted permission must be selected.");
      return;
    }
    // Block self-escalation if user is already primary lead
    if (category.lead && category.lead._id === delegateUserId) {
      setDelegateError("Primary Category Lead already holds all authorities. Circular delegation is invalid.");
      return;
    }

    const targetUser = INITIAL_USERS.find((u) => u._id === delegateUserId);
    if (!targetUser) return;

    const newDelegate: CategoryDelegate = {
      _id: `del-${Date.now()}`,
      categoryId: category._id,
      delegate: { _id: targetUser._id, name: targetUser.name, email: targetUser.email, accountType: targetUser.accountType },
      grantedBy: category.lead || { _id: "admin", name: "Org Admin", email: "admin@acme.com", accountType: "employee" as any },
      permissions: selectedPermissions,
      effectiveFrom: new Date(effectiveFrom).toISOString(),
      effectiveTo: new Date(effectiveTo).toISOString(),
      status: DelegationStatus.Active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDelegates([...delegates, newDelegate]);
    setIsAddDelegateOpen(false);
    setDelegateUserId("");
    setDelegateError(null);
  };

  const handleRevokeDelegate = (delId: string) => {
    setDelegates((prev) =>
      prev.map((d) => (d._id === delId ? { ...d, status: DelegationStatus.Revoked } : d))
    );
  };

  const togglePermission = (perm: DelegatePermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/categories">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Categories
          </Button>
        </Link>
      </div>

      <PageHeader
        title={category.name}
        description={category.description || "Operational unit governance and delegated approver lifecycle."}
        badges={
          <Badge variant={category.isActive ? "success" : "muted"}>
            {category.isActive ? "Active Unit" : "Archived"}
          </Badge>
        }
        actions={
          <Button size="sm" variant="outline" onClick={() => setIsAssignLeadOpen(true)}>
            <UserCheck className="h-4 w-4 mr-1.5" /> Reassign Primary Lead
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left col: Lead Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Primary Category Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.lead ? (
                <div className="flex items-start gap-3">
                  <Avatar name={category.lead.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground">{category.lead.name}</p>
                    <p className="text-xs text-muted-foreground">{category.lead.email}</p>
                    <Badge variant="outline" className="mt-2 text-2xs uppercase">
                      {category.lead.accountType}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-warning/40 bg-warning/10 text-xs text-warning space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>No Lead Assigned</span>
                  </div>
                  <p>Category governance requires exactly one primary lead for request approvals.</p>
                  <Button size="sm" onClick={() => setIsAssignLeadOpen(true)} className="w-full text-xs">
                    Assign Primary Lead
                  </Button>
                </div>
              )}

              <p className="text-2xs text-muted-foreground pt-2 border-t border-border">
                Rule: An active category cannot have its lead removed without designating an immediate replacement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Roster Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Total Category Members:</span>
                <span className="font-semibold text-foreground">{category.memberCount || 1}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Delegations:</span>
                <span className="font-semibold text-foreground">
                  {delegates.filter((d) => d.status === DelegationStatus.Active).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right col: Delegates Management (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Delegated Approvers</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Time-bound, permission-allowlisted delegates acting on behalf of the Primary Lead.
                </p>
              </div>
              <Button size="sm" onClick={() => setIsAddDelegateOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> Add Delegate
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {delegates.length === 0 ? (
                <p className="p-6 text-center text-xs text-muted-foreground">
                  No delegates configured. All category-level review and request approvals fall strictly to the Primary Lead.
                </p>
              ) : (
                <div className="divide-y divide-border text-sm">
                  {delegates.map((del) => (
                    <div key={del._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Avatar name={del.delegate.name} size="xs" />
                          <span className="font-semibold text-foreground">{del.delegate.name}</span>
                          <Badge variant={del.status === DelegationStatus.Active ? "success" : "muted"} className="capitalize text-2xs">
                            {del.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Valid: {formatDate(del.effectiveFrom)} – {formatDate(del.effectiveTo)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {del.permissions.map((perm) => (
                            <span key={perm} className="text-2xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                      {del.status === DelegationStatus.Active && (
                        <div className="self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeDelegate(del._id)}
                            className="text-danger hover:bg-danger/10 border-danger/30 text-xs h-7"
                          >
                            Revoke Delegation
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Primary Lead Modal */}
      <Modal
        open={isAssignLeadOpen}
        onClose={() => setIsAssignLeadOpen(false)}
        title="Assign Primary Category Lead"
      >
        <form onSubmit={handleAssignLead} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Selecting a new lead transfers full category review authority and governance. Historical actions by prior leads remain permanently audited.
          </p>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
              Select Lead *
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
              required
            >
              <option value="">Choose an eligible user...</option>
              {INITIAL_USERS.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} — {u.email} ({u.accountType})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAssignLeadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedLeadId}>
              Confirm Lead Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Delegate Modal */}
      <Modal
        open={isAddDelegateOpen}
        onClose={() => setIsAddDelegateOpen(false)}
        title="Authorize Scoped Delegate"
      >
        <form onSubmit={handleAddDelegate} className="space-y-4">
          {delegateError && (
            <InlineAlert
              variant="danger"
              title="Delegation Error"
              description={delegateError}
            />
          )}

          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
              Target User *
            </label>
            <select
              value={delegateUserId}
              onChange={(e) => setDelegateUserId(e.target.value)}
              className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
              required
            >
              <option value="">Select a user...</option>
              {INITIAL_USERS.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">
              Allowlisted Authorities *
            </label>
            <div className="space-y-2">
              {[
                { perm: DelegatePermission.ReviewTask, label: "Review Category Tasks", desc: "Evaluate submissions, approve tasks, and request revisions." },
                { perm: DelegatePermission.ApproveRequest, label: "Decide Cross-Category Requests", desc: "Approve or reject incoming cross-category staffing requests." },
              ].map((item) => (
                <label
                  key={item.perm}
                  className="flex items-start gap-2 p-2.5 rounded-lg border border-border hover:bg-muted/40 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(item.perm)}
                    onChange={() => togglePermission(item.perm)}
                    className="mt-0.5 rounded border-border"
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-2xs text-muted-foreground">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Effective From
              </label>
              <Input
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Effective To
              </label>
              <Input
                type="date"
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAddDelegateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!delegateUserId || selectedPermissions.length === 0}>
              Grant Delegation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
