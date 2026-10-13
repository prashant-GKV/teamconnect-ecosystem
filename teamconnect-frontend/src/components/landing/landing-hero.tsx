import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Bell,
  Sparkles,
  GitBranch,
  FileCheck,
  Users2,
  Shield,
} from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle handcrafted background accent pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Subtle top glow highlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-64 bg-primary/5 blur-3xl pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Text Content */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Structured Team & Project Operations</span>
          </div>

          {/* Headline (under 10 words) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.12]">
            Operational governance for cross-functional teams and projects.
          </h1>

          {/* Supporting sentence (under 25 words) */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            Coordinate department operations, borrow talent across teams, and deliver auditable outcomes with structured review workflows.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-sm hover:bg-primary-hover hover:shadow transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card border border-border text-foreground font-medium text-base hover:bg-muted hover:border-primary/30 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See how it works
            </a>
          </div>

          {/* Honest Tech & Project Trust Line */}
          <div className="pt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span>Built with Next.js 14, Express, MongoDB & BullMQ • 100% Open Source</span>
          </div>
        </div>

        {/* Hand-Crafted CSS/HTML Mockup of the Real Dashboard */}
        <div className="mt-14 lg:mt-16 relative">
          {/* Outer frame */}
          <div className="relative mx-auto rounded-2xl border border-border bg-card shadow-lg overflow-hidden max-w-5xl transition-all">
            {/* Mockup Window Chrome Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-danger/70 inline-block" />
                <span className="h-3 w-3 rounded-full bg-warning/70 inline-block" />
                <span className="h-3 w-3 rounded-full bg-success/70 inline-block" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  teamconnect.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border text-[11px]">
                  <Search className="h-3 w-3 text-muted-foreground" />
                  <span>Search tasks, projects, categories...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative p-1 text-muted-foreground">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    JL
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup Dashboard Content Grid */}
            <div className="p-4 sm:p-6 bg-background space-y-5 select-none">
              {/* Header inside Dashboard */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
                      Engineering Operations Hub
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      Category: Engineering
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Lead: Jordan Lee • 14 Active Members • 3 Active Project Borrowings
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 text-accent font-medium border border-accent/20">
                    <Shield className="h-3.5 w-3.5" />
                    Review Delegation: Active
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Scoped Tasks</span>
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-heading text-foreground">14</span>
                    <span className="text-xs text-accent font-medium">+2 this week</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">8 Category • 6 Project</p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Borrowing Requests</span>
                    <Users2 className="h-4 w-4 text-accent" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-heading text-foreground">3</span>
                    <span className="text-xs text-warning-text font-medium">1 needs approval</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">From Apollo & Phoenix</p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Pending Reviews</span>
                    <FileCheck className="h-4 w-4 text-warning-text" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-heading text-foreground">2</span>
                    <span className="text-xs text-muted-foreground">v2 deliverable</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting lead sign-off</p>
                </div>
              </div>

              {/* Real Task List Replica */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/30 border-b border-border flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Priority Scoped Tasks</span>
                  <span className="text-[11px] font-normal text-muted-foreground">Sorted by urgency</span>
                </div>
                <div className="divide-y divide-border text-xs">
                  {/* Task 1 */}
                  <div className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-danger mt-1 sm:mt-0 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                          <span>Setup BullMQ Redis Job Queues</span>
                          <span className="inline-flex items-center px-1.5 py-0.25 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            Category Scope
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Assignee: Maya Lin • Acceptance criteria validated
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-warning-subtle text-warning-text border border-warning/30">
                        <Clock className="h-3 w-3" />
                        In Review
                      </span>
                      <span className="text-[11px] text-muted-foreground hidden md:inline">Due Today</span>
                    </div>
                  </div>

                  {/* Task 2 */}
                  <div className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-warning mt-1 sm:mt-0 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                          <span>Apollo Platform: Cloudflare R2 Upload Adapter</span>
                          <span className="inline-flex items-center px-1.5 py-0.25 rounded text-[10px] font-semibold bg-accent/15 text-accent border border-accent/25">
                            Project: Apollo Platform
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Assignee: David Zhao (Borrowed 40% workload)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-info-subtle text-info-text border border-info/30">
                        <GitBranch className="h-3 w-3" />
                        In Progress
                      </span>
                      <span className="text-[11px] text-muted-foreground hidden md:inline">Due Oct 18</span>
                    </div>
                  </div>

                  {/* Task 3 */}
                  <div className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-success mt-1 sm:mt-0 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                          <span>Role-Based Audit Logging Endpoint</span>
                          <span className="inline-flex items-center px-1.5 py-0.25 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            Category Scope
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Reviewed by: Jordan Lee • Version 2 Deliverable Signed Off
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-success-subtle text-success-text border border-success/30">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                      <span className="text-[11px] text-muted-foreground hidden md:inline">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom active borrowing note */}
              <div className="p-3 rounded-lg bg-secondary/80 border border-border flex items-center justify-between text-xs text-secondary-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    <strong>Membership Alert:</strong> David Zhao’s borrowing for <em>Apollo Platform</em> expires in 5 days.
                  </span>
                </div>
                <span className="text-primary font-semibold hover:underline cursor-pointer hidden sm:inline">
                  Review Renewal Request →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
