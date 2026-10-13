"use client";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Sun, Moon, Monitor, Bell, Shield, UserPlus,
  Trash2, AlertTriangle, Check, ShieldAlert,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import type { UserWithRoles, CategoryDelegate, PaginatedResponse } from "@teamconnect/shared-types";
import { DelegatePermission } from "@teamconnect/shared-types";

export function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [delegateModal, setDelegateModal] = React.useState(false);
  const [delegateUserId, setDelegateUserId] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<DelegatePermission[]>([
    DelegatePermission.ManageCategoryTasks,
    DelegatePermission.ReviewTask,
  ]);
  const [effectiveFrom, setEffectiveFrom] = React.useState("");
  const [effectiveTo, setEffectiveTo] = React.useState("");

  // Current user info
  const { data: user } = useQuery({
    queryKey: ["me-settings"],
    queryFn: () => apiClient.get<UserWithRoles>("/api/v1/users/me/profile"),
    select: (r) => (r.success ? r.data : null),
  });

  // Check if current user is a Category Lead
  const leadCategory = user?.categoryRoles?.find((cr) => cr.isPrimaryLead);

  // Fetch delegates if user is a lead
  const { data: delegates = [] } = useQuery({
    queryKey: ["category-delegates", leadCategory?.categoryId],
    queryFn: () => apiClient.get<PaginatedResponse<CategoryDelegate>>(`/api/v1/categories/${leadCategory?.categoryId}/delegates`),
    enabled: Boolean(leadCategory),
    select: (r) => (r.success ? r.data.data : []),
  });

  // Grant delegate mutation
  const grantDelegateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post(`/api/v1/categories/${leadCategory?.categoryId}/delegates`, data),
    onSuccess: () => {
      toast({ title: "Delegate access granted", description: "Scoped authority is now active for the specified dates." });
      setDelegateModal(false);
      setDelegateUserId("");
      queryClient.invalidateQueries({ queryKey: ["category-delegates"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to grant delegation", description: err.message, variant: "danger" });
    },
  });

  // Revoke delegate mutation
  const revokeDelegateMutation = useMutation({
    mutationFn: (delegateId: string) =>
      apiClient.delete(`/api/v1/categories/${leadCategory?.categoryId}/delegates/${delegateId}`),
    onSuccess: () => {
      toast({ title: "Delegation revoked", description: "Delegate access has been immediately disabled." });
      queryClient.invalidateQueries({ queryKey: ["category-delegates"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to revoke delegation", description: err.message, variant: "danger" });
    },
  });

  const togglePermission = (perm: DelegatePermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleGrantDelegate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCategory) return;
    grantDelegateMutation.mutate({
      delegateId: delegateUserId || "u-emp-1",
      permissions: selectedPermissions,
      effectiveFrom: effectiveFrom ? new Date(effectiveFrom).toISOString() : new Date().toISOString(),
      effectiveTo: effectiveTo ? new Date(effectiveTo).toISOString() : new Date(Date.now() + 14 * 86400000).toISOString(),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings & Preferences"
        description="Manage appearance, notifications, and scoped delegations for your category."
      />

      {/* Appearance Section */}
      <Card className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-sm">Appearance & Theme</h3>
          <p className="text-xs text-muted-foreground">Select your interface theme preference.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border gap-2 transition-all",
              theme === "light"
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border hover:bg-muted text-foreground"
            )}
          >
            <Sun className="h-5 w-5" />
            <span className="text-xs">Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border gap-2 transition-all",
              theme === "dark"
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border hover:bg-muted text-foreground"
            )}
          >
            <Moon className="h-5 w-5" />
            <span className="text-xs">Dark</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border gap-2 transition-all",
              theme === "system"
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border hover:bg-muted text-foreground"
            )}
          >
            <Monitor className="h-5 w-5" />
            <span className="text-xs">System</span>
          </button>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-sm">Notifications</h3>
          <p className="text-xs text-muted-foreground">Configure how you receive review alerts and staffing updates.</p>
        </div>
        <div className="space-y-3 max-w-lg">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">In-App Notifications</p>
              <p className="text-xs text-muted-foreground">Receive real-time alerts in the top bar.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Email Summaries</p>
              <p className="text-xs text-muted-foreground">Periodic digests of pending task reviews.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
          </div>
        </div>
      </Card>

      {/* Category Delegation Management (for Category Leads only) */}
      {leadCategory && (
        <Card className="p-5 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Category Delegates ({leadCategory.categoryName})</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Grant temporary, scoped authority to members of your category. Max 3 active delegates at once.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<UserPlus className="h-4 w-4" />}
              onClick={() => setDelegateModal(true)}
            >
              Grant Delegate Access
            </Button>
          </div>

          {delegates.length === 0 ? (
            <div className="p-6 text-center border border-dashed rounded-lg">
              <p className="text-xs text-muted-foreground">No active delegates assigned for this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {delegates.map((d) => (
                <div key={d._id} className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar user={d.delegate} size="xs" />
                      <span className="text-sm font-medium">{d.delegate.name}</span>
                      <Badge variant="warning" size="xs">
                        Delegate
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {d.permissions.map((p) => (
                        <span key={p} className="text-2xs font-mono px-1.5 py-0.5 bg-muted rounded border border-border">
                          {p}
                        </span>
                      ))}
                    </div>
                    <p className="text-2xs text-muted-foreground">
                      Valid: {formatDate(d.effectiveFrom, "MMM d")} – {formatDate(d.effectiveTo, "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-danger hover:bg-danger/10"
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    onClick={() => revokeDelegateMutation.mutate(d._id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Grant Delegate Modal */}
      <Modal
        isOpen={delegateModal}
        onClose={() => setDelegateModal(false)}
        title="Grant Scoped Delegate Access"
        description="Delegate authority is one-level only (no sub-delegation). Requires strict permission allowlisting."
      >
        <form onSubmit={handleGrantDelegate} className="space-y-4">
          <Input
            label="Delegate User ID or Name"
            placeholder="e.g. Jordan Lee"
            value={delegateUserId}
            onChange={(e) => setDelegateUserId(e.target.value)}
            required
            hint="Must be an active employee in your category"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Allowed Permissions</label>
            <div className="space-y-2">
              {[
                { perm: DelegatePermission.ManageCategoryTasks, label: "Manage Category Tasks", desc: "Allow creating and assigning tasks on behalf of lead" },
                { perm: DelegatePermission.ReviewTask, label: "Review Deliverables", desc: "Allow approving and requesting revisions" },
                { perm: DelegatePermission.ApproveRequest, label: "Approve Staffing Requests", desc: "Allow approving cross-category requests" },
                { perm: DelegatePermission.ManageDelegates, label: "Manage Delegates", desc: "Allow configuring other delegates for this category" },
              ].map(({ perm, label, desc }) => (
                <label
                  key={perm}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/30 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground">{label}</p>
                    <p className="text-2xs text-muted-foreground">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Effective From"
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              required
            />
            <Input
              label="Effective To"
              type="date"
              value={effectiveTo}
              onChange={(e) => setEffectiveTo(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setDelegateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={grantDelegateMutation.isPending}>
              Grant Access
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
