"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ChevronLeft, Shield, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/inline-alert";
import { AccountType, AdminRole } from "@teamconnect/shared-types";
import { INITIAL_USERS } from "@/lib/admin-data";

export default function NewUserAdminPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("Password123!");
  const [accountType, setAccountType] = React.useState<AccountType>(AccountType.Employee);
  const [adminRole, setAdminRole] = React.useState<string>("none");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setIsSubmitting(true);
    // Simulate user creation
    setTimeout(() => {
      INITIAL_USERS.unshift({
        _id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        accountType,
        adminRole: adminRole === "none" ? undefined : (adminRole as AdminRole),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
        categoryRoles: [],
        projectRoles: [],
      });
      router.push("/users");
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/users">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Users
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Provision Directory User"
        description="Create a new internal employee, intern, or contractor account. Note: user provisioning grants no Category Lead or Project Manager rights."
      />

      {error && (
        <InlineAlert
          variant="danger"
          title="Validation Error"
          description={error}
        />
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Full Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Vance"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Corporate Email Address *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jordan.vance@acmecorp.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Initial Temporary Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-2xs text-muted-foreground mt-1">
                User will be prompted to change their password on first login.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Account Type *
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
                >
                  <option value={AccountType.Employee}>Employee (Full-time)</option>
                  <option value={AccountType.Intern}>Intern</option>
                  <option value={AccountType.Contractor}>Contractor (External)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Administrative Privilege
                </label>
                <select
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value)}
                  className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
                >
                  <option value="none">Standard User (No Admin)</option>
                  <option value={AdminRole.OrgAdmin}>Organization Admin</option>
                  <option value={AdminRole.SuperAdmin}>Super Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Link href="/users">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Provisioning..." : "Provision User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
