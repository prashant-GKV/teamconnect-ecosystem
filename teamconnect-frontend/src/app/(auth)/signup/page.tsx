"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, Check, X, Shield, ArrowRight } from "lucide-react";
import { signupSchema, type SignupInput } from "@teamconnect/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/inline-alert";
import { useAuth } from "@/contexts/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPw, setShowPw] = React.useState(false);
  const [showConfirmPw, setShowConfirmPw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "employee",
      password: "",
      confirm: "",
    },
  });

  const pwValue = watch("password") || "";

  const passwordRules = [
    { label: "At least 8 characters", met: pwValue.length >= 8 },
    { label: "At least one uppercase letter (A-Z)", met: /[A-Z]/.test(pwValue) },
    { label: "At least one number (0-9)", met: /[0-9]/.test(pwValue) },
    { label: "At least one special character (!@#$...)", met: /[^A-Za-z0-9]/.test(pwValue) },
  ];

  async function onSubmit(data: SignupInput) {
    setError(null);
    try {
      const res = await signup({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || "Registration failed. Please check your details.");
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
        <h1 className="font-heading text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join your organization on TeamConnect
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <InlineAlert
          variant="danger"
          message={error}
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          id="name"
          label="Full Name"
          type="text"
          placeholder="e.g. Morgan Reed"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Username / User ID */}
        <Input
          id="username"
          label="Username / ID"
          type="text"
          placeholder="e.g. morgan.reed"
          autoComplete="username"
          required
          error={errors.username?.message}
          {...register("username")}
        />

        {/* Email Address */}
        <Input
          id="email"
          label="Work Email"
          type="email"
          placeholder="morgan.reed@acmecorp.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "employee", label: "Employee", desc: "Category & project tasks" },
              { id: "lead", label: "Category Lead", desc: "Manage team & reviews" },
              { id: "manager", label: "Project Manager", desc: "Cross-category projects" },
              { id: "admin", label: "Administrator", desc: "Full system management" },
            ].map((r) => (
              <label
                key={r.id}
                className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  value={r.id}
                  className="mt-0.5 text-primary focus:ring-primary"
                  {...register("role")}
                />
                <div className="text-left">
                  <p className="text-xs font-medium leading-none text-foreground">{r.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{r.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.role?.message && (
            <p className="text-xs text-danger">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-0 top-[22px] flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password Rules Checklist */}
        <div className="rounded-lg border border-border bg-muted/20 p-2.5 space-y-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">Password requirements:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
            {passwordRules.map((rule, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 ${
                  rule.met ? "text-success font-medium" : "text-muted-foreground"
                }`}
              >
                {rule.met ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[3]" />
                ) : (
                  <X className="h-3 w-3 shrink-0 opacity-40" />
                )}
                <span>{rule.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            id="confirm"
            label="Confirm Password"
            type={showConfirmPw ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            error={errors.confirm?.message}
            {...register("confirm")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPw((v) => !v)}
            className="absolute right-0 top-[22px] flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirmPw ? "Hide password" : "Show password"}
          >
            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Create account
        </Button>
      </form>

      {/* Switch to login */}
      <div className="text-center pt-2 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
