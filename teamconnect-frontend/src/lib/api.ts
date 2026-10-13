// Typed API client — single fetch wrapper used by all features.
// Handles: auth token, 401 refresh, request-id, idempotency-key, error normalization.

import { clientEnv } from "./env";
import type { ApiResponse, ApiError } from "@teamconnect/shared-types";
import { randomUUID } from "crypto";

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function getToken() { return accessToken; }
export function setToken(t: string | null) { accessToken = t; }

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => { refreshQueue.push(resolve); });
  }
  isRefreshing = true;
  try {
    const res = await fetch(`${clientEnv.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) { setToken(null); refreshQueue.forEach((cb) => cb(null)); return null; }
    const json = await res.json() as { data: { accessToken: string } };
    const newToken = json.data.accessToken;
    setToken(newToken);
    refreshQueue.forEach((cb) => cb(newToken));
    return newToken;
  } finally {
    isRefreshing = false;
    refreshQueue = [];
  }
}

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

interface FetchOptions extends RequestInit {
  idempotent?: boolean;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${clientEnv.API_BASE_URL}${path}`;
  const requestId = randomUUID();

  const headers: Record<string, string> = {
    "Content-Type":    "application/json",
    "x-request-id":   requestId,
    ...(options.idempotent ? { "idempotency-key": randomUUID() } : {}),
    ...((options.headers ?? {}) as Record<string, string>),
  };

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(url, { ...options, headers, credentials: "include" });

  // Auto-refresh on 401
  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers, credentials: "include" });
    }
  }

  const json = await res.json() as ApiResponse<T>;

  if (!json.success) {
    const err = (json as unknown as { error: ApiError["error"] }).error;
    throw new ApiClientError(err.code, err.message, res.status, err.details, err.requestId);
  }

  return (json as unknown as { data: T }).data;
}

export const api = {
  get:    <T>(path: string, opts?: FetchOptions) => apiFetch<T>(path, { ...opts, method: "GET" }),
  post:   <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { ...opts, method: "POST",  body: body ? JSON.stringify(body) : undefined }),
  patch:  <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { ...opts, method: "PATCH",  body: body ? JSON.stringify(body) : undefined }),
  put:    <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { ...opts, method: "PUT",   body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, opts?: FetchOptions) => apiFetch<T>(path, { ...opts, method: "DELETE" }),
};

export default api;