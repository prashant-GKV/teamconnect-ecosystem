// Thin fetch wrapper with auto-retry, auth header injection, and typed responses
import type { ApiResponse } from "@teamconnect/shared-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("tc_access_token") || localStorage.getItem("tc_access_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  retries = 1
): Promise<ApiResponse<T>> {

  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Request-ID": typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const url = path.startsWith("http") ? path : `${BASE_URL.replace(/\/api\/v1$/,"")}${path}`;
    const res = await fetch(url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    // Handle 401 — try token refresh once only if token existed and not on an auth endpoint
    if (res.status === 401 && retries > 0 && token && !path.includes("/auth/")) {
      try {
        const refreshed = await fetch(`${BASE_URL.replace(/\/api\/v1$/,"")}/api/v1/auth/refresh`, {
          method:      "POST",
          credentials: "include",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (refreshed.ok) {
          const data = await refreshed.json() as { data: { accessToken: string } };
          if (data.data?.accessToken) {
            sessionStorage.setItem("tc_access_token", data.data.accessToken);
            localStorage.setItem("tc_access_token", data.data.accessToken);
            return request<T>(method, path, body, 0);
          }
        }
      } catch {
        // Refresh failed
      }

      // Refresh failed — clear token and redirect to login if not already there
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
        sessionStorage.removeItem("tc_access_token");
        localStorage.removeItem("tc_access_token");
        window.location.href = "/login";
      }
    }

    const json = await res.json() as ApiResponse<T>;
    return json;
  } catch (err: unknown) {
    if (process.env.NEXT_PUBLIC_USE_MOCKS !== "false" && typeof window !== "undefined" && !window.__mswStarted && retries > 0) {
      try {
        const { initMocks } = await import("./mocks/init");
        await initMocks();
        return request<T>(method, path, body, retries - 1);
      } catch {
        // Mock fallback failed
      }
    }

    return {
      success: false,
      error: {
        code:      "NETWORK_ERROR",
        message:   "Network request failed. Please check your connection.",
        requestId: "client",
      },
    };
  }
}

export const apiClient = {
  get:    <T>(path: string)                      => request<T>("GET",    path),
  post:   <T>(path: string, body?: unknown)      => request<T>("POST",   path, body),
  put:    <T>(path: string, body?: unknown)      => request<T>("PUT",    path, body),
  patch:  <T>(path: string, body?: unknown)      => request<T>("PATCH",  path, body),
  delete: <T>(path: string)                      => request<T>("DELETE", path),
};
