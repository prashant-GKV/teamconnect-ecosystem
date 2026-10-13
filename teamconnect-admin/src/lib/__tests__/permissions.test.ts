import { describe, it, expect } from "vitest";
import {
  isAdmin, isSuperAdmin, isCategoryLead, isCategoryDelegate,
  isCategoryLeadOrDelegate, isProjectManager,
  canReviewCategoryTask, canReviewProjectTask,
  hasActiveProjectMembership,
} from "../permissions";
import { AccountType, AdminRole, DelegatePermission, MembershipStatus } from "@teamconnect/shared-types";
import type { UserWithRoles } from "@teamconnect/shared-types";

const base: UserWithRoles = {
  _id: "u1", name: "Test Admin", email: "admin@test.com",
  accountType: AccountType.Employee, isActive: true,
  createdAt: "", updatedAt: "",
  preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
  categoryRoles: [], projectRoles: [],
};

describe("admin permissions", () => {
  it("isAdmin: OrgAdmin returns true", () => {
    expect(isAdmin({ ...base, adminRole: AdminRole.OrgAdmin })).toBe(true);
  });
  it("isAdmin: no adminRole returns false", () => {
    expect(isAdmin(base)).toBe(false);
  });
  it("isSuperAdmin: only SuperAdmin", () => {
    expect(isSuperAdmin({ ...base, adminRole: AdminRole.SuperAdmin })).toBe(true);
    expect(isSuperAdmin({ ...base, adminRole: AdminRole.OrgAdmin })).toBe(false);
  });
  it("isCategoryLead: correct category", () => {
    const u: UserWithRoles = {
      ...base,
      categoryRoles: [{ categoryId: "cat-1", categoryName: "Eng", isPrimaryLead: true, isDelegate: false, delegatePermissions: [] }],
    };
    expect(isCategoryLead(u, "cat-1")).toBe(true);
    expect(isCategoryLead(u, "cat-2")).toBe(false);
  });
  it("hasActiveProjectMembership checks status", () => {
    const u: UserWithRoles = {
      ...base,
      projectRoles: [{ projectId: "proj-1", projectName: "P1", role: "member", membershipStatus: MembershipStatus.Active }],
    };
    expect(hasActiveProjectMembership(u, "proj-1")).toBe(true);
    expect(hasActiveProjectMembership(u, "proj-2")).toBe(false);
  });
  it("canReviewCategoryTask handles admin and leads", () => {
    const adminUser = { ...base, adminRole: AdminRole.OrgAdmin };
    expect(canReviewCategoryTask(adminUser, "cat-1")).toBe(true);
    expect(canReviewCategoryTask(base, "cat-1")).toBe(false);
  });
});
