import * as React from "react";
import { FolderPlus, UserCheck, CheckSquare, FileBadge2 } from "lucide-react";

interface Step {
  step: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "Structure Departments & Projects",
    desc: "Create departmental categories (e.g., Engineering, Design, Product) and spin up initiative-focused projects with target dates, milestones, and assigned project managers.",
    icon: FolderPlus,
  },
  {
    step: "02",
    title: "Request & Allocate Talent",
    desc: "Project managers submit resource borrowing requests with specific start/end dates and workload commitments. Category Leads review, adjust, or approve allocations.",
    icon: UserCheck,
  },
  {
    step: "03",
    title: "Execute Within Scoped Boundaries",
    desc: "Create and assign tasks with explicit Category or Project scopes. Assignees work with full clarity on priorities, acceptance criteria, and task dependencies.",
    icon: CheckSquare,
  },
  {
    step: "04",
    title: "Submit, Review & Audit",
    desc: "Contributors upload versioned deliverables with notes and attachments. Assigned leads or delegates review, sign off, or request revisions with a full audit log.",
    icon: FileBadge2,
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-border/60 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            Clear Operating Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight mt-2">
            How TeamConnect works in practice.
          </h2>
          <p className="text-base text-muted-foreground mt-3">
            A structured four-phase workflow designed to eliminate ambiguity between departments and cross-functional teams.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between group hover:border-primary/40 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-6">
                    <span className="font-mono text-2xl font-bold text-primary/70">
                      {item.step}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/70 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
                  <span>Phase {index + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
