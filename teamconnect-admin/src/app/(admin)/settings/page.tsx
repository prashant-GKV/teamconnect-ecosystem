"use client";
import * as React from "react";
import {
  Settings, Save, Globe, Bell, Database,
  Shield, CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/inline-alert";
import { INITIAL_SETTINGS } from "@/lib/admin-data";
import type { AdminSettings } from "@/lib/admin-data";

export default function SettingsAdminPage() {
  const [settings, setSettings] = React.useState<AdminSettings>(INITIAL_SETTINGS);
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Organization Settings & Governance Policy"
        description="Global parameters for cross-category expiration schedules, system timezones, and audit retention."
      />

      {saved && (
        <InlineAlert
          variant="success"
          title="Configuration Updated"
          description="Global organizational settings have been saved and applied across all worker schedules."
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Org Config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Organizational Profile & Regional Alignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Organization Display Name
              </label>
              <Input
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                System Standard Timezone
              </label>
              <select
                value={settings.organizationTimezone}
                onChange={(e) => setSettings({ ...settings, organizationTimezone: e.target.value })}
                className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              </select>
              <p className="text-2xs text-muted-foreground mt-1">
                All daily and hourly background worker cron jobs align against this canonical timezone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Worker & Expiration Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Membership Reminders & Lifecycle Workers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Expiring Soon Notification Window (Days)
              </label>
              <Input
                type="number"
                min={1}
                max={30}
                value={settings.reminderNoticeDays}
                onChange={(e) => setSettings({ ...settings, reminderNoticeDays: Number(e.target.value) })}
                required
              />
              <p className="text-2xs text-muted-foreground mt-1">
                When a cross-category membership reaches this threshold before end date, daily notifications are dispatched and the status transitions to &quot;Expiring Soon&quot;.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Maximum Active Delegates per Category
              </label>
              <Input
                type="number"
                min={1}
                max={10}
                value={settings.maxActiveDelegatesPerCategory}
                onChange={(e) => setSettings({ ...settings, maxActiveDelegatesPerCategory: Number(e.target.value) })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Audit Retention & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Data Retention & Governance Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Audit Trail Retention Horizon (Days)
              </label>
              <Input
                type="number"
                min={90}
                max={3650}
                value={settings.dataRetentionDays}
                onChange={(e) => setSettings({ ...settings, dataRetentionDays: Number(e.target.value) })}
                required
              />
              <p className="text-2xs text-muted-foreground mt-1">
                Immutable audit records are preserved for this minimum duration before cold archival.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-1.5" /> Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
