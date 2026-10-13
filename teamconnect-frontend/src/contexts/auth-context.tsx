"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { UserWithRoles } from "@teamconnect/shared-types";
import { AdminRole, DelegatePermission, AccountType, MembershipStatus } from "@teamconnect/shared-types";
import { AppLoadingScreen } from "@/components/shared/app-loading-screen";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

const DEFAULT_MOCK_USER: UserWithRoles = {
  _id: "u-lead-1",
  name: "Jordan Lee",
  email: "jordan.lee@acmecorp.com",
  accountType: AccountType.Employee,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  preferences: { theme: "light", notificationsEmail: true, notificationsInApp: true },
  categoryRoles: [{
    categoryId: "cat-1",
    categoryName: "Engineering",
    isPrimaryLead: true,
    isDelegate: false,
    delegatePermissions: [],
  }],
  projectRoles: [{
    projectId: "proj-1",
    projectName: "Apollo Platform",
    role: "manager",
    membershipStatus: MembershipStatus.Active,
  }],
};

// Read token synchronously so we can make an optimistic auth decision without waiting for a network round-trip.
function readTokenSync(): string | null {
  if (typeof window === "undefined") {
    if (process.env.NEXT_PUBLIC_USE_MOCKS !== "false") {
      return "mock-access-token";
    }
    return null;
  }
  return sessionStorage.getItem("tc_access_token") || localStorage.getItem("tc_access_token");
}

export type PrimaryRole = "admin" | "lead" | "manager" | "delegate" | "employee";

