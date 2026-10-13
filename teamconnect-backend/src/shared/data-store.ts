import {
  AccountType, AdminRole, TaskScope, TaskStatus, TaskPriority,
  RequestStatus, MembershipStatus, ProjectStatus, ProjectMemberRole,
  DelegatePermission, DelegationStatus, NotificationType, AuditAction,
  SubmissionStatus
} from "@teamconnect/shared-types";
import type {
  UserWithRoles, Category, CategoryDelegate, Project, ProjectMember,
  Request, Task, Submission, Notification, AuditEntry
} from "@teamconnect/shared-types";

const now = new Date();
const d = (offsetDays: number) => new Date(now.getTime() + offsetDays * 86_400_000).toISOString();

export const INITIAL_USERS: UserWithRoles[] = [
  {
    _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-120), updatedAt: d(-1),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-200), updatedAt: d(-2),
    preferences: { theme: "light", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [{
      categoryId: "cat-1", categoryName: "Engineering", isPrimaryLead: true,
      isDelegate: false, delegatePermissions: [],
    }],
    projectRoles: [{ projectId: "proj-1", projectName: "Apollo Platform", role: "manager", membershipStatus: MembershipStatus.Active }],
  },
  {
    _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-90), updatedAt: d(-1),
    preferences: { theme: "dark", notificationsEmail: false, notificationsInApp: true },
    categoryRoles: [{
      categoryId: "cat-1", categoryName: "Engineering", isPrimaryLead: false,
      isDelegate: true, delegatePermissions: [DelegatePermission.ReviewTask, DelegatePermission.ApproveRequest],
    }],
    projectRoles: [],
  },
  {
    _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-150), updatedAt: d(-3),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [],
    projectRoles: [{ projectId: "proj-1", projectName: "Apollo Platform", role: "manager", membershipStatus: MembershipStatus.Active }],
  },
  {
    _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com",
    accountType: AccountType.Intern, isActive: true, createdAt: d(-30), updatedAt: d(-1),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-contractor-1", name: "Morgan Blake", email: "morgan.blake@acmecorp.com",
    accountType: AccountType.Contractor, isActive: true, createdAt: d(-60), updatedAt: d(-5),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-180), updatedAt: d(-1),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [{
      categoryId: "cat-2", categoryName: "Product Design", isPrimaryLead: true,
      isDelegate: false, delegatePermissions: [],
    }],
    projectRoles: [],
  },
  {
    _id: "u-org-admin-1", name: "Drew Patel", email: "drew.patel@acmecorp.com",
    accountType: AccountType.Employee, adminRole: AdminRole.OrgAdmin, isActive: true,
    createdAt: d(-365), updatedAt: d(-7),
    preferences: { theme: "dark", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-super-admin-1", name: "Avery Singh", email: "avery.singh@acmecorp.com",
    accountType: AccountType.Employee, adminRole: AdminRole.SuperAdmin, isActive: true,
    createdAt: d(-400), updatedAt: d(-30),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    _id: "cat-1", name: "Engineering", description: "Software development and infrastructure",
    isActive: true, memberCount: 12,
    lead: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-365), updatedAt: d(-2),
  },
  {
    _id: "cat-2", name: "Product Design", description: "UX research, design systems, and prototyping",
    isActive: true, memberCount: 6,
    lead: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-300), updatedAt: d(-5),
  },
  {
    _id: "cat-3", name: "Data Science", description: "Analytics, ML models, and data pipelines",
    isActive: true, memberCount: 8,
    createdAt: d(-200), updatedAt: d(-10),
  },
  {
    _id: "cat-4", name: "Marketing", description: "Brand, campaigns, and growth",
    isActive: true, memberCount: 5,
    lead: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-250), updatedAt: d(-3),
  },
  {
    _id: "cat-5", name: "Legal & Compliance", description: "Contracts, regulatory affairs, and policy",
    isActive: true, memberCount: 3,
    createdAt: d(-180), updatedAt: d(-20),
  },
  {
    _id: "cat-6", name: "People Ops", description: "HR, talent acquisition, and culture",
    isActive: false, memberCount: 4,
    createdAt: d(-180), updatedAt: d(-60),
  },
];

