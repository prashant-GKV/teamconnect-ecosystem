// Client-side permission helpers — for UX convenience ONLY.
// The backend is the real authority.

import type { UserWithRoles } from "@teamconnect/shared-types";
import { AdminRole, DelegatePermission, MembershipStatus } from "@teamconnect/shared-types";

export function isAdmin(user: UserWithRoles): boolean {
  return user.adminRole === AdminRole.SuperAdmin || user.adminRole === AdminRole.OrgAdmin;
}

export function isSuperAdmin(user: UserWithRoles): boolean {
  return user.adminRole === AdminRole.SuperAdmin;
}

export function isCategoryLead(user: UserWithRoles, categoryId: string): boolean {
  return user.categoryRoles.some((r) => r.categoryId === categoryId && r.isPrimaryLead);
}

export function isCategoryDelegate(
  user: UserWithRoles,
  categoryId: string,
  permission: DelegatePermission
): boolean {
  return user.categoryRoles.some(
    (r) => r.categoryId === categoryId && r.isDelegate && r.delegatePermissions.includes(permission)
  );
}

export function isCategoryLeadOrDelegate(
  user: UserWithRoles,
  categoryId: string,
  permission?: DelegatePermission
): boolean {
  if (isCategoryLead(user, categoryId)) return true;
  if (permission) return isCategoryDelegate(user, categoryId, permission);
  return user.categoryRoles.some((r) => r.categoryId === categoryId && r.isDelegate);
}

export function isProjectManager(user: UserWithRoles, projectId: string): boolean {
  return user.projectRoles.some((r) => r.projectId === projectId && r.role === "manager");
}

export function hasActiveProjectMembership(user: UserWithRoles, projectId: string): boolean {
  return user.projectRoles.some(
    (r) => r.projectId === projectId && r.membershipStatus === MembershipStatus.Active
  );
}

export function canReviewCategoryTask(user: UserWithRoles, categoryId: string): boolean {
  if (isAdmin(user)) return true;
  if (isCategoryLead(user, categoryId)) return true;
  return isCategoryDelegate(user, categoryId, DelegatePermission.ReviewTask);
}

export function canReviewProjectTask(user: UserWithRoles, projectId: string): boolean {
  if (isAdmin(user)) return true;
  return isProjectManager(user, projectId);
  // Project Reviewer role derived on backend
}

export function canCreateProject(user: UserWithRoles): boolean {
  // canCreateProject flag is returned in user.projectRoles metadata
  // Admin always can; Lead/PM need the flag
  return isAdmin(user);
}
