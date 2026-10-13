// ─────────────────────────────────────────────────────────────────────────────
// Realistic seed data covering all roles, states, and lifecycle scenarios.
// Used by MSW mock handlers and the /dev/components showcase.
// ─────────────────────────────────────────────────────────────────────────────
import {
  AccountType, AdminRole, TaskScope, TaskStatus, TaskPriority,
  RequestStatus, MembershipStatus, ProjectStatus, ProjectMemberRole,
  DelegatePermission, DelegationStatus, NotificationType,
} from "@teamconnect/shared-types";
import type {
  UserWithRoles, Category, CategoryDelegate, Project, ProjectMember,
  Request, Task, Submission, Notification, AuditEntry,
} from "@teamconnect/shared-types";

const now = new Date();
const d = (offsetDays: number) => new Date(now.getTime() + offsetDays * 86_400_000).toISOString();

// ── Users ─────────────────────────────────────────────────────────────────────

export const SEED_USERS: UserWithRoles[] = [
  {
    _id: "u-employee-1", name: "Alex Rivera",       email: "alex.rivera@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-120), updatedAt: d(-1),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-lead-1", name: "Jordan Lee",         email: "jordan.lee@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-200), updatedAt: d(-2),
    preferences: { theme: "light", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [{
      categoryId: "cat-1", categoryName: "Engineering", isPrimaryLead: true,
      isDelegate: false, delegatePermissions: [],
    }],
    projectRoles: [{ projectId: "proj-1", projectName: "Apollo Platform", role: "manager", membershipStatus: MembershipStatus.Active }],
  },
  {
    _id: "u-delegate-1", name: "Sam Chen",       email: "sam.chen@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-90), updatedAt: d(-1),
    preferences: { theme: "dark", notificationsEmail: false, notificationsInApp: true },
    categoryRoles: [{
      categoryId: "cat-1", categoryName: "Engineering", isPrimaryLead: false,
      isDelegate: true, delegatePermissions: [DelegatePermission.ReviewTask, DelegatePermission.ApproveRequest],
    }],
    projectRoles: [],
  },
  {
    _id: "u-pm-1", name: "Taylor Kim",          email: "taylor.kim@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-150), updatedAt: d(-3),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [],
    projectRoles: [{ projectId: "proj-1", projectName: "Apollo Platform", role: "manager", membershipStatus: MembershipStatus.Active }],
  },
  {
    _id: "u-intern-1", name: "Riley Park",      email: "riley.park@acmecorp.com",
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
    _id: "u-lead-2", name: "Casey Wong",         email: "casey.wong@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-180), updatedAt: d(-1),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [{
      categoryId: "cat-2", categoryName: "Product Design", isPrimaryLead: true,
      isDelegate: false, delegatePermissions: [],
    }],
    projectRoles: [],
  },
  {
    _id: "u-org-admin-1", name: "Drew Patel",    email: "drew.patel@acmecorp.com",
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

// ── Categories ────────────────────────────────────────────────────────────────

export const SEED_CATEGORIES: Category[] = [
  {
    _id: "cat-1", name: "Engineering",     description: "Software development and infrastructure",
    isActive: true, memberCount: 12,
    lead: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-365), updatedAt: d(-2),
  },
  {
    _id: "cat-2", name: "Product Design",  description: "UX research, design systems, and prototyping",
    isActive: true, memberCount: 6,
    lead: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-300), updatedAt: d(-5),
  },
  {
    _id: "cat-3", name: "Data Science",    description: "Analytics, ML models, and data pipelines",
    isActive: true, memberCount: 8, lead: undefined,
    createdAt: d(-200), updatedAt: d(-10),
  },
  {
    _id: "cat-4", name: "Marketing",       description: "Brand, campaigns, and growth",
    isActive: true, memberCount: 5,
    lead: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-250), updatedAt: d(-3),
  },
  {
    _id: "cat-5", name: "Legal & Compliance", description: "Contracts, regulatory affairs, and policy",
    isActive: true, memberCount: 3, lead: undefined,
    createdAt: d(-180), updatedAt: d(-20),
  },
  {
    _id: "cat-6", name: "People Ops",     description: "HR, talent acquisition, and culture",
    isActive: false, memberCount: 4, lead: undefined,
    createdAt: d(-180), updatedAt: d(-60),
  },
];

// ── Delegates ─────────────────────────────────────────────────────────────────

