"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export interface ModalProps {
  open?:         boolean;
  isOpen?:       boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?:      () => void;
  title?:        string;
  description?:  string;
  children:      React.ReactNode;
  size?:         "sm" | "md" | "lg" | "xl" | "2xl";
  className?:    string;
}

const sizeMap = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };

export function Modal({ open, isOpen, onOpenChange, onClose, title, description, children, size = "md", className }: ModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const handleOpenChange = (val: boolean) => {
    onOpenChange?.(val);
    if (!val) onClose?.();
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card shadow-xl border border-border",
            "p-6 focus:outline-none",
            "data-[state=open]:animate-slide-in-up",
            sizeMap[size],
            // Mobile: full-screen bottom sheet
            "max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:w-full max-sm:max-w-none",
            className
          )}
        >
          {(title || description) && (
            <div className="mb-5">
              {title && <Dialog.Title className="text-lg font-heading font-semibold">{title}</Dialog.Title>}
              {description && <Dialog.Description className="text-sm text-muted-foreground mt-1">{description}</Dialog.Description>}
            </div>
          )}
          {children}
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Dialog };