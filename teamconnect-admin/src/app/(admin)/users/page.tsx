"use client";
import * as React from "react";
import Link from "next/link";
import {
  Users, UserPlus, Search, Filter, CheckCircle2,
  Ban, Shield, ArrowRight, MoreHorizontal
} from "lucide-react";
import { INITIAL_USERS } from "@/lib/admin-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/dates";

export default function UsersAdminPage() {
  const [users, setUsers] = React.useState(INITIAL_USERS);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || u.accountType === typeFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);
      return matchSearch && matchType && matchStatus;
    });
  }, [users, search, typeFilter, statusFilter]);

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="User & Identity Governance"
        description="Provision, configure roles, and manage directory lifecycle for employees, interns, and contractors."
        actions={
          <Link href="/users/new">
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-1.5" /> Provision New User
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
            >
              <option value="all">All Account Types</option>
              <option value="employee">Employee</option>
              <option value="intern">Intern</option>
              <option value="contractor">Contractor</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Account Type</th>
                  <th className="p-4">Admin Authority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <Link href={`/users/${u._id}`} className="font-semibold text-foreground hover:text-primary">
                            {u.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize text-2xs">
                        {u.accountType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {u.adminRole ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          <Shield className="h-3 w-3" />
                          {u.adminRole === "super_admin" ? "Super Admin" : "Org Admin"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Standard User</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant={u.isActive ? "success" : "danger"}>
                        {u.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatus(u._id)}
                          className={`h-7 px-2 text-xs ${u.isActive ? "text-danger hover:text-danger/80" : "text-success hover:text-success/80"}`}
                        >
                          {u.isActive ? "Suspend" : "Activate"}
                        </Button>
                        <Link href={`/users/${u._id}`}>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            Manage
                          </Button>
                        </Link>
                      </div>
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
