"use client";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <ErrorState
        title="Application Error"
        message={error.message ?? "An unexpected error occurred."}
        onRetry={reset}
      />
    </div>
  );
}