export const INITIAL_DELEGATES: CategoryDelegate[] = [
  {
    _id: "del-1", categoryId: "cat-1",
    delegate: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    grantedBy: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    permissions: [DelegatePermission.ReviewTask, DelegatePermission.ApproveRequest],
    effectiveFrom: d(-30), effectiveTo: d(30),
    status: DelegationStatus.Active,
    createdAt: d(-30), updatedAt: d(-30),
  },
  {
    _id: "del-2", categoryId: "cat-1",
    delegate: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    grantedBy: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    permissions: [DelegatePermission.ManageCategoryTasks],
    effectiveFrom: d(-60), effectiveTo: d(-5),
    status: DelegationStatus.Expired,
    createdAt: d(-60), updatedAt: d(-5),
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    _id: "proj-1", name: "Apollo Platform",
    description: "Redesign and relaunch of the core customer-facing platform with improved performance and UX.",
    originCategory: { _id: "cat-1", name: "Engineering" },
    manager: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Active, startAt: d(-60), endAt: d(60),
    objectives: "Improve platform response time by 40% and increase NPS by 15 points.",
    milestones: [
      { _id: "ms-1", name: "Design Handoff", targetDate: d(-30), status: "completed" },
      { _id: "ms-2", name: "Beta Launch", targetDate: d(15), status: "in_progress" },
      { _id: "ms-3", name: "General Availability", targetDate: d(55), status: "pending" },
    ],
    memberCount: 6, taskCount: 14, canCreateTask: true,
    createdAt: d(-65), updatedAt: d(-1),
  },
  {
    _id: "proj-2", name: "Brand Refresh 2025",
    description: "Complete rebrand across all touch-points including website, collateral, and digital channels.",
    originCategory: { _id: "cat-2", name: "Product Design" },
    manager: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Active, startAt: d(-20), endAt: d(40),
    milestones: [], memberCount: 4, taskCount: 8, canCreateTask: true,
    createdAt: d(-25), updatedAt: d(-2),
  },
  {
    _id: "proj-3", name: "Data Lake Migration",
    description: "Migrate legacy data warehouse to modern cloud data lake architecture.",
    originCategory: { _id: "cat-3", name: "Data Science" },
    manager: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.OnHold, startAt: d(-90), endAt: d(30),
    milestones: [], memberCount: 3, taskCount: 5, canCreateTask: false,
    createdAt: d(-95), updatedAt: d(-10),
  },
  {
    _id: "proj-4", name: "Q1 Marketing Campaign",
    description: "Multi-channel campaign targeting enterprise segment for Q1 pipeline generation.",
    originCategory: { _id: "cat-4", name: "Marketing" },
    manager: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Draft, startAt: d(5), endAt: d(80),
    milestones: [], memberCount: 0, taskCount: 0, canCreateTask: false,
    createdAt: d(-3), updatedAt: d(-1),
  },
  {
    _id: "proj-5", name: "Employee Portal v2",
    description: "Internal HR portal modernization for self-service benefits and time tracking.",
    originCategory: { _id: "cat-6", name: "People Ops" },
    manager: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Completed, startAt: d(-120), endAt: d(-10),
    milestones: [], memberCount: 5, taskCount: 20, canCreateTask: false,
    createdAt: d(-125), updatedAt: d(-10),
  },
];

