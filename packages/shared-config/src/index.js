"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// @teamconnect/shared-config — constants and route definitions
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_MEMBERSHIP_TRANSITIONS = exports.ALLOWED_REQUEST_TRANSITIONS = exports.ALLOWED_TASK_TRANSITIONS = exports.ALLOWED_MIME_TYPES = exports.BUSINESS_RULES = exports.PAGINATION = exports.ADMIN_ROUTES = exports.ROUTES = void 0;
// ── App Routes (frontend) ─────────────────────────────────────────────────────
exports.ROUTES = {
    // Auth
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    // Authenticated
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    // Tasks
    TASKS_CATEGORY: "/tasks/category",
    TASKS_PROJECT: "/tasks/project",
    TASK_DETAIL: (id) => `/tasks/${id}`,
    // Projects
    PROJECTS: "/projects",
    PROJECT_DETAIL: (id) => `/projects/${id}`,
    // Requests
    REQUESTS_INBOX: "/requests/inbox",
    REQUESTS_OUTBOX: "/requests/outbox",
    REQUEST_DETAIL: (id) => `/requests/${id}`,
    // Memberships
    MEMBERSHIPS: "/memberships",
    // Reviews
    REVIEWS: "/reviews",
    // Notifications
    NOTIFICATIONS: "/notifications",
    // Settings
    SETTINGS: "/settings",
};
// ── Admin Routes ──────────────────────────────────────────────────────────────
exports.ADMIN_ROUTES = {
    DASHBOARD: "/dashboard",
    USERS: "/users",
    CATEGORIES: "/categories",
    PROJECTS: "/projects",
    MEMBERSHIPS: "/memberships",
    REPORTS: "/reports",
    AUDIT: "/audit",
    SETTINGS: "/settings",
};
// ── Pagination ────────────────────────────────────────────────────────────────
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
// ── Business Rules ────────────────────────────────────────────────────────────
exports.BUSINESS_RULES = {
    // Memberships
    EXPIRY_WARNING_DAYS: 7,
    MAX_ACTIVE_MEMBERSHIPS: 5, // per user, per project cap (assumption)
    MEMBERSHIP_WORKLOAD_MAX_PCT: 100,
    // Tasks
    MAX_TASK_TITLE_LENGTH: 200,
    MAX_TASK_DESCRIPTION_LENGTH: 5000,
    MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB
    MAX_FILES_PER_SUBMISSION: 10,
    // Projects
    MAX_PROJECT_NAME_LENGTH: 150,
    MAX_PROJECT_MEMBERS: 50,
    // Auth
    MIN_PASSWORD_LENGTH: 8,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 15,
    // Delegate permissions
    MAX_DELEGATES_PER_CATEGORY: 5,
};
// ── File types ────────────────────────────────────────────────────────────────
exports.ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "text/plain",
    "text/csv",
    "text/markdown",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
];
// ── Task status transitions (FE validation only; backend enforces authoritatively) ──
exports.ALLOWED_TASK_TRANSITIONS = {
    draft: ["assigned"],
    assigned: ["in_progress", "cancelled"],
    in_progress: ["submitted_for_review", "blocked", "cancelled"],
    submitted_for_review: ["revision_requested", "approved"],
    revision_requested: ["in_progress", "cancelled"],
    blocked: ["in_progress", "cancelled"],
    approved: [],
    cancelled: [],
};
// ── Request status transitions ────────────────────────────────────────────────
exports.ALLOWED_REQUEST_TRANSITIONS = {
    pending: ["approved", "rejected", "cancelled"],
    approved: [],
    rejected: [],
    cancelled: [],
    expired: [],
};
// ── Membership status transitions ─────────────────────────────────────────────
exports.ALLOWED_MEMBERSHIP_TRANSITIONS = {
    pending_approval: ["approved_not_yet_active", "rejected"],
    approved_not_yet_active: ["active"],
    active: ["expiring_soon", "expired", "revoked"],
    expiring_soon: ["active", "expired", "revoked"],
    expired: ["active"], // via renewal
    revoked: [],
};
//# sourceMappingURL=index.js.map