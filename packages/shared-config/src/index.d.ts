export declare const ROUTES: {
    readonly LOGIN: "/login";
    readonly FORGOT_PASSWORD: "/forgot-password";
    readonly RESET_PASSWORD: "/reset-password";
    readonly DASHBOARD: "/dashboard";
    readonly PROFILE: "/profile";
    readonly TASKS_CATEGORY: "/tasks/category";
    readonly TASKS_PROJECT: "/tasks/project";
    readonly TASK_DETAIL: (id: string) => string;
    readonly PROJECTS: "/projects";
    readonly PROJECT_DETAIL: (id: string) => string;
    readonly REQUESTS_INBOX: "/requests/inbox";
    readonly REQUESTS_OUTBOX: "/requests/outbox";
    readonly REQUEST_DETAIL: (id: string) => string;
    readonly MEMBERSHIPS: "/memberships";
    readonly REVIEWS: "/reviews";
    readonly NOTIFICATIONS: "/notifications";
    readonly SETTINGS: "/settings";
};
export declare const ADMIN_ROUTES: {
    readonly DASHBOARD: "/dashboard";
    readonly USERS: "/users";
    readonly CATEGORIES: "/categories";
    readonly PROJECTS: "/projects";
    readonly MEMBERSHIPS: "/memberships";
    readonly REPORTS: "/reports";
    readonly AUDIT: "/audit";
    readonly SETTINGS: "/settings";
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const BUSINESS_RULES: {
    readonly EXPIRY_WARNING_DAYS: 7;
    readonly MAX_ACTIVE_MEMBERSHIPS: 5;
    readonly MEMBERSHIP_WORKLOAD_MAX_PCT: 100;
    readonly MAX_TASK_TITLE_LENGTH: 200;
    readonly MAX_TASK_DESCRIPTION_LENGTH: 5000;
    readonly MAX_FILE_SIZE_BYTES: number;
    readonly MAX_FILES_PER_SUBMISSION: 10;
    readonly MAX_PROJECT_NAME_LENGTH: 150;
    readonly MAX_PROJECT_MEMBERS: 50;
    readonly MIN_PASSWORD_LENGTH: 8;
    readonly MAX_LOGIN_ATTEMPTS: 5;
    readonly LOCKOUT_DURATION_MINUTES: 15;
    readonly MAX_DELEGATES_PER_CATEGORY: 5;
};
export declare const ALLOWED_MIME_TYPES: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/zip", "text/plain", "text/csv", "text/markdown", "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "video/mp4", "video/webm"];
export declare const ALLOWED_TASK_TRANSITIONS: Record<string, string[]>;
export declare const ALLOWED_REQUEST_TRANSITIONS: Record<string, string[]>;
export declare const ALLOWED_MEMBERSHIP_TRANSITIONS: Record<string, string[]>;
//# sourceMappingURL=index.d.ts.map