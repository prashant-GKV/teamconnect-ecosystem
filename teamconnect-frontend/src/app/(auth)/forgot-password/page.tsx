"use client";
import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/inline-alert";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordForm) {
    setError(null);
    try {
      // Mock reset email dispatch
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
    } catch {
      setError("Unable to process request right now. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your account email to receive a recovery link
        </p>
      </div>

      {submitted ? (
        <div className="space-y-4 rounded-xl border border-success/30 bg-success/10 p-5 text-success">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <h2 className="text-base font-semibold">Check your inbox</h2>
          </div>
          <p className="text-xs leading-relaxed text-success-text">
            If an account exists with that email address, we’ve sent instructions to reset your password. Please check your spam folder if it doesn’t arrive within a few minutes.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && (
            <InlineAlert variant="danger" message={error} dismissible onDismiss={() => setError(null)} />
          )}

          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="you@acmecorp.com"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
            leftIcon={<Mail className="h-4 w-4" />}
          >
            Send recovery link
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
