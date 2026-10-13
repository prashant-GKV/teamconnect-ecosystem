"use client";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/auth-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            60_000,
      gcTime:               5 * 60_000,
      retry:                1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

function MocksInit({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <MocksInit>
            <AuthProvider>{children}</AuthProvider>
          </MocksInit>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
