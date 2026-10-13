"use client";
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error:   XCircle,
  info:    Info,
};

export type ToastVariant = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id:       string;
  title:    string;
  message?: string;
  variant:  ToastVariant;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...item, id }]);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => {
          const Icon = icons[t.variant];
          const variantClass = {
            success: "border-success/30 bg-success-subtle text-success",
            warning: "border-warning/30 bg-warning-subtle text-warning",
            error:   "border-danger/30 bg-danger-subtle text-danger",
            info:    "border-info/30 bg-info-subtle text-info",
          }[t.variant];
          return (
            <ToastPrimitive.Root
              key={t.id}
              className={cn(
                "pointer-events-auto relative flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-medium",
                "data-[state=open]:animate-slide-in-right data-[state=closed]:opacity-0",
                "transition-all duration-200",
                variantClass
              )}
              onOpenChange={(open) => { if (!open) remove(t.id); }}
              duration={4000}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <ToastPrimitive.Title className="text-sm font-semibold">{t.title}</ToastPrimitive.Title>
                {t.message && <ToastPrimitive.Description className="text-sm opacity-80 mt-0.5">{t.message}</ToastPrimitive.Description>}
              </div>
              <ToastPrimitive.Close className="shrink-0 opacity-60 hover:opacity-100" aria-label="Close">
                <X className="h-4 w-4" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport
          aria-live="polite"
          className="fixed bottom-0 right-0 z-[100] flex max-h-screen flex-col-reverse gap-2 p-4 sm:right-4 sm:bottom-4 sm:max-w-sm"
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);
