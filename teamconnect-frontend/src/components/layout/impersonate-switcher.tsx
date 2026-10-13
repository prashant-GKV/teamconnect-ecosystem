"use client";
import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, FlaskConical } from "lucide-react";
import { cn } from "@/lib/cn";
import { SEED_USERS } from "@/lib/mocks/seed-data";

interface ImpersonateSwitcherProps {
  activeId:  string;
  onSelect:  (id: string) => void;
}

const ROLE_LABELS: Record<string, string> = {
  "u-employee-1":   "Employee",
  "u-lead-1":       "Category Lead (Engineering)",
  "u-delegate-1":   "Category Delegate",
  "u-pm-1":         "Project Manager",
  "u-intern-1":     "Intern",
  "u-contractor-1": "Contractor",
  "u-lead-2":       "Category Lead (Design)",
  "u-org-admin-1":  "Org Admin",
  "u-super-admin-1":"Super Admin",
};

export function ImpersonateSwitcher({ activeId, onSelect }: ImpersonateSwitcherProps) {
  if (process.env["NEXT_PUBLIC_USE_MOCKS"] === "false") return null;
  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm px-3 py-2 shadow-medium">
      <FlaskConical className="h-4 w-4 text-primary shrink-0" />
      <Select.Root value={activeId} onValueChange={onSelect}>
        <Select.Trigger className="flex items-center gap-1 text-xs font-medium text-primary focus:outline-none">
          <Select.Value />
          <ChevronDown className="h-3 w-3" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={cn("z-[200] min-w-[220px] rounded-xl border border-border bg-card p-1 shadow-medium")} position="popper" sideOffset={4}>
            <Select.Viewport>
              {SEED_USERS.map((u) => (
                <Select.Item
                  key={u._id}
                  value={u._id}
                  className="flex cursor-pointer flex-col rounded-lg px-3 py-2 text-sm outline-none hover:bg-muted data-[highlighted]:bg-muted"
                >
                  <Select.ItemText>
                    <span className="font-medium">{u.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">· {ROLE_LABELS[u._id] ?? u.accountType}</span>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}