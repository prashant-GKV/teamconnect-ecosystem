"use client";
import * as React from "react";
import { Star } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-white relative overflow-hidden">
        {/* background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        </div>
        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Star className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">TeamConnect</span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-4">
          <blockquote className="text-2xl font-light leading-relaxed">
            "One platform for every team, every task, every collaboration."
          </blockquote>
          <p className="text-white/60 text-sm">
            Strict category isolation · Time-bound project memberships · Scope-aware reviews
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 relative z-10">
          {["Category Tasks", "Project Memberships", "Review Authority", "Cross-Category Requests"].map((f) => (
            <span key={f} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <main className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Star className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="font-heading font-bold text-lg">TeamConnect</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
