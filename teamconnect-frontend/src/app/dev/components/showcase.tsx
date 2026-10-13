"use client";
import * as React from "react";
import { Button }            from "@/components/ui/button";
import { Badge, StatusBadge, ScopeChip } from "@/components/ui/badge";
import { Input }             from "@/components/ui/input";
import { Textarea }          from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";
import { EmptyState }        from "@/components/ui/empty-state";
import { ErrorState }        from "@/components/ui/error-state";
import { InlineAlert }       from "@/components/ui/inline-alert";
import { ProgressBar }       from "@/components/ui/progress-bar";
import { PermissionGate }    from "@/components/ui/permission-gate";
import { Modal }             from "@/components/ui/modal";
import { ConfirmDialog }     from "@/components/ui/confirm-dialog";
import { Drawer }            from "@/components/ui/drawer";
import { useToast }          from "@/components/ui/toast";
import { PageHeader }        from "@/components/shared/page-header";
import { StatCard }          from "@/components/shared/stat-card";
import { Timeline }          from "@/components/shared/timeline";
import { Stepper }           from "@/components/shared/stepper";
import { MembershipValidityBar } from "@/components/shared/membership-validity-bar";
import {
  AlertTriangle, CheckCircle2, Inbox, Users, FolderKanban,
  Send, RotateCcw, Loader, Ban, XCircle, Shield,
} from "lucide-react";
import { TaskScope, TaskStatus, RequestStatus, MembershipStatus, ProjectStatus } from "@teamconnect/shared-types";

