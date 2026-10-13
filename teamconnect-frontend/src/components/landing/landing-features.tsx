import * as React from "react";
import {
  Layers,
  Users2,
  CalendarClock,
  ShieldAlert,
  FileCheck2,
  History,
  Check,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
} from "lucide-react";

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            Engineered For Real Organizations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight mt-2">
            Features built directly into the codebase.
          </h2>
          <p className="text-base text-muted-foreground mt-3">
            Every feature here is backed by real MongoDB schemas, BullMQ queue workers, and role-enforced API contracts.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Bento Card 1: Dual-Scope Task Governance (Span 2 columns on desktop) */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                <Layers className="h-4 w-4" />
                <span>Core Architectural Model</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                Dual-Scope Task Management
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                Work doesn't fit in a single flat backlog. TeamConnect strictly segregates <strong>Category Tasks</strong> (ongoing departmental operations) from <strong>Project Tasks</strong> (time-bound cross-functional deliverables). Each task enforces acceptance criteria, dependency trees, and explicit reviewer sign-offs.
              </p>
            </div>

            {/* Visual mini-chip illustration */}
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-background border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Category Tasks</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-bold">
                    Ongoing
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Managed by department leads and delegates. Continuous maintenance, ops, and team goals.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Project Tasks</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent/15 text-accent font-bold">
                    Milestone-bound
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Managed by Project Managers. Tied to cross-functional timelines, target dates, and objectives.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Cross-Department Resource Borrowing (Span 1 column) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
                <Users2 className="h-4 w-4" />
                <span>Resource Allocation</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground">
                Cross-Category Borrowing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Project managers request talent from functional departments with defined date ranges, justification, and workload percentages. Category Leads retain full approval or rejection authority.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-secondary/60 border border-border text-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Workload Borrowing:</span>
                <span className="font-semibold text-foreground">40% capacity</span>
              </div>
              <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Signed off by Category Lead</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Time-Bound Memberships (Span 1 column) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-info-subtle text-info-text text-xs font-semibold">
                <CalendarClock className="h-4 w-4" />
                <span>Automated Lifecycle</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground">
                Time-Bound Memberships
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Project allocations aren't permanent. Memberships transition through explicit lifecycle states: <em>Pending Approval</em>, <em>Active</em>, <em>Expiring Soon</em>, and <em>Revoked</em>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>BullMQ workers handle auto-activation & expiry</span>
            </div>
          </div>

          {/* Bento Card 4: Delegation of Authority (Span 1 column) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-warning-subtle text-warning-text text-xs font-semibold">
                <ShieldAlert className="h-4 w-4" />
                <span>Role Governance</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground">
                Delegation of Authority
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Department leads can temporarily delegate specific review, task assignment, or borrowing approval rights to team members with granular expiration dates and instant revocation.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Time-bounded</span>
              <span className="font-semibold text-foreground">Zero privilege creep</span>
            </div>
          </div>

          {/* Bento Card 5: Versioned Submission Pipeline (Span 1 column) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-success-subtle text-success-text text-xs font-semibold">
                <FileCheck2 className="h-4 w-4" />
                <span>Deliverables & QA</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground">
                Versioned Deliverables
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Submissions feature version numbers (v1, v2), multi-file uploads (R2 object storage), reviewer feedback notes, and formal <em>Approved</em> or <em>Revision Required</em> states.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Version control</span>
              <span className="font-semibold text-foreground">Cloudflare R2 storage</span>
            </div>
          </div>

          {/* Bento Card 6: Immutable Audit Trail (Span 3 columns on desktop for strong foundation) */}
          <div className="md:col-span-3 p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-muted text-foreground text-xs font-semibold">
                <History className="h-4 w-4 text-primary" />
                <span>Security & Compliance</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                Complete Audit Trail & Real-Time Event Stream
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every task assignment, approval decision, membership status change, and role delegation creates an immutable audit entry with actor identity, timestamp, and field-level change diffs.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:items-end gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-success inline-block" />
                <span>AuditAction.Approve • Request #r-491</span>
              </div>
              <span className="text-muted-foreground text-[11px]">Recorded with IP & user agent info</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
