"use client";
import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  User, Mail, Shield, FolderKanban, Network,
  Clock, CheckCircle2, Award, Calendar, ExternalLink,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import type { UserWithRoles } from "@teamconnect/shared-types";

export function ProfileClient() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me-profile"],
    queryFn: () => apiClient.get<UserWithRoles>("/api/v1/users/me/profile"),
    select: (r) => (r.success ? r.data : null),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-48 bg-card rounded-xl border border-border" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-sm text-danger text-center py-12">User profile not found.</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="My Profile"
        description="Your organizational identity, assigned roles, and cross-category memberships."
      />

      {/* Main Identity Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar user={user} size="xl" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-heading font-bold text-foreground">{user.name}</h2>
              <Badge variant="primary" size="sm" className="capitalize">
                {user.accountType.replace("_", " ")}
              </Badge>
              {user.adminRole && (
                <Badge variant="danger" size="sm" className="uppercase font-semibold tracking-wider">
                  {user.adminRole.replace("_", " ")}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              Member since {formatDate(user.createdAt, "MMMM yyyy")}
            </p>
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </Link>
        </div>
      </Card>

      {/* Roles Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Roles */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Category Roles & Delegations</h3>
          </div>

          {user.categoryRoles?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4">No category roles assigned.</p>
          ) : (
            <div className="space-y-3">
              {user.categoryRoles?.map((cr) => (
                <div key={cr.categoryId} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{cr.categoryName}</span>
                    {cr.isPrimaryLead && (
                      <Badge variant="success" size="xs">
                        Primary Lead
                      </Badge>
                    )}
                    {cr.isDelegate && (
                      <Badge variant="warning" size="xs">
                        Active Delegate
                      </Badge>
                    )}
                  </div>

                  {cr.isDelegate && cr.delegatePermissions?.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className="text-2xs text-muted-foreground uppercase font-medium">Scoped Authority:</p>
                      <div className="flex flex-wrap gap-1">
                        {cr.delegatePermissions.map((perm) => (
                          <span
                            key={perm}
                            className="font-mono text-2xs px-2 py-0.5 rounded bg-muted text-foreground border border-border"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Project Roles & Memberships */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FolderKanban className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Cross-Category Project Staffing</h3>
          </div>

          {user.projectRoles?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4">Not currently staffed in any projects.</p>
          ) : (
            <div className="space-y-3">
              {user.projectRoles?.map((pr) => (
                <div key={pr.projectId} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{pr.projectName}</span>
                    <StatusBadge status={pr.membershipStatus} size="xs" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground capitalize">Role: {pr.role}</span>
                    <Link
                      href={`/projects/${pr.projectId}`}
                      className="text-primary hover:underline flex items-center gap-1 text-2xs"
                    >
                      Project workspace <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
