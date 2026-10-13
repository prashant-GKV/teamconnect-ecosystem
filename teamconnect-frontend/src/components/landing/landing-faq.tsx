import * as React from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What makes TeamConnect different from standard tools like Trello or Jira?",
    answer:
      "Most tools treat tasks as flat items in a backlog. TeamConnect introduces organizational governance: work is strictly partitioned into continuous departmental maintenance (Category Scope) and time-bound initiatives (Project Scope). It also provides formal resource borrowing pipelines so project managers can request talent from department pools with explicit workload percentages and lead approvals.",
  },
  {
    question: "How does cross-category resource borrowing work in practice?",
    answer:
      "When a project requires specialized talent (for example, a Senior Engineer or UX Designer), the Project Manager submits an allocation request specifying target dates, justification, and workload percent. The department Category Lead reviews the request and either approves or rejects it. Upon approval, the contributor receives a time-bound project membership.",
  },
  {
    question: "What happens when a team member's project membership expires?",
    answer:
      "TeamConnect memberships follow an automated lifecycle managed by background BullMQ workers. As the end date approaches, the status transitions to 'Expiring Soon' and triggers notifications. If no renewal request is approved by the lead, the membership transitions to 'Expired', automatically revoking the contributor's project task creation and submission privileges.",
  },
  {
    question: "Can a Category Lead delegate their review authority?",
    answer:
      "Yes. Category Leads can create formal Delegations of Authority to grant designated team members specific capabilities (such as reviewing tasks, managing category tasks, or approving borrowing requests) with mandatory start and expiration dates. Delegations can be revoked at any time.",
  },
  {
    question: "Why is the Admin Portal a separate application?",
    answer:
      "For security and governance. The admin application (`teamconnect-admin`) runs as an isolated Next.js portal on a separate port or internal domain. It handles tenant administration, user account management, and immutable audit log reviews without mixing privileges with the member-facing workspace (`teamconnect-frontend`).",
  },
  {
    question: "Can TeamConnect be developed or tested completely offline?",
    answer:
      "Yes. The frontend includes a comprehensive Mock Service Worker (MSW) client implementation configured via NEXT_PUBLIC_USE_MOCKS=true. Developers and demo viewers can test every feature, role switch, and task workflow without needing a running database or backend server.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight mt-2">
            Everything you need to know.
          </h2>
          <p className="text-base text-muted-foreground mt-3">
            Honest answers grounded in TeamConnect's actual architecture and codebase.
          </p>
        </div>

        {/* Semantic Accessible Accordion using <details> and <summary> */}
        <div className="mt-12 space-y-4">
          {FAQS.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-border bg-card p-5 transition-all [&_summary::-webkit-details-marker]:hidden open:border-primary/40 open:shadow-xs"
            >
              <summary className="flex cursor-pointer items-center justify-between text-left font-heading font-semibold text-base sm:text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md py-1">
                <span>{faq.question}</span>
                <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-muted-foreground group-open:text-primary">
                  <ChevronDown className="h-5 w-5" />
                </span>
              </summary>
              <div className="pt-3 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/60 mt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
