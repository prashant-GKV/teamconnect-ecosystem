// ─────────────────────────────────────────────────────────────────────────────
// @teamconnect/shared-types  —  Single source of truth for all TypeScript types
// Consumed by: backend, frontend, admin, validation, api-contracts
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum AccountType {
  Employee   = "employee",
  Intern     = "intern",
  Contractor = "contractor",
}

export enum AdminRole {
  SuperAdmin = "super_admin",
  OrgAdmin   = "org_admin",
}

export enum TaskScope {
  Category = "category",
  Project  = "project",
}

export enum TaskStatus {
  Draft               = "draft",
  Assigned            = "assigned",
  InProgress          = "in_progress",
  SubmittedForReview  = "submitted_for_review",
  RevisionRequested   = "revision_requested",
  Approved            = "approved",
  Blocked             = "blocked",
  Cancelled           = "cancelled",
}

export enum TaskPriority {
  Urgent = "urgent",
  High   = "high",
  Medium = "medium",
  Low    = "low",
}

export enum SubmissionStatus {
  PendingReview    = "pending_review",
  Approved         = "approved",
  RevisionRequired = "revision_required",
}

export enum RequestStatus {
  Pending   = "pending",
  Approved  = "approved",
  Rejected  = "rejected",
  Cancelled = "cancelled",
  Expired   = "expired",
}

export enum MembershipStatus {
  PendingApproval      = "pending_approval",
  ApprovedNotYetActive = "approved_not_yet_active",
  Active               = "active",
  ExpiringSoon         = "expiring_soon",
  Expired              = "expired",
  Revoked              = "revoked",
}

export enum ProjectStatus {
  Draft     = "draft",
  Active    = "active",
  OnHold    = "on_hold",
  Completed = "completed",
  Archived  = "archived",
}

export enum ProjectMemberRole {
  Manager  = "manager",
  Reviewer = "reviewer",
  Member   = "member",
}

export enum DelegatePermission {
  ManageCategoryTasks = "manage_category_tasks",
  ReviewTask          = "review_task",
  ApproveRequest      = "approve_request",
  ManageDelegates     = "manage_delegates",
}

export enum DelegationStatus {
  Active  = "active",
  Expired = "expired",
  Revoked = "revoked",
}

export enum NotificationType {
  TaskAssigned            = "task_assigned",
  TaskStatusChanged       = "task_status_changed",
  TaskReviewRequested     = "task_review_requested",
  TaskApproved            = "task_approved",
  TaskRevisionRequested   = "task_revision_requested",
  RequestReceived         = "request_received",
  RequestApproved         = "request_approved",
  RequestRejected         = "request_rejected",
  RequestCancelled        = "request_cancelled",
  MembershipActivated     = "membership_activated",
  MembershipExpiring      = "membership_expiring",
  MembershipExpired       = "membership_expired",
  MembershipRevoked       = "membership_revoked",
  DelegateGranted         = "delegate_granted",
  DelegateRevoked         = "delegate_revoked",
  SystemAnnouncement      = "system_announcement",
}

export enum AuditAction {
  Create = "create",
  Update = "update",
  Delete = "delete",
  Approve = "approve",
  Reject  = "reject",
  Revoke  = "revoke",
  Login   = "login",
  Logout  = "logout",
}

// ── Base ──────────────────────────────────────────────────────────────────────

export interface BaseDocument {
  _id:       string;
  createdAt: string;
  updatedAt: string;
}

// ── User Summary (for embedding in other docs) ────────────────────────────────

export interface UserSummary {
  _id:         string;
  name:        string;
  email:       string;
  accountType: AccountType;
  avatarUrl?:  string;
}

// ── Category Role (embedded in UserWithRoles) ─────────────────────────────────

export interface UserCategoryRole {
  categoryId:          string;
  categoryName:        string;
  isPrimaryLead:       boolean;
  isDelegate:          boolean;
  delegatePermissions: DelegatePermission[];
}

// ── Project Role (embedded in UserWithRoles) ──────────────────────────────────

