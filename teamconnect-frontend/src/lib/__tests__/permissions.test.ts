import { describe, it, expect } from "vitest";
import {
  isAdmin, isSuperAdmin, isCategoryLead, isCategoryDelegate,
  hasActiveProjectMembership,
} from "../permissions";
import { AccountType, AdminRole, DelegatePermission, MembershipStatus } from "@teamconnect/shared-types";
import type { UserWithRoles } from "@teamconnect/shared-types";

const base: UserWithRoles = {
  _id: "u1", name: "Test", email: "test@test.com",
  accountType: AccountType.Employee, isActive: true,
  createdAt: "", updatedAt: "",
  preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
  categoryRoles: [], projectRoles: [],
};

describe("permissions", () => {
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
  it("isCategoryDelegate with permission", () => {
    const u: UserWithRoles = {
      ...base,
      categoryRoles: [{
        categoryId: "cat-1", categoryName: "Eng", isPrimaryLead: false,
        isDelegate: true, delegatePermissions: [DelegatePermission.ReviewTask],
      }],
    };
    expect(isCategoryDelegate(u, "cat-1", DelegatePermission.ReviewTask)).toBe(true);
    expect(isCategoryDelegate(u, "cat-1", DelegatePermission.ApproveRequest)).toBe(false);
  });
  it("hasActiveProjectMembership", () => {
    const u: UserWithRoles = {
      ...base,
      projectRoles: [{ projectId: "proj-1", projectName: "P1", role: "member", membershipStatus: MembershipStatus.Active }],
    };
    expect(hasActiveProjectMembership(u, "proj-1")).toBe(true);
    expect(hasActiveProjectMembership(u, "proj-2")).toBe(false);
  });
});