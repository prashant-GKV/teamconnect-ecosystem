"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, UserPlus, CheckCircle2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@teamconnect/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/inline-alert";
import { useAuth } from "@/contexts/auth-context";

// ── Quick-login personas (dev & testing) ──────────────────────────────────────
const DEV_PERSONAS = [
  { label: "Employee",       email: "alex.rivera@acmecorp.com", username: "alex.rivera", role: "employee" },
  { label: "Category Lead",  email: "jordan.lee@acmecorp.com",   username: "jordan.lee",   role: "lead" },
  { label: "Project Manager",email: "taylor.kim@acmecorp.com",   username: "taylor.kim",   role: "manager" },
  { label: "Super Admin",    email: "avery.singh@acmecorp.com",  username: "avery.singh",  role: "admin" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPw, setShowPw]   = React.useState(false);
  const [error, setError]     = React.useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = React.useState<string | null>(null);

  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const wasRegistered = searchParams.get("registered") === "1";

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    setError(null);
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setError(res.error || "Invalid username/email or password.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(msg);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your TeamConnect account
        </p>
      </div>

      {/* Success banner if redirected from signup */}
      {wasRegistered && (
        <div className="flex items-center gap-2.5 rounded-lg border border-success/30 bg-success/10 p-3 text-xs text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Account created successfully! Please sign in with your credentials.</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <InlineAlert variant="danger" message={error} dismissible onDismiss={() => setError(null)} />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="email"
          label="Email address or Username"
          type="text"
          placeholder="you@acmecorp.com or username"
          autoComplete="username"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-0 top-[22px] flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span />
          <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full min-h-[44px]"
          size="lg"
          loading={isSubmitting}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Sign in
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="rounded-xl border border-border bg-card p-4 text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account yet?
        </p>
        <Link href="/signup">
          <Button variant="outline" size="sm" className="w-full min-h-[44px]" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
            Create an account
          </Button>
        </Link>
      </div>

      {/* Dev quick-login */}
      {process.env.NEXT_PUBLIC_USE_MOCKS !== "false" && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              🧪 Quick Role Switcher
            </p>
            {selectedPersona && (
              <span className="text-[11px] text-primary font-medium">Selected: {selectedPersona}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEV_PERSONAS.map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => {
                  setValue("email", p.email);
                  setValue("password", "Password1!");
                  setSelectedPersona(p.label);
                  setError(null);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-all min-h-[44px] ${
                  selectedPersona === p.label
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span className="font-semibold block">{p.label}</span>
                <span className="text-muted-foreground truncate block text-[11px]">{p.username}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Password: <code className="font-mono bg-muted px-1 py-0.5 rounded">Password1!</code> (Or sign up with any custom credentials)
          </p>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-card/60" />}>
      <LoginForm />
    </React.Suspense>
  );
}
