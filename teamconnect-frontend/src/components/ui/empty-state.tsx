"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";
import { Button } from "./button";
import type { ButtonProps } from "./button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; variant?: ButtonProps["variant"] } | React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center gap-4", className)}>
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        React.isValidElement(action) ? (
          action
        ) : typeof action === "object" && "label" in action ? (
          <Button variant={action.variant ?? "outline"} size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        ) : null
      )}
    </div>
  );
}