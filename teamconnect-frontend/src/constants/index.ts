/**
 * Application Constants
 * Follows UPPER_SNAKE_CASE naming convention.
 */

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export const QUERY_STALE_TIME_MS = 60_000;
export const QUERY_GC_TIME_MS = 300_000;
export const NOTIFICATION_POLL_INTERVAL_MS = 30_000;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "tc_token",
  ACTIVE_USER: "tc_active_user",
  THEME: "tc_theme",
  SIDEBAR_COLLAPSED: "tc_sidebar_collapsed",
} as const;

export const AUTH_ROLES = {
  ADMIN: "admin",
  LEAD: "lead",
  MANAGER: "manager",
  EMPLOYEE: "employee",
} as const;

export const APP_ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  TASKS: "/tasks",
  TASKS_CATEGORY: "/tasks/category",
  TASKS_PROJECT: "/tasks/project",
  PROJECTS: "/projects",
  REQUESTS: "/requests",
  REQUESTS_INBOX: "/requests/inbox",
  REQUESTS_OUTBOX: "/requests/outbox",
  REVIEWS: "/reviews",
  MEMBERSHIPS: "/memberships",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;
