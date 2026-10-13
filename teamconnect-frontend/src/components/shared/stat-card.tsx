"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatCardProps {
  label:        string;
  value:        string | number;
  icon?:        LucideIcon;
  trend?:       { value: number; label: string };
  description?: string;
  loading?:     boolean;
  variant?:     "default" | "primary" | "success" | "warning" | "danger" | "info";
  className?:   string;
}

export function StatCard({ label, value, icon: Icon, trend, description, loading, variant = "default", className }: StatCardProps) {
  const variantClasses = {
    default: "border-border",
    primary: "border-primary/20 bg-primary-subtle/30",
    success: "border-success/20 bg-success-subtle/50",
    warning: "border-warning/20 bg-warning-subtle/50",
    danger:  "border-danger/20  bg-danger-subtle/50",
    info:    "border-info/20    bg-info-subtle/50",
  }[variant];

  const iconClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger:  "bg-danger/10  text-danger",
    info:    "bg-info/10    text-info",
  }[variant];

  if (loading) return (
    <Card className={cn("p-5", variantClasses, className)}>
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 mb-1" />
      <Skeleton className="h-3 w-16" />
    </Card>
  );

  const TrendIcon = !trend ? null : trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus;
  const trendColor = !trend ? "" : trend.value > 0 ? "text-success" : trend.value < 0 ? "text-danger" : "text-muted-foreground";

  return (
    <Card className={cn("p-5", variantClasses, className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", iconClasses)}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold font-heading text-foreground tabular-nums">{value}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      {trend && TrendIcon && (
        <p className={cn("mt-1 flex items-center gap-1 text-xs", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span>{Math.abs(trend.value)}% {trend.label}</span>
        </p>
      )}
    </Card>
  );
}