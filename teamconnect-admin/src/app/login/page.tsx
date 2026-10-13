"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Star, ArrowRight, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/inline-alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("avery.singh@acmecorp.com");
  const [password, setPassword] = React.useState("Password123!");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            TeamConnect Administration
          </h1>
          <p className="text-xs text-slate-400">
            Restricted authentication portal for Organization & Super Administrators.
          </p>
        </div>

        {error && (
          <InlineAlert
            variant="danger"
            title="Authentication Error"
            description={error}
          />
        )}

        <Card className="border-slate-800 bg-slate-800/80 backdrop-blur-sm text-slate-100 shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                  Administrator Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/60 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/60 border-slate-700 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isSubmitting ? "Authenticating..." : "Sign in to Admin Panel"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700/60 space-y-2">
              <p className="text-2xs font-semibold uppercase text-slate-400 text-center">
                Demo Quick-Switch Admin Credentials
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("avery.singh@acmecorp.com")}
                  className="p-2 rounded border border-slate-700 text-left hover:bg-slate-700/50 transition-colors"
                >
                  <p className="text-xs font-semibold text-white">Avery Singh</p>
                  <p className="text-2xs text-slate-400">Super Admin</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("drew.patel@acmecorp.com")}
                  className="p-2 rounded border border-slate-700 text-left hover:bg-slate-700/50 transition-colors"
                >
                  <p className="text-xs font-semibold text-white">Drew Patel</p>
                  <p className="text-2xs text-slate-400">Org Admin</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
