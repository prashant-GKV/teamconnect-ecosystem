"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Shield, ChevronLeft, Key, CheckCircle2,
  FolderKanban, Network, Clock, AlertTriangle, Save
} from "lucide-react";
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_MEMBERSHIPS } from "@/lib/admin-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { InlineAlert } from "@/components/ui/inline-alert";
import { formatDate } from "@/lib/dates";
import { AccountType, AdminRole } from "@teamconnect/shared-types";
import type { UserWithRoles } from "@teamconnect/shared-types";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fallbackUser = INITIAL_USERS[0] as UserWithRoles;
  const [user, setUser] = React.useState<UserWithRoles>(() => {
    return INITIAL_USERS.find((u) => u._id === params.id) ?? fallbackUser;
  });
  const [name, setName] = React.useState(user.name);
  const [accountType, setAccountType] = React.useState<AccountType>(user.accountType);
  const [adminRole, setAdminRole] = React.useState<string>(user.adminRole || "none");
  const [savedMessage, setSavedMessage] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);

  const memberships = INITIAL_MEMBERSHIPS.filter((m) => m.user._id === user._id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      accountType,
      adminRole: adminRole === "none" ? undefined : (adminRole as AdminRole),
      updatedAt: new Date().toISOString(),
    }));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handlePasswordReset = () => {
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/users">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Users
          </Button>
        </Link>
      </div>

      <PageHeader
        title={user.name}
        description={`Identity management, security credentials, and organizational scope for ${user.email}.`}
        badges={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize text-xs">
              {user.accountType}
            </Badge>
            <Badge variant={user.isActive ? "success" : "danger"}>
              {user.isActive ? "Active" : "Suspended"}
            </Badge>
          </div>
        }
      />

      {savedMessage && (
        <InlineAlert
          variant="success"
          title="Changes Saved"
          description="User profile and security attributes have been updated successfully."
        />
      )}

      {resetSent && (
        <InlineAlert
          variant="info"
          title="Password Reset Initiated"
          description={`A secure password reset verification link has been dispatched to ${user.email}.`}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                    Full Name
                  </label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                    Email Address
                  </label>
                  <Input value={user.email} disabled className="bg-muted text-muted-foreground cursor-not-allowed" />
                  <p className="text-2xs text-muted-foreground mt-1">Corporate email addresses cannot be edited once provisioned.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                      Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as AccountType)}
                      className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
                    >
                      <option value={AccountType.Employee}>Employee</option>
                      <option value={AccountType.Intern}>Intern</option>
                      <option value={AccountType.Contractor}>Contractor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                      Administrative Role
                    </label>
                    <select
                      value={adminRole}
                      onChange={(e) => setAdminRole(e.target.value)}
                      className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
                    >
                      <option value="none">Standard User</option>
                      <option value={AdminRole.OrgAdmin}>Organization Admin</option>
                      <option value={AdminRole.SuperAdmin}>Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-1.5" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Memberships & Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Active Project Memberships</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {memberships.length === 0 ? (
                <p className="p-4 text-xs text-muted-foreground">No active cross-category project memberships recorded.</p>
              ) : (
                <div className="divide-y divide-border text-sm">
                  {memberships.map((m) => (
                    <div key={m._id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{m.project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Role: {m.role} · Origin: {m.sourceCategory.name}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs">
                        {m.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security & Lifecycle Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Security Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePasswordReset}
                  className="w-full justify-start text-xs"
                >
                  <Key className="h-4 w-4 mr-2 text-primary" />
                  Trigger Password Reset
                </Button>
              </div>
              <div className="pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUser((prevUser) => ({ ...prevUser, isActive: !prevUser.isActive }))}
                  className={`w-full justify-start text-xs ${user.isActive ? "text-danger hover:bg-danger/10 border-danger/30" : "text-success hover:bg-success/10 border-success/30"}`}
                >
                  {user.isActive ? "Suspend Account" : "Reactivate Account"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Audit Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-mono text-foreground">{user._id}</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="text-foreground">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-foreground">{formatDate(user.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
