import * as React from "react";
import { UserCog, Briefcase, UserCheck, ShieldCheck, ArrowUpRight } from "lucide-react";

interface RoleCard {
  title: string;
  badge: string;
  badgeVariant: "primary" | "accent" | "info" | "warning";
  desc: string;
  capabilities: string[];
  icon: React.ElementType;
}

const ROLES: RoleCard[] = [
  {
    title: "Category Leads & Delegates",
    badge: "Department Leadership",
    badgeVariant: "primary",
    desc: "Oversee functional departments, monitor member commitments, and protect department bandwidth from uncoordinated borrowing.",
    capabilities: [
      "Review and approve or reject cross-category borrowing requests",
      "Assign and review ongoing Category Scoped tasks",
      "Delegate review and approval rights to team members with expiry dates",
      "View real-time workload percentage allocation across all category staff",
    ],
    icon: UserCog,
  },
  {
    title: "Project Managers",
    badge: "Initiative Delivery",
    badgeVariant: "accent",
    desc: "Drive time-bound initiatives, establish milestone roadmaps, and assemble cross-functional project teams with formal approval.",
    capabilities: [
      "Submit resource borrowing requests specifying dates and workload %",
      "Break down milestones into assigned Project Scoped tasks",
      "Define acceptance criteria and task dependencies",
      "Conduct deliverable reviews and request structured revisions",
    ],
    icon: Briefcase,
  },
  {
    title: "Members & Contributors",
    badge: "Focused Execution",
    badgeVariant: "info",
    desc: "Engineers, designers, and specialists who execute scoped tasks with total transparency on what is expected.",
    capabilities: [
      "Execute tasks within explicit scope boundaries (Category or Project)",
      "Upload multi-file versioned deliverables with submission notes",
      "Track active project memberships and renewal timelines",
      "Receive real-time notifications on assignments and review feedback",
    ],
    icon: UserCheck,
  },
  {
    title: "Organization Administrators",
    badge: "Platform Governance",
    badgeVariant: "warning",
    desc: "Manage organization tenants, oversee departmental categories, and conduct forensic audit reviews in the dedicated Admin Portal.",
    capabilities: [
      "Configure organizational categories and assign primary leads",
      "Manage user accounts (Employees, Interns, Contractors)",
      "Inspect immutable system-wide audit logs with change diffs",
      "Dedicated admin application running on an isolated portal",
    ],
    icon: ShieldCheck,
  },
];

export function LandingRoles() {
  return (
    <section id="roles" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            Role-Based Workspaces
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight mt-2">
            Built for everyone in your hierarchy.
          </h2>
          <p className="text-base text-muted-foreground mt-3">
            Every user sees a contextual workspace tailored to their exact role and active project allocations.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-foreground mt-2">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {role.desc}
                  </p>

                  <div className="mt-6 pt-6 border-t border-border">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                      Key Capabilities
                    </span>
                    <ul className="space-y-2.5 text-xs text-foreground">
                      {role.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          <span className="leading-normal">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Admin Portal Separation */}
        <div className="mt-8 p-4 rounded-xl border border-border/80 bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
            <span>
              <strong>Security Architecture:</strong> The Organization Admin Portal runs as a dedicated application (`teamconnect-admin`) with separated RBAC session boundaries.
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            Isolated Portal • Internal Network
          </span>
        </div>
      </div>
    </section>
  );
}
