import * as React from "react";
import { AlertCircle, CheckCircle, Split, ShieldCheck, Clock } from "lucide-react";

export function LandingProblem() {
  return (
    <section className="py-16 md:py-24 border-y border-border/60 bg-card/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            The Coordination Problem
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight mt-2">
            Why ordinary task boards fail modern organizations.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-4">
            Most work management tools treat every task like a standalone sticky note. But real organizations operate across departmental hierarchies and fast-moving cross-functional projects. When high-priority initiatives need talent from other teams, coordination quickly turns into chaotic Slack pings, untracked over-commitments, and lost deliverables.
          </p>
        </div>

        {/* 3 Contrasting Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Pillar 1 */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              Informal Resource Borrowing
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Without governance, project managers borrow team members without department lead visibility. Contributors burn out trying to juggle conflicting priorities.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <Split className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              Conflated Task Scopes
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Continuous department maintenance gets mixed with initiative-specific milestones. Nobody knows who holds approval authority or where deliverables should be filed.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              The TeamConnect Solution
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              TeamConnect enforces dual scopes, time-bound borrowing agreements, delegated review authority, and verifiable audit trails for complete organizational clarity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
