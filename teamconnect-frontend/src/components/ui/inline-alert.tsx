"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useState } from "react";

type AlertVariant = "info" | "success" | "warning" | "danger";

const config: Record<AlertVariant, { icon: React.ElementType; classes: string }> = {
  info:    { icon: Info,           classes: "bg-info-subtle text-info border-info/20" },
  success: { icon: CheckCircle2,   classes: "bg-success-subtle text-success border-success/20" },
  warning: { icon: AlertTriangle,  classes: "bg-warning-subtle text-warning border-warning/20" },
  danger:  { icon: XCircle,        classes: "bg-danger-subtle text-danger border-danger/20" },
};

export interface InlineAlertProps {
  variant?:     AlertVariant;
  title?:       string;
  message?:     string;
  description?: string;
  dismissible?: boolean;
  onDismiss?:   () => void;
  action?:      React.ReactNode;
  className?:   string;
}

export function InlineAlert({ variant = "info", title, message, description, action, dismissible, onDismiss, className }: InlineAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const { icon: Icon, classes } = config[variant];
  const alertText = message || description || "";

  return (
    <div role="alert" className={cn("flex gap-3 rounded-lg border p-3.5", classes, className)}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-sm">{title}</p>}
        {alertText && <p className="text-sm opacity-90">{alertText}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {dismissible && (
        <button onClick={() => { setDismissed(true); onDismiss?.(); }} className="shrink-0" aria-label="Dismiss">
          <X className="h-4 w-4 opacity-60 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}