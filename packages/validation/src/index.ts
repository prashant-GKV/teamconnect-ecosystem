// ─────────────────────────────────────────────────────────────────────────────
// @teamconnect/validation — Zod schemas, shared by frontend + backend
// ─────────────────────────────────────────────────────────────────────────────
import { z } from "zod";
import { BUSINESS_RULES } from "@teamconnect/shared-config";
import {
  AccountType, AdminRole, TaskScope, TaskStatus, TaskPriority,
  RequestStatus, MembershipStatus, ProjectStatus, ProjectMemberRole,
  DelegatePermission, NotificationType,
} from "@teamconnect/shared-types";

// ── Reusable field schemas ────────────────────────────────────────────────────

export const objectId     = z.string().regex(/^[a-f0-9]{24}$/, "Invalid ID");
export const isoDate      = z.string().datetime({ message: "Must be an ISO date string" });
export const paginationQ  = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order:  z.enum(["asc", "desc"]).optional(),
});

export const password = z
  .string()
  .min(BUSINESS_RULES.MIN_PASSWORD_LENGTH, `Minimum ${BUSINESS_RULES.MIN_PASSWORD_LENGTH} characters`)
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one digit")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

// ── Auth schemas ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters").max(100),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).regex(/^[a-zA-Z0-9._-]+$/, "Only letters, numbers, dots, hyphens, and underscores allowed"),
  email:    z.string().email("Invalid email address"),
  role:     z.enum(["employee", "lead", "manager", "admin"]).default("employee"),
  password: password,
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path:    ["confirm"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token:    z.string().min(1),
  password: password,
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path:    ["confirm"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     password,
  confirm:         z.string(),
}).refine((d) => d.newPassword === d.confirm, {
  message: "Passwords do not match",
  path:    ["confirm"],
});

// ── User schemas ──────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name:        z.string().min(2).max(100).optional(),
  preferences: z.object({
    theme:              z.enum(["light", "dark", "system"]).optional(),
    notificationsEmail: z.boolean().optional(),
    notificationsInApp: z.boolean().optional(),
  }).optional(),
});

export const createUserSchema = z.object({
  name:        z.string().min(2).max(100),
  email:       z.string().email(),
  password:    password,
  accountType: z.nativeEnum(AccountType),
  adminRole:   z.nativeEnum(AdminRole).optional(),
});

// ── Category schemas ──────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name:        z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const assignLeadSchema = z.object({
  userId: objectId,
});

export const grantDelegateSchema = z.object({
  userId:        objectId,
  permissions:   z.array(z.nativeEnum(DelegatePermission)).min(1),
  effectiveFrom: isoDate,
  effectiveTo:   isoDate,
}).refine((d) => new Date(d.effectiveTo) > new Date(d.effectiveFrom), {
  message: "effectiveTo must be after effectiveFrom",
  path:    ["effectiveTo"],
});

// ── Project schemas ───────────────────────────────────────────────────────────

const projectBaseSchema = z.object({
  name:             z.string().min(2).max(BUSINESS_RULES.MAX_PROJECT_NAME_LENGTH),
  description:      z.string().max(2000).optional(),
  originCategoryId: objectId,
  managerId:        objectId,
  startAt:          isoDate,
  endAt:            isoDate,
  objectives:       z.string().max(2000).optional(),
});

export const createProjectSchema = projectBaseSchema.refine((d) => new Date(d.endAt) > new Date(d.startAt), {
  message: "endAt must be after startAt",
  path:    ["endAt"],
});

export const updateProjectSchema = projectBaseSchema.partial();
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const addMilestoneSchema = z.object({
  name:       z.string().min(2).max(200),
  targetDate: isoDate,
});

// ── Request schemas ───────────────────────────────────────────────────────────

export const createRequestSchema = z.object({
  projectId:           objectId,
  targetUserId:        objectId,
  targetCategoryId:    objectId,
  role:                z.nativeEnum(ProjectMemberRole),
  justification:       z.string().min(20).max(2000),
  expectedContribution: z.string().max(2000).optional(),
  startAt:             isoDate,
  endAt:               isoDate,
  workloadPercent:     z.number().int().min(1).max(100).optional(),
}).refine((d) => new Date(d.endAt) > new Date(d.startAt), {
  message: "endAt must be after startAt",
  path:    ["endAt"],
});

export const approveRequestSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export const rejectRequestSchema = z.object({
  reason: z.string().min(10, "Rejection reason must be at least 10 characters").max(1000),
});

export const renewMembershipSchema = z.object({
  newEndAt: isoDate,
});

