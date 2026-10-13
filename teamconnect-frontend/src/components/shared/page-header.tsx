"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface Breadcrumb { label: string; href?: string; }

export interface PageHeaderProps {
  title:        string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?:     React.ReactNode;
  action?:      React.ReactNode;
  badges?:      React.ReactNode;
  className?:   string;
}

export function PageHeader({ title, description, breadcrumbs, actions, action, badges, className }: PageHeaderProps) {
  const headerActions = actions ?? action;
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <li aria-hidden className="text-muted-foreground/50">/</li>}
                <li>
                  {b.href ? (
                    <a href={b.href} className="hover:text-foreground transition-colors">{b.label}</a>
                  ) : (
                    <span className="text-foreground font-medium">{b.label}</span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          {badges && <div className="mt-2 flex flex-wrap items-center gap-2">{badges}</div>}
        </div>
        {headerActions && <div className="flex items-center gap-2 shrink-0">{headerActions}</div>}
      </div>
    </div>
  );
}