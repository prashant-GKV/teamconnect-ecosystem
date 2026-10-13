"use client";
import * as React from "react";
import { Star } from "lucide-react";

export function AppLoadingScreen({ message = "Loading TeamConnect…" }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-opacity"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 max-w-sm px-6 text-center">
        {/* Animated Brand Icon */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-sm animate-pulse">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md">
            <Star className="h-5 w-5 fill-white text-white" />
          </div>
        </div>

        {/* Brand Name & Status — proper h1 */}
        <div className="space-y-1">
          <h1 className="font-heading font-bold text-lg tracking-tight">TeamConnect</h1>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>

        {/* Indeterminate bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/5 rounded-full bg-primary animate-[indeterminate_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
