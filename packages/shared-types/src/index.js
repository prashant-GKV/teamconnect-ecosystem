"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// @teamconnect/shared-types  —  Single source of truth for all TypeScript types
// Consumed by: backend, frontend, admin, validation, api-contracts
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.NotificationType = exports.DelegationStatus = exports.DelegatePermission = exports.ProjectMemberRole = exports.ProjectStatus = exports.MembershipStatus = exports.RequestStatus = exports.SubmissionStatus = exports.TaskPriority = exports.TaskStatus = exports.TaskScope = exports.AdminRole = exports.AccountType = void 0;
// ── Enums ─────────────────────────────────────────────────────────────────────
var AccountType;
(function (AccountType) {
    AccountType["Employee"] = "employee";
    AccountType["Intern"] = "intern";
    AccountType["Contractor"] = "contractor";
})(AccountType || (exports.AccountType = AccountType = {}));
var AdminRole;
(function (AdminRole) {
    AdminRole["SuperAdmin"] = "super_admin";
    AdminRole["OrgAdmin"] = "org_admin";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
var TaskScope;
(function (TaskScope) {
    TaskScope["Category"] = "category";
    TaskScope["Project"] = "project";
})(TaskScope || (exports.TaskScope = TaskScope = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Draft"] = "draft";
    TaskStatus["Assigned"] = "assigned";
    TaskStatus["InProgress"] = "in_progress";
    TaskStatus["SubmittedForReview"] = "submitted_for_review";
    TaskStatus["RevisionRequested"] = "revision_requested";
    TaskStatus["Approved"] = "approved";
    TaskStatus["Blocked"] = "blocked";
    TaskStatus["Cancelled"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["Urgent"] = "urgent";
    TaskPriority["High"] = "high";
    TaskPriority["Medium"] = "medium";
    TaskPriority["Low"] = "low";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["PendingReview"] = "pending_review";
    SubmissionStatus["Approved"] = "approved";
    SubmissionStatus["RevisionRequired"] = "revision_required";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["Pending"] = "pending";
    RequestStatus["Approved"] = "approved";
    RequestStatus["Rejected"] = "rejected";
    RequestStatus["Cancelled"] = "cancelled";
    RequestStatus["Expired"] = "expired";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var MembershipStatus;
(function (MembershipStatus) {
    MembershipStatus["PendingApproval"] = "pending_approval";
    MembershipStatus["ApprovedNotYetActive"] = "approved_not_yet_active";
    MembershipStatus["Active"] = "active";
    MembershipStatus["ExpiringSoon"] = "expiring_soon";
    MembershipStatus["Expired"] = "expired";
    MembershipStatus["Revoked"] = "revoked";
})(MembershipStatus || (exports.MembershipStatus = MembershipStatus = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Draft"] = "draft";
    ProjectStatus["Active"] = "active";
    ProjectStatus["OnHold"] = "on_hold";
    ProjectStatus["Completed"] = "completed";
    ProjectStatus["Archived"] = "archived";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectMemberRole;
(function (ProjectMemberRole) {
    ProjectMemberRole["Manager"] = "manager";
    ProjectMemberRole["Reviewer"] = "reviewer";
    ProjectMemberRole["Member"] = "member";
})(ProjectMemberRole || (exports.ProjectMemberRole = ProjectMemberRole = {}));
var DelegatePermission;
(function (DelegatePermission) {
    DelegatePermission["ManageCategoryTasks"] = "manage_category_tasks";
    DelegatePermission["ReviewTask"] = "review_task";
    DelegatePermission["ApproveRequest"] = "approve_request";
    DelegatePermission["ManageDelegates"] = "manage_delegates";
})(DelegatePermission || (exports.DelegatePermission = DelegatePermission = {}));
var DelegationStatus;
(function (DelegationStatus) {
    DelegationStatus["Active"] = "active";
    DelegationStatus["Expired"] = "expired";
    DelegationStatus["Revoked"] = "revoked";
})(DelegationStatus || (exports.DelegationStatus = DelegationStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["TaskAssigned"] = "task_assigned";
    NotificationType["TaskStatusChanged"] = "task_status_changed";
    NotificationType["TaskReviewRequested"] = "task_review_requested";
    NotificationType["TaskApproved"] = "task_approved";
    NotificationType["TaskRevisionRequested"] = "task_revision_requested";
    NotificationType["RequestReceived"] = "request_received";
    NotificationType["RequestApproved"] = "request_approved";
    NotificationType["RequestRejected"] = "request_rejected";
    NotificationType["RequestCancelled"] = "request_cancelled";
    NotificationType["MembershipActivated"] = "membership_activated";
    NotificationType["MembershipExpiring"] = "membership_expiring";
    NotificationType["MembershipExpired"] = "membership_expired";
    NotificationType["MembershipRevoked"] = "membership_revoked";
    NotificationType["DelegateGranted"] = "delegate_granted";
    NotificationType["DelegateRevoked"] = "delegate_revoked";
    NotificationType["SystemAnnouncement"] = "system_announcement";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["Create"] = "create";
    AuditAction["Update"] = "update";
    AuditAction["Delete"] = "delete";
    AuditAction["Approve"] = "approve";
    AuditAction["Reject"] = "reject";
    AuditAction["Revoke"] = "revoke";
    AuditAction["Login"] = "login";
    AuditAction["Logout"] = "logout";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
//# sourceMappingURL=index.js.map