export const revokeMembershipSchema = z.object({
  reason: z.string().min(10, "Revocation reason must be at least 10 characters").max(1000),
});

// ── Task schemas ──────────────────────────────────────────────────────────────

export const createCategoryTaskSchema = z.object({
  title:              z.string().min(3).max(BUSINESS_RULES.MAX_TASK_TITLE_LENGTH),
  description:        z.string().max(BUSINESS_RULES.MAX_TASK_DESCRIPTION_LENGTH).optional(),
  categoryId:         objectId,
  assigneeId:         objectId.optional(),
  reviewerId:         objectId.optional(),
  priority:           z.nativeEnum(TaskPriority).default(TaskPriority.Medium),
  dueAt:              isoDate.optional(),
  acceptanceCriteria: z.string().max(2000).optional(),
  dependsOn:          z.array(objectId).max(10).optional(),
  tags:               z.array(z.string().max(50)).max(20).optional(),
});

export const createProjectTaskSchema = z.object({
  title:              z.string().min(3).max(BUSINESS_RULES.MAX_TASK_TITLE_LENGTH),
  description:        z.string().max(BUSINESS_RULES.MAX_TASK_DESCRIPTION_LENGTH).optional(),
  projectId:          objectId,
  assigneeId:         objectId.optional(),
  reviewerId:         objectId.optional(),
  priority:           z.nativeEnum(TaskPriority).default(TaskPriority.Medium),
  dueAt:              isoDate.optional(),
  acceptanceCriteria: z.string().max(2000).optional(),
  dependsOn:          z.array(objectId).max(10).optional(),
  tags:               z.array(z.string().max(50)).max(20).optional(),
});

export const updateTaskSchema = z.object({
  title:              z.string().min(3).max(BUSINESS_RULES.MAX_TASK_TITLE_LENGTH).optional(),
  description:        z.string().max(BUSINESS_RULES.MAX_TASK_DESCRIPTION_LENGTH).optional(),
  priority:           z.nativeEnum(TaskPriority).optional(),
  dueAt:              isoDate.optional(),
  acceptanceCriteria: z.string().max(2000).optional(),
  tags:               z.array(z.string().max(50)).max(20).optional(),
});

export const assignTaskSchema = z.object({
  assigneeId: objectId,
  reviewerId: objectId.optional(),
});

export const reviewTaskSchema = z.object({
  action: z.enum(["approve", "request_revision"]),
  notes:  z.string().max(2000).optional(),
});

// ── Submission schemas ────────────────────────────────────────────────────────

export const createSubmissionSchema = z.object({
  notes:     z.string().max(2000).optional(),
  fileNames: z.array(z.string().min(1).max(255)).min(1).max(BUSINESS_RULES.MAX_FILES_PER_SUBMISSION),
});

export const reviewSubmissionSchema = z.object({
  action:      z.enum(["approve", "request_revision"]),
  reviewNotes: z.string().max(2000).optional(),
});

// ── Communication schemas ─────────────────────────────────────────────────────

export const addCommentSchema = z.object({
  content:      z.string().min(1).max(5000),
  parentId:     objectId.optional(),
  mentionedIds: z.array(objectId).max(20).optional(),
});

// Type exports for use in frontend/backend
export type LoginInput             = z.infer<typeof loginSchema>;
export type SignupInput            = z.infer<typeof signupSchema>;
export type ForgotPasswordInput    = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput     = z.infer<typeof resetPasswordSchema>;
export type CreateUserInput        = z.infer<typeof createUserSchema>;
export type UpdateProfileInput     = z.infer<typeof updateProfileSchema>;
export type CreateCategoryInput    = z.infer<typeof createCategorySchema>;
export type GrantDelegateInput     = z.infer<typeof grantDelegateSchema>;
export type CreateProjectInput     = z.infer<typeof createProjectSchema>;
export type CreateRequestInput     = z.infer<typeof createRequestSchema>;
export type ApproveRequestInput    = z.infer<typeof approveRequestSchema>;
export type RejectRequestInput     = z.infer<typeof rejectRequestSchema>;
export type CreateCategoryTaskInput = z.infer<typeof createCategoryTaskSchema>;
export type CreateProjectTaskInput  = z.infer<typeof createProjectTaskSchema>;
export type UpdateTaskInput         = z.infer<typeof updateTaskSchema>;
export type CreateSubmissionInput   = z.infer<typeof createSubmissionSchema>;
export type ReviewSubmissionInput   = z.infer<typeof reviewSubmissionSchema>;
export type AddCommentInput         = z.infer<typeof addCommentSchema>;
