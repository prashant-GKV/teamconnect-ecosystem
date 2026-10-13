import {
  AccountType, AdminRole, ProjectStatus, ProjectMemberRole,
  MembershipStatus, DelegatePermission, DelegationStatus, AuditAction
} from "@teamconnect/shared-types";
import type {
  UserWithRoles, Category, CategoryDelegate, Project, ProjectMember, AuditEntry
} from "@teamconnect/shared-types";

const now = new Date();
const d = (offsetDays: number) => new Date(now.getTime() + offsetDays * 86_400_000).toISOString();

export interface AdminSettings {
  organizationName: string;
  organizationTimezone: string;
  reminderNoticeDays: number;
  dataRetentionDays: number;
  requireReviewerRemarksOnReject: boolean;
  maxActiveDelegatesPerCategory: number;
}

export let INITIAL_USERS: UserWithRoles[] = [
  {
    _id: "u-super-admin-1", name: "Avery Singh", email: "avery.singh@acmecorp.com",
    accountType: AccountType.Employee, adminRole: AdminRole.SuperAdmin, isActive: true,
    createdAt: d(-400), updatedAt: d(-30),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-org-admin-1", name: "Drew Patel", email: "drew.patel@acmecorp.com",
    accountType: AccountType.Employee, adminRole: AdminRole.OrgAdmin, isActive: true,
    createdAt: d(-365), updatedAt: d(-7),
    preferences: { theme: "dark", notificationsEmail: true, notificationsInApp: true },
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
    _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-180), updatedAt: d(-5),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [{
      categoryId: "cat-2", categoryName: "Product Design", isPrimaryLead: true,
      isDelegate: false, delegatePermissions: [],
    }],
    projectRoles: [],
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
    _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com",
    accountType: AccountType.Employee, isActive: true, createdAt: d(-120), updatedAt: d(-1),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com",
    accountType: AccountType.Intern, isActive: true, createdAt: d(-30), updatedAt: d(-1),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
  {
    _id: "u-contractor-1", name: "Morgan Blake", email: "morgan.blake@acmecorp.com",
    accountType: AccountType.Contractor, isActive: false, createdAt: d(-60), updatedAt: d(-10),
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [], projectRoles: [],
  },
];

export let INITIAL_CATEGORIES: Category[] = [
  {
    _id: "cat-1", name: "Engineering", description: "Software architecture, platform services, and cloud infra",
    isActive: true, memberCount: 14,
    lead: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-365), updatedAt: d(-2),
  },
  {
    _id: "cat-2", name: "Product Design", description: "Design systems, UI/UX research, and product prototyping",
    isActive: true, memberCount: 7,
    lead: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-300), updatedAt: d(-5),
  },
  {
    _id: "cat-3", name: "Data Science", description: "Analytics pipelines, machine learning models, and BI insights",
    isActive: true, memberCount: 8,
    lead: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-200), updatedAt: d(-10),
  },
  {
    _id: "cat-4", name: "Marketing", description: "Brand operations, enterprise growth, and content campaigns",
    isActive: true, memberCount: 6,
    lead: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    createdAt: d(-250), updatedAt: d(-3),
  },
  {
    _id: "cat-5", name: "Legal & Compliance", description: "Regulatory filings, client contracts, and risk management",
    isActive: true, memberCount: 4, lead: undefined,
    createdAt: d(-180), updatedAt: d(-20),
  },
  {
    _id: "cat-6", name: "People Operations", description: "HR governance, talent acquisition, and workforce culture",
    isActive: false, memberCount: 3, lead: undefined,
    createdAt: d(-180), updatedAt: d(-60),
  },
];

export let INITIAL_DELEGATES: CategoryDelegate[] = [
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
    _id: "del-2", categoryId: "cat-2",
    delegate: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    grantedBy: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    permissions: [DelegatePermission.ReviewTask],
    effectiveFrom: d(-90), effectiveTo: d(-10),
    status: DelegationStatus.Expired,
    createdAt: d(-90), updatedAt: d(-10),
  },
];

