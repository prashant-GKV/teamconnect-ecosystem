// PermissionGate — renders children only when the user passes the check.
// UI convenience only — backend enforces real authorization.
import type { ReactNode } from "react";

interface PermissionGateProps {
  allowed: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({ allowed, fallback = null, children }: PermissionGateProps) {
  return allowed ? <>{children}</> : <>{fallback}</>;
}