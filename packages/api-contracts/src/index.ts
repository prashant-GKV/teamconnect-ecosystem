// ─────────────────────────────────────────────────────────────────────────────
// @teamconnect/api-contracts — typed endpoint paths and HTTP method definitions
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "/api/v1";
const p    = (path: string) => `${BASE}${path}`;

export const ENDPOINTS = {
  HEALTH: {
    LIVENESS:  p("/health"),
    READINESS: p("/health/ready"),
  },

  AUTH: {
    LOGIN:          p("/auth/login"),
    SIGNUP:         p("/auth/signup"),
    REGISTER:       p("/auth/register"),
    LOGOUT:         p("/auth/logout"),
    REFRESH:        p("/auth/refresh"),
    ME:             p("/auth/me"),
    FORGOT_PASSWORD: p("/auth/forgot-password"),
    RESET_PASSWORD:  p("/auth/reset-password"),
    CHANGE_PASSWORD: p("/auth/change-password"),
  },

  USERS: {
    LIST:         p("/users"),
    ME_PROFILE:   p("/users/me"),
    BY_ID:        (id: string) => p(`/users/${id}`),
    UPDATE_ME:    p("/users/me"),
    UPLOAD_AVATAR: p("/users/me/avatar"),
    DEACTIVATE:   (id: string) => p(`/users/${id}/deactivate`),
    REACTIVATE:   (id: string) => p(`/users/${id}/reactivate`),
  },

  CATEGORIES: {
    LIST:     p("/categories"),
    CREATE:   p("/categories"),
    BY_ID:    (id: string) => p(`/categories/${id}`),
    UPDATE:   (id: string) => p(`/categories/${id}`),
    ASSIGN_LEAD:   (id: string) => p(`/categories/${id}/lead`),
    UNASSIGN_LEAD: (id: string) => p(`/categories/${id}/lead`),
    DELEGATES:     (id: string) => p(`/categories/${id}/delegates`),
    DELEGATE_BY_ID: (catId: string, delId: string) => p(`/categories/${catId}/delegates/${delId}`),
    MEMBERS:       (id: string) => p(`/categories/${id}/members`),
    MEMBER_BY_ID:  (catId: string, userId: string) => p(`/categories/${catId}/members/${userId}`),
  },

  PROJECTS: {
    LIST:    p("/projects"),
    CREATE:  p("/projects"),
    BY_ID:   (id: string) => p(`/projects/${id}`),
    UPDATE:  (id: string) => p(`/projects/${id}`),
    ARCHIVE: (id: string) => p(`/projects/${id}/archive`),
    MEMBERS: (id: string) => p(`/projects/${id}/members`),
    MEMBER_BY_ID: (projId: string, memberId: string) => p(`/projects/${projId}/members/${memberId}`),
    REVOKE_MEMBER: (projId: string, memberId: string) => p(`/projects/${projId}/members/${memberId}/revoke`),
    RENEW_MEMBER:  (projId: string, memberId: string) => p(`/projects/${projId}/members/${memberId}/renew`),
    MILESTONES:    (id: string) => p(`/projects/${id}/milestones`),
    TASKS:         (id: string) => p(`/projects/${id}/tasks`),
  },

  REQUESTS: {
    LIST:    p("/requests"),
    CREATE:  p("/requests"),
    BY_ID:   (id: string) => p(`/requests/${id}`),
    APPROVE: (id: string) => p(`/requests/${id}/approve`),
    REJECT:  (id: string) => p(`/requests/${id}/reject`),
    CANCEL:  (id: string) => p(`/requests/${id}/cancel`),
  },

  MEMBERSHIPS: {
    LIST:   p("/memberships"),
    BY_ID:  (id: string) => p(`/memberships/${id}`),
    REVOKE: (id: string) => p(`/memberships/${id}/revoke`),
    RENEW:  (id: string) => p(`/memberships/${id}/renew`),
  },

  TASKS: {
    LIST:    p("/tasks"),
    CREATE:  p("/tasks"),
    BY_ID:   (id: string) => p(`/tasks/${id}`),
    UPDATE:  (id: string) => p(`/tasks/${id}`),
    DELETE:  (id: string) => p(`/tasks/${id}`),
    ASSIGN:  (id: string) => p(`/tasks/${id}/assign`),
    START:   (id: string) => p(`/tasks/${id}/start`),
    BLOCK:   (id: string) => p(`/tasks/${id}/block`),
    CANCEL:  (id: string) => p(`/tasks/${id}/cancel`),
    REVIEW:  (id: string) => p(`/tasks/${id}/review`),
    APPROVE: (id: string) => p(`/tasks/${id}/approve`),
    REQUEST_REVISION: (id: string) => p(`/tasks/${id}/request-revision`),
    DEPENDENCIES: (id: string) => p(`/tasks/${id}/dependencies`),
    SUBMISSIONS:  (id: string) => p(`/tasks/${id}/submissions`),
  },

  SUBMISSIONS: {
    BY_ID:            (taskId: string, subId: string) => p(`/tasks/${taskId}/submissions/${subId}`),
    REQUEST_UPLOAD_URL: p("/submissions/upload-url"),
    APPROVE:          (taskId: string, subId: string) => p(`/tasks/${taskId}/submissions/${subId}/approve`),
    REQUEST_REVISION: (taskId: string, subId: string) => p(`/tasks/${taskId}/submissions/${subId}/request-revision`),
  },

  COMMUNICATIONS: {
    THREADS:      (taskId: string) => p(`/tasks/${taskId}/comments`),
    ADD_COMMENT:  (taskId: string) => p(`/tasks/${taskId}/comments`),
    DELETE_COMMENT: (taskId: string, commentId: string) => p(`/tasks/${taskId}/comments/${commentId}`),
  },

  NOTIFICATIONS: {
    LIST:     p("/notifications"),
    READ:     (id: string) => p(`/notifications/${id}/read`),
    READ_ALL: p("/notifications/read-all"),
    DELETE:   (id: string) => p(`/notifications/${id}`),
    SETTINGS: p("/notifications/settings"),
  },

  AUDIT: {
    LIST:  p("/audit"),
    BY_ID: (id: string) => p(`/audit/${id}`),
  },

  REPORTS: {
    OVERVIEW:     p("/reports/overview"),
    TASKS:        p("/reports/tasks"),
    MEMBERSHIPS:  p("/reports/memberships"),
    EXPORT:       (type: string) => p(`/reports/${type}/export`),
  },

  ADMIN: {
    STATS:          p("/admin/stats"),
    CREATE_USER:    p("/admin/users"),
    DEACTIVATE_USER:(id: string) => p(`/admin/users/${id}/deactivate`),
    RESET_PASSWORD: (id: string) => p(`/admin/users/${id}/reset-password`),
  },
} as const;

// HTTP method hints for type-safe client construction
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
