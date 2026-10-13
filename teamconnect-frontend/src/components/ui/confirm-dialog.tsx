"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export interface ConfirmDialogProps {
  open:          boolean;
  onOpenChange:  (open: boolean) => void;
  title:         string;
  description:   string;
  confirmLabel?: string;
  cancelLabel?:  string;
  variant?:      "danger" | "warning";
  onConfirm:     () => void | Promise<void>;
  loading?:      boolean;
  children?:     React.ReactNode;
}

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  variant = "danger", onConfirm, loading, children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <AlertDialog.Content className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%]",
          "rounded-xl bg-card p-6 shadow-xl border border-border",
          "data-[state=open]:animate-slide-in-up",
          "max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:w-full max-sm:max-w-none"
        )}>
          <AlertDialog.Title className="text-lg font-heading font-semibold">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">{description}</AlertDialog.Description>
          {children && <div className="mt-4">{children}</div>}
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">{cancelLabel}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant={variant} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}