export const SEED_DELEGATES: CategoryDelegate[] = [
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

// ── Projects ──────────────────────────────────────────────────────────────────

export const SEED_PROJECTS: Project[] = [
  {
    _id: "proj-1", name: "Apollo Platform",
    description: "Redesign and relaunch of the core customer-facing platform with improved performance and UX.",
    originCategory: { _id: "cat-1", name: "Engineering" },
    manager: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Active, startAt: d(-60), endAt: d(60),
    objectives: "Improve platform response time by 40% and increase NPS by 15 points.",
    milestones: [
      { _id: "ms-1", name: "Design Handoff",   targetDate: d(-30), status: "completed" },
      { _id: "ms-2", name: "Beta Launch",      targetDate: d(15),  status: "in_progress" },
      { _id: "ms-3", name: "General Availability", targetDate: d(55), status: "pending" },
    ],
    memberCount: 6, taskCount: 14, canCreateTask: false,
    createdAt: d(-65), updatedAt: d(-1),
  },
  {
    _id: "proj-2", name: "Brand Refresh 2025",
    description: "Complete rebrand across all touch-points including website, collateral, and digital channels.",
    originCategory: { _id: "cat-2", name: "Product Design" },
    manager: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Active, startAt: d(-20), endAt: d(40),
    milestones: [], memberCount: 4, taskCount: 8, canCreateTask: false,
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

// ── Memberships ───────────────────────────────────────────────────────────────

export const SEED_MEMBERSHIPS: ProjectMember[] = [
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

// ── Requests ──────────────────────────────────────────────────────────────────

export const SEED_REQUESTS: Request[] = [
  {
    _id: "req-1",
    project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    requester: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    targetUser: { _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com", accountType: AccountType.Intern },
    requestingCategory: { _id: "cat-1", name: "Engineering" },
    targetCategory: { _id: "cat-2", name: "Product Design" },
    role: ProjectMemberRole.Member,
    justification: "Riley's UX skills are critical for the upcoming design-engineering handoff sprint. We need strong design input on the component library audit.",
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
    justification: "Alex's marketing copywriting expertise is needed to finalize brand voice guidelines and website copy review.",
    expectedContribution: "Brand voice document review, website copy for 5 key pages, campaign messaging framework.",
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
    expectedContribution: "Design and implement 3 data pipelines for the real-time analytics dashboard.",
    startAt: d(-5), endAt: d(20),
    status: RequestStatus.Rejected,
    decidedBy: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    decidedAt: d(-4),
    rejectionReason: "Morgan is currently at full capacity on the Data Lake Migration project and cannot take additional commitments.",
    createdAt: d(-8), updatedAt: d(-4),
  },
  {
    _id: "req-4",
    project: { _id: "proj-3", name: "Data Lake Migration", status: ProjectStatus.OnHold },
    requester: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    targetUser: { _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com", accountType: AccountType.Intern },
    requestingCategory: { _id: "cat-1", name: "Engineering" },
    targetCategory: { _id: "cat-2", name: "Product Design" },
    role: ProjectMemberRole.Member,
    justification: "Design support needed for data visualization components.",
    expectedContribution: "Data visualization design for 4 dashboard screens.",
    startAt: d(-80), endAt: d(-20),
    status: RequestStatus.Cancelled,
    cancelledAt: d(-75),
    createdAt: d(-85), updatedAt: d(-75),
  },
];

// ── Tasks ─────────────────────────────────────────────────────────────────────

export const SEED_TASKS: Task[] = [
  // Category Tasks (Engineering)
  {
    _id: "task-1", title: "Implement authentication middleware",
    description: "Build JWT-based auth middleware with refresh token rotation and revocation support.",
    scope: TaskScope.Category, category: { _id: "cat-1", name: "Engineering" },
    assignee: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.InProgress, priority: TaskPriority.High,
    dueAt: d(5), isOverdue: false,
    acceptanceCriteria: "All auth endpoints pass integration tests. Refresh rotation works correctly. Token revocation list persists across restarts.",
    dependsOn: [], submissionCount: 0, tags: ["auth", "backend"],
    createdAt: d(-10), updatedAt: d(-1),
  },
  {
    _id: "task-2", title: "Design system documentation",
    description: "Document all design tokens, component variants, and usage guidelines in Notion.",
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
    description: "Update the engineering code review checklist to include security, performance, and accessibility criteria.",
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
    dependsOn: [], submissionCount: 2, tags: ["leadership", "planning"],
    createdAt: d(-30), updatedAt: d(-5),
  },
  {
    _id: "task-5", title: "Dependency security audit",
    description: "Run npm audit, review all critical and high vulnerabilities, and create remediation plan.",
    scope: TaskScope.Category, category: { _id: "cat-1", name: "Engineering" },
    status: TaskStatus.Draft, priority: TaskPriority.Urgent,
    dueAt: d(10), isOverdue: false,
    dependsOn: [], submissionCount: 0, tags: ["security"],
    createdAt: d(-1), updatedAt: d(-1),
  },
  {
    _id: "task-6", title: "API rate limiter tuning",
    description: "Analyze current rate limits, gather production metrics, and propose adjusted limits for login, general, and write endpoints.",
    scope: TaskScope.Category, category: { _id: "cat-1", name: "Engineering" },
    assignee: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.Blocked, priority: TaskPriority.High,
    dueAt: d(8), isOverdue: false,
    dependsOn: [{ task: { _id: "task-1", title: "Implement authentication middleware", status: TaskStatus.InProgress, scope: TaskScope.Category }, status: TaskStatus.InProgress }],
    submissionCount: 0, tags: ["infrastructure", "security"],
    createdAt: d(-5), updatedAt: d(-2),
  },
  // Project Tasks (Apollo Platform)
  {
    _id: "task-7", title: "Component library audit",
    description: "Audit all existing UI components against the new design system tokens. Flag deprecated patterns.",
    scope: TaskScope.Project, project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    assignee: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: TaskStatus.InProgress, priority: TaskPriority.High,
    dueAt: d(3), isOverdue: false,
    dependsOn: [], submissionCount: 0, tags: ["ui", "audit"],
    createdAt: d(-8), updatedAt: d(-1),
  },
  {
    _id: "task-8", title: "Performance profiling report",
    description: "Profile the main application bundle, identify top 5 performance bottlenecks, and document with Lighthouse scores.",
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
  {
    _id: "task-9", title: "Beta user onboarding flow",
    description: "Implement the new onboarding wizard for beta users including step validation and progress persistence.",
    scope: TaskScope.Project, project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    assignee: { _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com", accountType: AccountType.Intern },
    status: TaskStatus.Assigned, priority: TaskPriority.Medium,
    dueAt: d(12), isOverdue: false,
    dependsOn: [], submissionCount: 0, tags: ["ux", "onboarding"],
    createdAt: d(-5), updatedAt: d(-5),
  },
  {
    _id: "task-10", title: "Database index optimization",
    description: "Add compound indexes for the most frequent query patterns identified in slow query logs.",
    scope: TaskScope.Project, project: { _id: "proj-1", name: "Apollo Platform", status: ProjectStatus.Active },
    status: TaskStatus.Cancelled, priority: TaskPriority.Low,
    dueAt: d(-8), isOverdue: false,
    dependsOn: [], submissionCount: 0, tags: ["database"],
    createdAt: d(-20), updatedAt: d(-8),
  },
];

// ── Notifications ─────────────────────────────────────────────────────────────

export const SEED_NOTIFICATIONS: Notification[] = [
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
  {
    _id: "notif-3", recipient: "u-employee-1",
    type: NotificationType.TaskAssigned,
    title: "New task assigned",
    body: "You have been assigned 'Component library audit' on Apollo Platform.",
    read: true, entityType: "task", entityId: "task-7",
    link: "/tasks/task-7",
    createdAt: d(-8), updatedAt: d(-8),
  },
  {
    _id: "notif-4", recipient: "u-delegate-1",
    type: NotificationType.MembershipExpiring,
    title: "Membership expiring soon",
    body: "Your membership in Apollo Platform expires in 5 days.",
    read: false, entityType: "membership", entityId: "mbr-2",
    link: "/memberships",
    createdAt: d(-1), updatedAt: d(-1),
  },
  {
    _id: "notif-5", recipient: "u-pm-1",
    type: NotificationType.RequestRejected,
    title: "Membership request rejected",
    body: "Your request for Morgan Blake to join Apollo Platform was rejected.",
    read: false, entityType: "request", entityId: "req-3",
    link: "/requests/outbox",
    createdAt: d(-4), updatedAt: d(-4),
  },
];

// ── Helper: find user by ID ───────────────────────────────────────────────────
export const findUser = (id: string) => SEED_USERS.find((u) => u._id === id);