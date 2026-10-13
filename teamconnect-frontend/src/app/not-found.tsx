"use client";
import * as React from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <EmptyState
        icon={FileQuestion}
        title="Page not found"
        description="The page you are looking for does not exist or you do not have access to it."
        action={
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        }
      />
    </div>
  );
}