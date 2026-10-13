import * as React from "react";
import Link from "next/link";
import { Layers, Github, Heart } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/60 pt-16 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border">
          {/* Col 1: Wordmark & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              aria-label="TeamConnect Ecosystem Home"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                <Layers className="h-4 w-4" />
              </div>
              <span className="font-heading font-bold text-lg text-foreground tracking-tight flex items-center gap-1">
                TeamConnect
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              An enterprise operations platform unifying functional department workflows, cross-project resource governance, and auditable task delivery.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <a
                href="https://github.com/prashant-GKV/teamconnect-ecosystem"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
              >
                <Github className="h-4 w-4" />
                <span>prashant-GKV/teamconnect-ecosystem</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-foreground transition-colors">
                  Role-based Workspaces
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-foreground transition-colors">
                  System Architecture
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: App Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Workspace Access
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground transition-colors">
                  Sign up (Create account)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/prashant-GKV/teamconnect-ecosystem"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} TeamConnect Ecosystem. All rights reserved.</p>
          <p className="flex items-center gap-1 text-xs">
            <span>Built by</span>
            <strong className="font-semibold text-foreground">Prashant Saini</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