interface AuthContextValue {
  user: UserWithRoles | null;
  role: PrimaryRole;
  roleLabel: string;
  categoryName?: string;
  projectName?: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: "employee" | "lead" | "manager" | "admin";
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  canAccessRoute: (pathname: string) => boolean;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function getPrimaryRole(user: UserWithRoles | null | undefined): PrimaryRole {
  if (!user) return "employee";
  if (user.adminRole === AdminRole.SuperAdmin || user.adminRole === AdminRole.OrgAdmin) {
    return "admin";
  }
  if (user.categoryRoles.some((r) => r.isPrimaryLead)) {
    return "lead";
  }
  if (user.projectRoles.some((r) => r.role === "manager")) {
    return "manager";
  }
  if (user.categoryRoles.some((r) => r.isDelegate)) {
    return "delegate";
  }
  return "employee";
}

export function getRoleLabel(user: UserWithRoles | null | undefined): string {
  if (!user) return "Guest";
  if (user.adminRole === AdminRole.SuperAdmin) return "Super Admin";
  if (user.adminRole === AdminRole.OrgAdmin) return "Org Admin";
  const leadCat = user.categoryRoles.find((r) => r.isPrimaryLead);
  if (leadCat) return `Category Lead (${leadCat.categoryName})`;
  const pmProj = user.projectRoles.find((r) => r.role === "manager");
  if (pmProj) return `Project Manager (${pmProj.projectName})`;
  const delegateCat = user.categoryRoles.find((r) => r.isDelegate);
  if (delegateCat) return `Delegate (${delegateCat.categoryName})`;
  return "Employee";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: meResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      let token =
        typeof window !== "undefined"
          ? sessionStorage.getItem("tc_access_token") || localStorage.getItem("tc_access_token")
          : null;
      if (!token && process.env.NEXT_PUBLIC_USE_MOCKS !== "false" && typeof window !== "undefined") {
        const isLoggedOut = localStorage.getItem("tc_logged_out") === "true";
        if (!isLoggedOut) {
          token = "mock-access-token";
          sessionStorage.setItem("tc_access_token", token);
          localStorage.setItem("tc_access_token", token);
        }
      }
      if (!token) {
        return { success: false as const, error: { code: "UNAUTHORIZED", message: "No token", requestId: "local" } };
      }
      return apiClient.get<UserWithRoles>(ENDPOINTS.AUTH.ME);
    },
    staleTime: 5 * 60_000,
    retry: false,
    initialData: () => {
      if (process.env.NEXT_PUBLIC_USE_MOCKS !== "false") {
        const isLoggedOut =
          typeof window !== "undefined" && localStorage.getItem("tc_logged_out") === "true";
        if (!isLoggedOut) {
          return {
            success: true as const,
            data: DEFAULT_MOCK_USER,
          };
        }
      }
      return undefined;
    },
  });

  const user = meResponse?.success ? meResponse.data : null;
  const role = getPrimaryRole(user);
  const roleLabel = getRoleLabel(user);

  const categoryName = user?.categoryRoles?.find((r) => r.isPrimaryLead || r.isDelegate)?.categoryName;
  const projectName = user?.projectRoles?.find((r) => r.role === "manager")?.projectName;

  const login = React.useCallback(
    async (identifier: string, password: string) => {
      try {
        localStorage.removeItem("tc_logged_out");
        const res = await apiClient.post<{ accessToken: string; user: UserWithRoles }>(
          ENDPOINTS.AUTH.LOGIN,
          { email: identifier, username: identifier, password }
        );

        if (res.success) {
          if (res.data?.accessToken) {
            sessionStorage.setItem("tc_access_token", res.data.accessToken);
            localStorage.setItem("tc_access_token", res.data.accessToken);
            queryClient.clear();
            await refetch();
            return { success: true };
          }
          return { success: false, error: "Access token missing from response." };
        } else {
          return {
            success: false,
            error: res.error?.message || "Invalid credentials. Please check your username/email and password.",
          };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error. Please try again.";
        return { success: false, error: msg };
      }
    },
    [queryClient, refetch]
  );

  const signup = React.useCallback(
    async (data: {
      name: string;
      username: string;
      email: string;
      password: string;
      role: "employee" | "lead" | "manager" | "admin";
    }) => {
      try {
        const res = await apiClient.post<{ accessToken: string; user: UserWithRoles }>(
          ENDPOINTS.AUTH.SIGNUP,
          data
        );

        if (res.success) {
          if (res.data?.accessToken) {
            sessionStorage.setItem("tc_access_token", res.data.accessToken);
            localStorage.setItem("tc_access_token", res.data.accessToken);
            queryClient.clear();
            await refetch();
            return { success: true };
          }
          return { success: false, error: "Access token missing from response." };
        } else {
          return {
            success: false,
            error: res.error?.message || "Sign up failed. Please try again.",
          };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error during sign up.";
        return { success: false, error: msg };
      }
    },
    [queryClient, refetch]
  );

  const logout = React.useCallback(() => {
    sessionStorage.removeItem("tc_access_token");
    localStorage.removeItem("tc_access_token");
    localStorage.setItem("tc_logged_out", "true");
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  const canAccessRoute = React.useCallback(
    (pathname: string): boolean => {
      if (!user) return false;
      // Admins have access to everything
      if (role === "admin") return true;

      // Category lead views
      if (pathname.startsWith("/category") && !pathname.includes("/tasks/category")) {
        return role === "lead" || role === "delegate";
      }

      // Review queue
      if (pathname.startsWith("/reviews")) {
        return (
          role === "lead" ||
          role === "manager" ||
          (role === "delegate" &&
            user.categoryRoles.some((r) =>
              r.delegatePermissions?.includes(DelegatePermission.ReviewTask as any)
            ))
        );
      }

      // Creating new projects
      if (pathname === "/projects/new") {
        return role === "manager" || role === "lead";
      }

      // Requests inbox (only leads, delegates, or PMs review incoming requests)
      if (pathname === "/requests/inbox") {
        return role === "lead" || role === "manager" || role === "delegate";
      }

      return true;
    },
    [user, role]
  );

  const contextValue = React.useMemo(
    () => ({
      user,
      role,
      roleLabel,
      categoryName,
      projectName,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      canAccessRoute,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, role, roleLabel, categoryName, projectName, isLoading, login, signup, logout, canAccessRoute]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, canAccessRoute } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, isLoading, isAuthenticated, router, pathname]);

  // Definitely logged out and not loading — show redirect splash briefly on client
  if (mounted && !isLoading && !isAuthenticated) {
    return <AppLoadingScreen message="Redirecting to login…" />;
  }

  // Check route-level authorization (only when user data is resolved)
  if (mounted && user && !canAccessRoute(pathname)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-2">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold font-heading">Access Denied</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Your current role (<strong>{getRoleLabel(user)}</strong>) does not have permission to
          access this route.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Return to your dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
