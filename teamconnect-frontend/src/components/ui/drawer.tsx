"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface DrawerProps {
  open:          boolean;
  onOpenChange:  (open: boolean) => void;
  title?:        string;
  description?:  string;
  children:      React.ReactNode;
  side?:         "right" | "left";
  width?:        "sm" | "md" | "lg";
}

const widthMap = { sm: "w-80", md: "w-96", lg: "w-[520px]" };
const sideMap  = {
  right: "right-0 top-0 bottom-0 data-[state=open]:animate-slide-in-right",
  left:  "left-0 top-0 bottom-0",
};

export function Drawer({ open, onOpenChange, title, description, children, side = "right", width = "md" }: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            "fixed z-50 bg-card shadow-xl border-l border-border",
            "flex flex-col overflow-hidden",
            widthMap[width],
            sideMap[side],
            "max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:top-auto max-sm:h-[85vh] max-sm:w-full max-sm:rounded-t-xl max-sm:border-l-0 max-sm:border-t"
          )}
        >
          {(title || description) && (
            <div className="flex-none border-b border-border px-6 py-4">
              {title && <Dialog.Title className="text-lg font-heading font-semibold">{title}</Dialog.Title>}
              {description && <Dialog.Description className="text-sm text-muted-foreground">{description}</Dialog.Description>}
              <Dialog.Close asChild>
                <button className="absolute right-4 top-4 rounded-sm text-muted-foreground hover:text-foreground" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}