export let INITIAL_PROJECTS: Project[] = [
  {
    _id: "proj-1", name: "Apollo Platform",
    description: "Enterprise redesign and real-time core platform modernization.",
    originCategory: { _id: "cat-1", name: "Engineering" },
    manager: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Active, startAt: d(-60), endAt: d(60),
    milestones: [
      { _id: "ms-1", name: "Design Handoff", targetDate: d(-30), status: "completed" },
      { _id: "ms-2", name: "Beta Launch", targetDate: d(15), status: "in_progress" },
      { _id: "ms-3", name: "General Availability", targetDate: d(55), status: "pending" },
    ],
    memberCount: 6, taskCount: 14, canCreateTask: false,
    createdAt: d(-65), updatedAt: d(-1),
  },
  {
    _id: "proj-2", name: "Brand Refresh 2025",
    description: "Comprehensive corporate brand system, design tokens, and digital presence.",
    originCategory: { _id: "cat-2", name: "Product Design" },
    manager: { _id: "u-lead-2", name: "Casey Wong", email: "casey.wong@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Active, startAt: d(-20), endAt: d(40),
    milestones: [], memberCount: 4, taskCount: 8, canCreateTask: false,
    createdAt: d(-25), updatedAt: d(-2),
  },
  {
    _id: "proj-3", name: "Data Lakehouse Modernization",
    description: "Consolidate legacy data storage into scalable Delta tables on AWS S3.",
    originCategory: { _id: "cat-3", name: "Data Science" },
    manager: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.OnHold, startAt: d(-90), endAt: d(30),
    milestones: [], memberCount: 3, taskCount: 5, canCreateTask: false,
    createdAt: d(-95), updatedAt: d(-10),
  },
  {
    _id: "proj-4", name: "Q1 Strategic Growth",
    description: "Enterprise acquisition campaign and demand generation initiatives.",
    originCategory: { _id: "cat-4", name: "Marketing" },
    manager: { _id: "u-employee-1", name: "Alex Rivera", email: "alex.rivera@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Draft, startAt: d(5), endAt: d(80),
    milestones: [], memberCount: 1, taskCount: 0, canCreateTask: false,
    createdAt: d(-3), updatedAt: d(-1),
  },
  {
    _id: "proj-5", name: "Employee Experience Portal",
    description: "Next-gen employee operations, self-service benefits, and credential management.",
    originCategory: { _id: "cat-6", name: "People Operations" },
    manager: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com", accountType: AccountType.Employee },
    status: ProjectStatus.Completed, startAt: d(-120), endAt: d(-10),
    milestones: [], memberCount: 5, taskCount: 20, canCreateTask: false,
    createdAt: d(-125), updatedAt: d(-10),
  },
];

export let INITIAL_MEMBERSHIPS: ProjectMember[] = [
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
    status: MembershipStatus.ExpiringSoon, startAt: d(-55), endAt: d(4),
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
    _id: "mbr-4", project: { _id: "proj-5", name: "Employee Experience Portal", status: ProjectStatus.Completed },
    user: { _id: "u-intern-1", name: "Riley Park", email: "riley.park@acmecorp.com", accountType: AccountType.Intern },
    role: ProjectMemberRole.Member,
    sourceCategory: { _id: "cat-6", name: "People Operations" },
    status: MembershipStatus.Expired, startAt: d(-120), endAt: d(-10),
    renewalPending: false, createdAt: d(-122), updatedAt: d(-10),
  },
  {
    _id: "mbr-5", project: { _id: "proj-3", name: "Data Lakehouse Modernization", status: ProjectStatus.OnHold },
    user: { _id: "u-contractor-1", name: "Morgan Blake", email: "morgan.blake@acmecorp.com", accountType: AccountType.Contractor },
    role: ProjectMemberRole.Member,
    sourceCategory: { _id: "cat-3", name: "Data Science" },
    status: MembershipStatus.Revoked, startAt: d(-90), endAt: d(30),
    renewalPending: false, createdAt: d(-92), updatedAt: d(-5),
  },
];

export let INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    _id: "aud-1",
    actor: { _id: "u-super-admin-1", name: "Avery Singh", email: "avery.singh@acmecorp.com", accountType: AccountType.Employee },
    action: AuditAction.Create,
    resource: "user",
    resourceId: "u-intern-1",
    reason: "New hire onboarding",
    ip: "192.168.1.10",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    createdAt: d(-30),
    updatedAt: d(-30),
  },
  {
    _id: "aud-2",
    actor: { _id: "u-lead-1", name: "Jordan Lee", email: "jordan.lee@acmecorp.com", accountType: AccountType.Employee },
    action: AuditAction.Create,
    resource: "category",
    resourceId: "cat-1",
    reason: "Delegation granted to Sam Chen",
    ip: "10.0.4.15",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    createdAt: d(-30),
    updatedAt: d(-30),
  },
  {
    _id: "aud-3",
    actor: { _id: "u-delegate-1", name: "Sam Chen", email: "sam.chen@acmecorp.com", accountType: AccountType.Employee },
    action: AuditAction.Approve,
    resource: "request",
    resourceId: "req-1",
    reason: "Staffing request approved on behalf of Jordan Lee",
    ip: "10.0.4.22",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    createdAt: d(-25),
    updatedAt: d(-25),
  },
  {
    _id: "aud-4",
    actor: { _id: "u-org-admin-1", name: "Drew Patel", email: "drew.patel@acmecorp.com", accountType: AccountType.Employee },
    action: AuditAction.Revoke,
    resource: "membership",
    resourceId: "mbr-5",
    reason: "Contractor agreement terminated",
    ip: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    createdAt: d(-5),
    updatedAt: d(-5),
  },
];

export let INITIAL_SETTINGS: AdminSettings = {
  organizationName: "Acme Corporation Enterprise",
  organizationTimezone: "UTC",
  reminderNoticeDays: 7,
  dataRetentionDays: 365,
  requireReviewerRemarksOnReject: true,
  maxActiveDelegatesPerCategory: 3,
};