export const INITIAL_MEMBERSHIPS: ProjectMember[] = [
  {
    _id: "mbr-1", project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    user: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    role: ProjectMemberRole.Member,
    sourceCategory: { _id: "cat-4", name: "Marketing" },
    status: MembershipStatus.Active, startAt: d(-60), endAt: d(60),
    approvedBy: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    renewalPending: false, createdAt: d(-62), updatedAt: d(-62),
  },
  {
    _id: "mbr-2", project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    user: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    role: ProjectMemberRole.Reviewer,
    sourceCategory: { _id: "cat-1", name: "Engineering" },
    status: MembershipStatus.ExpiringSoon, startAt: d(-55), endAt: d(5),
    approvedBy: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    renewalPending: true, createdAt: d(-57), updatedAt: d(-57),
  },
  {
    _id: "mbr-3", project: { _id: "proj-2", name: "Brand Refresh 2025", status: ProjectStatus.Active },
    user: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    role: ProjectMemberRole.Member,
    sourceCategory: { _id: "cat-4", name: "Marketing" },
    status: MembershipStatus.ApprovedNotYetActive, startAt: d(5), endAt: d(40),
    renewalPending: false, createdAt: d(-1), updatedAt: d(-1),
  },
  {
    _id: "mbr-4", project: { _id: "proj-5", name: "Employee Portal v2", status: ProjectStatus.Completed },
    user: { _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com", accountType: AccountType.Intern },
    role: ProjectMemberRole.Member,
    sourceCategory: { _id: "cat-6", name: "People Ops" },
    status: MembershipStatus.Expired, startAt: d(-120), endAt: d(-10),
    renewalPending: false, createdAt: d(-122), updatedAt: d(-10),
  },
  {
    _id: "mbr-5", project: { _id: "proj-3", name: "Data Lake Migration", status: ProjectStatus.OnHold },
    user: { _id: "u-contractor-1", name: "Morgan Blake", email: "morgan.blake@acmecorp.com", accountType: AccountType.Contractor },
    role: ProjectMemberRole.Member,
    sourceCategory: { _id: "cat-3", name: "Data Science" },
    status: MembershipStatus.Revoked, startAt: d(-90), endAt: d(30),
    revokedBy: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    revokeReason: "Contractor engagement ended early per mutual agreement.",
    renewalPending: false, createdAt: d(-92), updatedAt: d(-15),
  },
];

export const INITIAL_REQUESTS: Request[] = [
  {
    _id: "req-1",
    project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    requester: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    targetUser: { _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com", accountType: AccountType.Intern },
    requestingCategory: { _id: "cat-1", name: "Engineering" },
    targetCategory: { _id: "cat-2", name: "Product Design" },
    role: ProjectMemberRole.Member,
    justification: "Riley's UX skills are critical for the upcoming design-engineering handoff sprint.",
    expectedContribution: "Component design review, design token validation, and UX audit of 3 core flows.",
    startAt: d(1), endAt: d(30), workloadPercent: 50,
    status: RequestStatus.Pending,
    createdAt: d(-2), updatedAt: d(-2),
  },
  {
    _id: "req-2",
    project: { _id: "proj-2", name: "Brand Refresh 2025", status: ProjectStatus.Active },
    requester: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    targetUser: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    requestingCategory: { _id: "cat-2", name: "Product Design" },
    targetCategory: { _id: "cat-4", name: "Marketing" },
    role: ProjectMemberRole.Member,
    justification: "Alex's marketing copywriting expertise is needed to finalize brand voice guidelines.",
    expectedContribution: "Brand voice document review and website copy for 5 key pages.",
    startAt: d(-5), endAt: d(40),
    status: RequestStatus.Approved,
    decidedBy: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    decidedAt: d(-3),
    resultingMembership: "mbr-3",
    createdAt: d(-6), updatedAt: d(-3),
  },
  {
    _id: "req-3",
    project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    requester: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    targetUser: { _id: "u-contractor-1", name: "Morgan Blake", email: "morgan.blake@acmecorp.com", accountType: AccountType.Contractor },
    requestingCategory: { _id: "cat-1", name: "Engineering" },
    targetCategory: { _id: "cat-3", name: "Data Science" },
    role: ProjectMemberRole.Member,
    justification: "Need data pipeline expertise for the analytics dashboard feature.",
    expectedContribution: "Design and implement 3 data pipelines.",
    startAt: d(-5), endAt: d(20),
    status: RequestStatus.Rejected,
    decidedBy: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    decidedAt: d(-4),
    rejectionReason: "Morgan is currently at full capacity on the Data Lake Migration project.",
    createdAt: d(-8), updatedAt: d(-4),
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    _id: "task-1", title: "Implement authentication middleware",
    description: "Build JWT-based auth middleware with refresh token rotation and revocation support.",
    scope: TaskScope.Category, category: { _id: "cat-1", name: "Engineering" },
    assignee: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.InProgress, priority: TaskPriority.High,
    dueAt: d(5), isOverdue: false,
    acceptanceCriteria: "All auth endpoints pass integration tests. Refresh rotation works correctly.",
    dependsOn: [], submissionCount: 0, tags: ["auth", "backend"],
    createdAt: d(-10), updatedAt: d(-1),
  },
  {
    _id: "task-2", title: "Design system documentation",
    description: "Document all design tokens, component variants, and usage guidelines.",
    scope: TaskScope.Category, category: { _id: "cat-1", name: "Engineering" },
    assignee: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.SubmittedForReview, priority: TaskPriority.Medium,
    dueAt: d(2), isOverdue: false,
    dependsOn: [], submissionCount: 1,
    latestSubmission: { _id: "sub-1", version: 1, status: "pending_review", submittedAt: d(-1) },
    tags: ["docs", "design-system"],
    createdAt: d(-20), updatedAt: d(-1),
  },
  {
    _id: "task-3", title: "Code review checklist update",
    description: "Update the engineering code review checklist to include security and accessibility criteria.",
    scope: TaskScope.Category, category: { _id: "cat-1", name: "Engineering" },
    assignee: { _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com", accountType: AccountType.Intern },
    status: TaskStatus.RevisionRequested, priority: TaskPriority.Low,
    dueAt: d(-2), isOverdue: true,
    dependsOn: [], submissionCount: 1, tags: ["process"],
    createdAt: d(-15), updatedAt: d(-2),
  },
  {
    _id: "task-4", title: "Q2 tech roadmap presentation",
    description: "Prepare and present the Q2 engineering roadmap to leadership.",
    scope: TaskScope.Category, category: { _id: "cat-1", name: "Engineering" },
    assignee: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.Approved, priority: TaskPriority.High,
    dueAt: d(-5), isOverdue: false,
    dependsOn: [], submissionCount: 2, tags: ["planning"],
    createdAt: d(-30), updatedAt: d(-5),
  },
  {
    _id: "task-7", title: "Component library audit",
    description: "Audit all existing UI components against the new design system tokens.",
    scope: TaskScope.Project, project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    assignee: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.InProgress, priority: TaskPriority.High,
    dueAt: d(3), isOverdue: false,
    dependsOn: [], submissionCount: 0, tags: ["ui", "audit"],
    createdAt: d(-8), updatedAt: d(-1),
  },
  {
    _id: "task-8", title: "Performance profiling report",
    description: "Profile the main application bundle and identify top 5 performance bottlenecks.",
    scope: TaskScope.Project, project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    assignee: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.SubmittedForReview, priority: TaskPriority.Medium,
    dueAt: d(1), isOverdue: false,
    dependsOn: [{ task: { _id: "task-7", title: "Component library audit", status: TaskStatus.InProgress, scope: TaskScope.Project }, status: TaskStatus.InProgress }],
    submissionCount: 1,
    latestSubmission: { _id: "sub-2", version: 1, status: "pending_review", submittedAt: d(-1) },
    tags: ["performance"],
    createdAt: d(-12), updatedAt: d(-1),
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    _id: "sub-1",
    task: { _id: "task-2", title: "Design system documentation", scope: TaskScope.Category },
    submitter: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    version: 1,
    notes: "Completed initial documentation with tokens and typography tables.",
    files: [{ objectName: "docs-v1.pdf", originalName: "tokens.pdf", mimeType: "application/pdf", sizeBytes: 1048576, uploadedAt: d(-1) }],
    status: SubmissionStatus.PendingReview,
    createdAt: d(-1), updatedAt: d(-1),
  },
  {
    _id: "sub-2",
    task: { _id: "task-8", title: "Performance profiling report", scope: TaskScope.Project },
    submitter: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    version: 1,
    notes: "Lighthouse reports and bundle analysis graphs attached.",
    files: [{ objectName: "perf-v1.json", originalName: "bundle-report.json", mimeType: "application/json", sizeBytes: 524288, uploadedAt: d(-1) }],
    status: SubmissionStatus.PendingReview,
    createdAt: d(-1), updatedAt: d(-1),
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    _id: "notif-1", recipient: "u-lead-1",
    type: NotificationType.RequestReceived,
    title: "New membership request",
    body: "Taylor Kim has requested Riley Park to join Apollo Platform.",
    read: false, entityType: "request", entityId: "req-1",
    link: "/requests/inbox",
    createdAt: d(-2), updatedAt: d(-2),
  },
  {
    _id: "notif-2", recipient: "u-lead-1",
    type: NotificationType.TaskReviewRequested,
    title: "Task ready for review",
    body: "Sam Chen submitted 'Design system documentation' for review.",
    read: false, entityType: "task", entityId: "task-2",
    link: "/tasks/task-2/review",
    createdAt: d(-1), updatedAt: d(-1),
  },
];

export const INITIAL_AUDIT: AuditEntry[] = [
  {
    _id: "aud-1",
    actor: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    action: AuditAction.Approve,
    resource: "request",
    resourceId: "req-2",
    reason: "Approved marketing support for Brand Refresh 2025.",
    ip: "192.168.1.10",
    createdAt: d(-3), updatedAt: d(-3),
  },
  {
    _id: "aud-2",
    actor: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    action: AuditAction.Revoke,
    resource: "membership",
    resourceId: "mbr-5",
    reason: "Contractor engagement ended early per mutual agreement.",
    ip: "192.168.1.10",
    createdAt: d(-15), updatedAt: d(-15),
  },
];

// In-memory data store instance
class MemoryStore {
  users = [...INITIAL_USERS];
  categories = [...INITIAL_CATEGORIES];
  delegates = [...INITIAL_DELEGATES];
  projects = [...INITIAL_PROJECTS];
  memberships = [...INITIAL_MEMBERSHIPS];
  requests = [...INITIAL_REQUESTS];
  tasks = [...INITIAL_TASKS];
  submissions = [...INITIAL_SUBMISSIONS];
  notifications = [...INITIAL_NOTIFICATIONS];
  audit = [...INITIAL_AUDIT];
}

export const dbStore = new MemoryStore();

export function getDefaultUser(): UserWithRoles {
  return dbStore.users[0] ?? INITIAL_USERS[0]!;
}

export function getDefaultCategory(): Category {
  return dbStore.categories[0] ?? INITIAL_CATEGORIES[0]!;
}

export function getDefaultProject(): Project {
  return dbStore.projects[0] ?? INITIAL_PROJECTS[0]!;
}