export interface UserProjectRole {
  projectId:        string;
  projectName:      string;
  role:             "manager" | "reviewer" | "member";
  membershipStatus: MembershipStatus;
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface UserPreferences {
  theme:                "light" | "dark" | "system";
  notificationsEmail:   boolean;
  notificationsInApp:   boolean;
}

export interface UserWithRoles extends UserSummary {
  adminRole?:    AdminRole;
  isActive:      boolean;
  preferences:   UserPreferences;
  categoryRoles: UserCategoryRole[];
  projectRoles:  UserProjectRole[];
  createdAt:     string;
  updatedAt:     string;
}

// ── Category ──────────────────────────────────────────────────────────────────

export interface Category extends BaseDocument {
  name:        string;
  description?: string;
  isActive:    boolean;
  lead?:       UserSummary;
  memberCount: number;
}

// ── Category Delegate ─────────────────────────────────────────────────────────

export interface CategoryDelegate extends BaseDocument {
  categoryId:    string;
  delegate:      UserSummary;
  grantedBy:     UserSummary;
  permissions:   DelegatePermission[];
  effectiveFrom: string;
  effectiveTo:   string;
  status:        DelegationStatus;
}

// ── Project ───────────────────────────────────────────────────────────────────

export interface Milestone {
  _id:        string;
  name:       string;
  targetDate: string;
  status:     "pending" | "in_progress" | "completed";
}

export interface Project extends BaseDocument {
  name:             string;
  description?:     string;
  originCategory:   { _id: string; name: string };
  manager:          UserSummary;
  status:           ProjectStatus;
  startAt:          string;
  endAt:            string;
  objectives?:      string;
  milestones:       Milestone[];
  memberCount:      number;
  taskCount:        number;
  canCreateTask:    boolean;  // derived: user is PM or lead of origin category
}

// ── Project Member (Membership) ───────────────────────────────────────────────

export interface ProjectMember extends BaseDocument {
  project:         { _id: string; name: string; status: ProjectStatus };
  user:            UserSummary;
  role:            ProjectMemberRole;
  sourceCategory:  { _id: string; name: string };
  status:          MembershipStatus;
  startAt:         string;
  endAt:           string;
  approvedBy?:     UserSummary;
  revokedBy?:      UserSummary;
  revokeReason?:   string;
  renewalPending:  boolean;
}

// ── Request ───────────────────────────────────────────────────────────────────

export interface Request extends BaseDocument {
  project:            { _id: string; name: string; status: ProjectStatus };
  requester:          UserSummary;
  targetUser:         UserSummary;
  requestingCategory: { _id: string; name: string };
  targetCategory:     { _id: string; name: string };
  role:               ProjectMemberRole;
  justification:      string;
  expectedContribution?: string;
  startAt:            string;
  endAt:              string;
  workloadPercent?:   number;
  status:             RequestStatus;
  decidedBy?:         UserSummary;
  decidedAt?:         string;
  rejectionReason?:   string;
  cancelledAt?:       string;
  resultingMembership?: string;
}

// ── Task ──────────────────────────────────────────────────────────────────────

export interface TaskDependency {
  task:   { _id: string; title: string; status: TaskStatus; scope: TaskScope };
  status: TaskStatus;
}

export interface SubmissionSummary {
  _id:         string;
  version:     number;
  status:      "pending_review" | "approved" | "revision_required";
  submittedAt: string;
}

export interface Task extends BaseDocument {
  title:              string;
  description?:       string;
  scope:              TaskScope;
  // Category tasks:
  category?:          { _id: string; name: string };
  // Project tasks:
  project?:           { _id: string; name: string; status: ProjectStatus };
  assignee?:          UserSummary;
  reviewer?:          UserSummary;
  status:             TaskStatus;
  priority:           TaskPriority;
  dueAt?:             string;
  isOverdue:          boolean;
  acceptanceCriteria?: string;
  dependsOn:          TaskDependency[];
  submissionCount:    number;
  latestSubmission?:  SubmissionSummary;
  tags:               string[];
}

// ── Submission ────────────────────────────────────────────────────────────────

export interface SubmissionFile {
  objectName:   string;
  originalName: string;
  mimeType:     string;
  sizeBytes:    number;
  uploadedAt:   string;
}

export interface Submission extends BaseDocument {
  task:      { _id: string; title: string; scope: TaskScope };
  submitter: UserSummary;
  version:   number;
  notes?:    string;
  files:     SubmissionFile[];
  status:    SubmissionStatus;
  reviewedBy?: UserSummary;
  reviewedAt?: string;
  reviewNotes?: string;
}

// ── Notification ──────────────────────────────────────────────────────────────

export interface Notification extends BaseDocument {
  recipient:   string;  // userId
  type:        NotificationType;
  title:       string;
  body:        string;
  read:        boolean;
  entityType?: string;
  entityId?:   string;
  link?:       string;
}

// ── Audit ─────────────────────────────────────────────────────────────────────

export interface AuditEntry extends BaseDocument {
  actor:       UserSummary;
  action:      AuditAction;
  resource:    string;
  resourceId:  string;
  changes?:    Record<string, { before: unknown; after: unknown }>;
  reason?:     string;
  ip?:         string;
  userAgent?:  string;
}

// ── API Envelope ──────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data:    T;
  meta?:   Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code:      string;
    message:   string;
    details?:  unknown;
    requestId: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResult<T> {
  data:       T[];
  pagination: {
    page:        number;
    limit:       number;
    total:       number;
    totalPages:  number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type PaginatedResponse<T> = PaginatedResult<T>;

