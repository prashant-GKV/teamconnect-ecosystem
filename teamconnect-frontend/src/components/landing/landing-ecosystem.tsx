import * as React from "react";
import {
  Server,
  Database,
  Cpu,
  Layers,
  HardDrive,
  Shield,
  ArrowRight,
  GitCommit,
} from "lucide-react";

export function LandingEcosystem() {
  return (
    <section id="ecosystem" className="py-20 md:py-28 border-y border-border/60 bg-card/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight mt-2">
            The TeamConnect Ecosystem.
          </h2>
          <p className="text-base text-muted-foreground mt-3">
            Built as a robust, decoupled monorepo with typed API contracts, shared schemas, and background job queues.
          </p>
        </div>

        {/* Clean Architecture Diagram Container */}
        <div className="mt-14 p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm">
          {/* Layer 1: Client Applications */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Layer 1 • Next.js 14 Client Workspaces
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">
                      teamconnect-frontend
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      App Router • Port 3000 • TanStack Query v5 • MSW Mocks
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-success-subtle text-success-text border border-success/30">
                  User Workspace
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">
                      teamconnect-admin
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      App Router • Port 3001 • Tenant & Category Administration
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-warning-subtle text-warning-text border border-warning/30">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          {/* SVG Connection Bridge */}
          <div className="py-4 flex justify-center items-center text-muted-foreground">
            <div className="flex flex-col items-center gap-1 text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">
                REST API & Shared Contracts (`@teamconnect/api-contracts`)
              </span>
              <div className="h-6 w-0.5 bg-border" />
            </div>
          </div>

          {/* Layer 2: Express Backend Gateway */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Layer 2 • Backend Core
            </span>
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    teamconnect-backend (Port 4000)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Node.js & Express (TypeScript) • JWT & Cookie Authentication • RBAC Policy Engine • Audit Dispatcher
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-background border border-border font-mono text-[11px] text-foreground">
                  Zod Validation
                </span>
                <span className="px-2.5 py-1 rounded-md bg-background border border-border font-mono text-[11px] text-foreground">
                  Audit Middleware
                </span>
              </div>
            </div>
          </div>

          {/* SVG Connection Bridge */}
          <div className="py-4 flex justify-center items-center text-muted-foreground">
            <div className="flex flex-col items-center gap-1 text-xs">
              <div className="h-6 w-0.5 bg-border" />
            </div>
          </div>

          {/* Layer 3: Persistence, Queue Workers & Storage */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Layer 3 • Persistence, Background Queues & Storage
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* MongoDB */}
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center gap-2.5">
                  <Database className="h-5 w-5 text-success-text" />
                  <h4 className="font-heading font-bold text-sm text-foreground">MongoDB Primary</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strict Mongoose schemas for Tasks, Categories, Projects, Memberships, Submissions, and immutable AuditLogs.
                </p>
              </div>

              {/* Redis + BullMQ */}
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-5 w-5 text-danger-text" />
                  <h4 className="font-heading font-bold text-sm text-foreground">Redis + BullMQ</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Background job processing for automated membership expiry, renewal alerts, and async notification dispatch.
                </p>
              </div>

              {/* Cloudflare R2 / S3 */}
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center gap-2.5">
                  <HardDrive className="h-5 w-5 text-accent" />
                  <h4 className="font-heading font-bold text-sm text-foreground">Cloudflare R2</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  S3-compatible object storage for deliverable attachments, multi-file submissions, and avatar uploads.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monorepo Shared Packages Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border/80 bg-background text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold text-foreground">Monorepo Packages:</span>
            <span>`packages/shared-types` • `packages/api-contracts` • `packages/validation` • `packages/shared-config`</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
            Zero Drift Between Client & Server
          </span>
        </div>
      </div>
    </section>
  );
}
