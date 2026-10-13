import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-14 text-center max-w-4xl mx-auto relative overflow-hidden shadow-xs">
          {/* Subtle decorative background gradient */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-primary">
              Ready for operational clarity?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-foreground tracking-tight leading-tight">
              Bring governance and structure to your organization.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-1">
              Start managing continuous department tasks and cross-functional projects with clear accountability today.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-sm hover:bg-primary-hover hover:shadow transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-card border border-border text-foreground font-medium text-base hover:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign in to workspace
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Full role-based workspace • Open source architecture</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