const MOCK_USERS = [
  { name: "Alex Rivera", avatarUrl: undefined },
  { name: "Jordan Lee",  avatarUrl: undefined },
  { name: "Sam Chen",    avatarUrl: undefined },
  { name: "Taylor Kim",  avatarUrl: undefined },
  { name: "Riley Park",  avatarUrl: undefined },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-bold border-b border-border pb-2">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function DevShowcase() {
  const { toast }     = useToast();
  const [modal, setModal]     = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [drawer, setDrawer]   = React.useState(false);
  const [step, setStep]       = React.useState(1);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <PageHeader
        title="Component Showcase"
        description="Design system reference — every component in every meaningful state."
        breadcrumbs={[{ label: "Dev" }, { label: "Components" }]}
      />

      <div className="space-y-12 max-w-5xl">

        {/* ── Buttons ──────────────────────────────────────── */}
        <Section title="Buttons">
          <Row label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="danger-outline">Danger Outline</Button>
            <Button variant="success">Success</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row label="Sizes">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </Row>
          <Row label="States">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button leftIcon={<Send className="h-4 w-4" />}>With Icon</Button>
            <Button variant="danger" loading>Deleting…</Button>
          </Row>
        </Section>

        {/* ── Badges ───────────────────────────────────────── */}
        <Section title="Badges & Status">
          <Row label="Badge variants">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="muted">Muted</Badge>
            <Badge variant="outline">Outline</Badge>
          </Row>
          <Row label="Task status badges">
            {Object.values(TaskStatus).map((s) => <StatusBadge key={s} status={s} />)}
          </Row>
          <Row label="Request status badges">
            {Object.values(RequestStatus).map((s) => <StatusBadge key={s} status={s} />)}
          </Row>
          <Row label="Membership status badges">
            {Object.values(MembershipStatus).map((s) => <StatusBadge key={s} status={s} />)}
          </Row>
          <Row label="Project status badges">
            {Object.values(ProjectStatus).map((s) => <StatusBadge key={s} status={s} />)}
          </Row>
          <Row label="Scope chips">
            <ScopeChip scope={TaskScope.Category} />
            <ScopeChip scope={TaskScope.Project} />
          </Row>
        </Section>

        {/* ── Inputs ───────────────────────────────────────── */}
        <Section title="Form Inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Email address" placeholder="you@acmecorp.com" type="email" required />
            <Input label="With error" placeholder="Enter value" error="This field is required" required />
            <Input label="With hint" placeholder="Choose a strong password" hint="Min 8 chars, 1 uppercase, 1 digit" type="password" />
            <Input label="Disabled" placeholder="Cannot edit" disabled value="Locked value" readOnly />
            <Textarea label="Description" placeholder="Describe the task in detail…" hint="Be specific about acceptance criteria." required />
            <Textarea label="With error" placeholder="Enter remarks…" error="Rejection reason must be at least 10 characters." />
          </div>
        </Section>

        {/* ── Cards ────────────────────────────────────────── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic card</CardTitle>
                <CardDescription>With header, content, and footer sections.</CardDescription>
              </CardHeader>
              <CardContent><p className="text-sm">Card body content goes here.</p></CardContent>
              <CardFooter><Button size="sm">Action</Button></CardFooter>
            </Card>
            <Card hover>
              <CardHeader>
                <CardTitle>Hoverable card</CardTitle>
                <CardDescription>Shadow elevates on hover.</CardDescription>
              </CardHeader>
              <CardContent><p className="text-sm">Hover over me!</p></CardContent>
            </Card>
            <Card padding="sm">
              <p className="text-sm font-medium">Compact padding (sm)</p>
            </Card>
            <Card padding="lg">
              <p className="text-sm font-medium">Generous padding (lg)</p>
            </Card>
          </div>
        </Section>

        {/* ── KPI Stat Cards ────────────────────────────────── */}
        <Section title="KPI Stat Cards">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Active Tasks"   value={24}  icon={CheckCircle2} variant="primary"  trend={{ value: 12, label: "vs last week" }} />
            <StatCard label="Projects"       value={6}   icon={FolderKanban} variant="success"  trend={{ value: 0, label: "no change" }} />
            <StatCard label="Pending Reviews" value={4}  icon={Inbox}        variant="warning"  trend={{ value: 4, label: "new" }} />
            <StatCard label="Overdue"        value={2}   icon={AlertTriangle} variant="danger"  trend={{ value: -1, label: "improved" }} />
            <StatCard label="Loading state"  value={0}   loading />
          </div>
        </Section>

        {/* ── Avatars ───────────────────────────────────────── */}
        <Section title="Avatars">
          <Row label="Sizes">
            {(["xs","sm","md","lg","xl"] as const).map((s) => (
              <Avatar key={s} user={MOCK_USERS[0]!} size={s} />
            ))}
          </Row>
          <Row label="Avatar stack">
            <AvatarStack users={MOCK_USERS} max={4} size="sm" />
            <AvatarStack users={MOCK_USERS} max={3} size="md" />
          </Row>
        </Section>

        {/* ── Skeletons ────────────────────────────────────── */}
        <Section title="Skeleton Loading States">
          <Row label="Inline skeletons">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </Row>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonTable rows={3} cols={3} />
          </div>
        </Section>

        {/* ── Empty & Error states ──────────────────────────── */}
        <Section title="Empty & Error States">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="none">
              <EmptyState
                icon={Inbox}
                title="No requests"
                description="You don't have any pending cross-category membership requests."
                action={{ label: "Create request", onClick: () => {} }}
              />
            </Card>
            <Card padding="none">
              <ErrorState
                title="Failed to load tasks"
                message="Could not connect to the server. Please check your connection."
                code="NETWORK_ERROR"
                onRetry={() => {}}
              />
            </Card>
          </div>
        </Section>

        {/* ── Inline alerts ──────────────────────────────────── */}
        <Section title="Inline Alerts">
          <InlineAlert variant="info"    message="Your delegate access expires in 3 days. Contact your category lead to renew." />
          <InlineAlert variant="success" title="Request approved" message="Morgan Blake has been added to Apollo Platform as a Member." dismissible />
          <InlineAlert variant="warning" title="Membership expiring soon" message="Your membership in Apollo Platform expires in 7 days." />
          <InlineAlert variant="danger"  title="Self-approval blocked" message="You cannot approve tasks assigned to yourself. This is enforced by the backend." />
        </Section>

        {/* ── Progress bars ─────────────────────────────────── */}
        <Section title="Progress Bars">
          <div className="space-y-3 max-w-lg">
            <ProgressBar value={75}  showLabel label="Project progress" />
            <ProgressBar value={45}  variant="warning" showLabel />
            <ProgressBar value={20}  variant="danger"  showLabel />
            <ProgressBar value={100} variant="success" showLabel />
          </div>
        </Section>

        {/* ── Membership validity bar ───────────────────────── */}
        <Section title="Membership Validity Bar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <Card>
              <CardHeader><CardTitle className="text-sm">Active membership</CardTitle></CardHeader>
              <CardContent>
                <MembershipValidityBar startAt={new Date(Date.now() - 30*86400000).toISOString()} endAt={new Date(Date.now() + 30*86400000).toISOString()} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Expiring soon (with renewal pending)</CardTitle></CardHeader>
              <CardContent>
                <MembershipValidityBar startAt={new Date(Date.now() - 55*86400000).toISOString()} endAt={new Date(Date.now() + 5*86400000).toISOString()} renewalPending />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Expired (renewal pending)</CardTitle></CardHeader>
              <CardContent>
                <MembershipValidityBar startAt={new Date(Date.now() - 120*86400000).toISOString()} endAt={new Date(Date.now() - 10*86400000).toISOString()} renewalPending />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Expired (no renewal)</CardTitle></CardHeader>
              <CardContent>
                <MembershipValidityBar startAt={new Date(Date.now() - 90*86400000).toISOString()} endAt={new Date(Date.now() - 20*86400000).toISOString()} />
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── Timeline ──────────────────────────────────────── */}
        <Section title="Activity Timeline">
          <Card className="max-w-lg">
            <Timeline events={[
              { id: "1", title: "Task approved",            detail: "Approved as Category Lead for Engineering",        actor: "Jordan Lee",   timestamp: new Date(Date.now()-3600000).toISOString(),  variant: "success", icon: CheckCircle2 },
              { id: "2", title: "Revision requested",       detail: "Please add more detail to the acceptance criteria.", actor: "Sam Chen",   timestamp: new Date(Date.now()-86400000).toISOString(), variant: "warning", icon: RotateCcw },
              { id: "3", title: "Submission v1 uploaded",   detail: "4 files attached",                                  actor: "Alex Rivera", timestamp: new Date(Date.now()-172800000).toISOString(),variant: "info",    icon: Send },
              { id: "4", title: "Task moved to In Progress",                                                              actor: "Alex Rivera", timestamp: new Date(Date.now()-259200000).toISOString(),variant: "default", icon: Loader },
              { id: "5", title: "Task assigned to Alex Rivera",                                                           actor: "Jordan Lee",  timestamp: new Date(Date.now()-345600000).toISOString(),variant: "default" },
            ]} />
          </Card>
        </Section>

        {/* ── Stepper ───────────────────────────────────────── */}
        <Section title="Stepper">
          <div className="max-w-2xl space-y-4">
            <Stepper
              steps={[{ label: "Basics" }, { label: "Team" }, { label: "Milestones" }, { label: "Review" }]}
              current={step}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>Back</Button>
              <Button size="sm" disabled={step === 3} onClick={() => setStep(s => Math.min(3, s + 1))}>Next</Button>
            </div>
          </div>
        </Section>

        {/* ── Permission Gate ───────────────────────────────── */}
        <Section title="Permission Gate">
          <Row label="Allowed = true">
            <PermissionGate allowed={true}>
              <Button variant="danger" size="sm">Revoke Membership</Button>
            </PermissionGate>
          </Row>
          <Row label="Allowed = false (with fallback)">
            <PermissionGate allowed={false} fallback={<Badge variant="muted">No permission</Badge>}>
              <Button variant="danger" size="sm">Revoke Membership</Button>
            </PermissionGate>
          </Row>
        </Section>

        {/* ── Overlays ──────────────────────────────────────── */}
        <Section title="Modal / Drawer / Confirm Dialog">
          <Row label="Trigger">
            <Button variant="outline" onClick={() => setModal(true)}>Open Modal</Button>
            <Button variant="outline" onClick={() => setDrawer(true)}>Open Drawer</Button>
            <Button variant="danger-outline" onClick={() => setConfirm(true)}>Open Confirm</Button>
          </Row>
          <Modal
            open={modal}
            onOpenChange={setModal}
            title="Cross-Category Request"
            description="Review the request details before taking action."
          >
            <div className="space-y-4">
              <InlineAlert variant="info" message="This request is from Taylor Kim for Riley Park to join Apollo Platform." />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setModal(false)}>Cancel</Button>
                <Button variant="danger-outline" onClick={() => setModal(false)}>Reject</Button>
                <Button onClick={() => setModal(false)}>Approve</Button>
              </div>
            </div>
          </Modal>
          <Drawer open={drawer} onOpenChange={setDrawer} title="Task Details" description="Apollo Platform — Engineering">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Full task detail will appear here in Phase 4.</p>
              <ScopeChip scope={TaskScope.Project} />
              <StatusBadge status="in_progress" />
            </div>
          </Drawer>
          <ConfirmDialog
            open={confirm}
            onOpenChange={setConfirm}
            title="Revoke Membership"
            description="Are you sure you want to revoke Morgan Blake's membership in Apollo Platform? This action cannot be undone and will remove their access immediately."
            confirmLabel="Revoke"
            onConfirm={async () => { await new Promise(r => setTimeout(r, 1000)); setConfirm(false); }}
          />
        </Section>

        {/* ── Toasts ────────────────────────────────────────── */}
        <Section title="Toast Notifications">
          <Row label="Trigger toasts">
            <Button variant="success" size="sm" onClick={() => toast({ title: "Request approved", message: "Riley Park has been added to Apollo Platform.", variant: "success" })}>
              Success toast
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Processing", message: "Your request is being reviewed.", variant: "info" })}>
              Info toast
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Expiry warning", message: "Your membership in Apollo Platform expires in 5 days.", variant: "warning" })}>
              Warning toast
            </Button>
            <Button variant="danger-outline" size="sm" onClick={() => toast({ title: "Action failed", message: "Self-approval is not permitted.", variant: "error" })}>
              Error toast
            </Button>
          </Row>
        </Section>

      </div>
    </div>
  );
}