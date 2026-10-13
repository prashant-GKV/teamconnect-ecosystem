import { describe, it, expect } from "vitest";
import {
  TaskStatus,
  RequestStatus,
  MembershipStatus,
  ProjectStatus,
  AccountType,
  AdminRole,
  DelegatePermission,
} from "@teamconnect/shared-types";

// Invariant helper: compute membership status from lifecycle dates and revocation
export function computeMembershipStatus(
  now: Date,
  startAt: Date,
  endAt: Date,
  isRevoked: boolean,
  expiringThresholdDays: number = 7
): MembershipStatus {
  if (isRevoked) return MembershipStatus.Revoked;
  const nowMs = now.getTime();
  const startMs = startAt.getTime();
  const endMs = endAt.getTime();

  if (nowMs < startMs) return MembershipStatus.ApprovedNotYetActive;
  if (nowMs >= endMs) return MembershipStatus.Expired;

  const daysRemaining = (endMs - nowMs) / (1000 * 60 * 60 * 24);
  if (daysRemaining <= expiringThresholdDays) return MembershipStatus.ExpiringSoon;
  return MembershipStatus.Active;
}

// Invariant helper: check task scope separation
export function validateTaskScope(scope: "category" | "project", categoryId?: string, projectId?: string): boolean {
  if (scope === "category") {
    return Boolean(categoryId && !projectId);
  }
  if (scope === "project") {
    return Boolean(projectId && !categoryId);
  }
  return false;
}

// Invariant helper: self-approval prevention
export function canApproveTask(reviewerId: string, assigneeId: string): boolean {
  return reviewerId !== assigneeId;
}

describe("Membership Lifecycle State Machine", () => {
  const baseNow = new Date("2026-06-15T12:00:00Z");

  it("returns ApprovedNotYetActive when startAt is in the future", () => {
    const startAt = new Date("2026-06-20T00:00:00Z");
    const endAt = new Date("2026-07-20T00:00:00Z");
    expect(computeMembershipStatus(baseNow, startAt, endAt, false)).toBe(MembershipStatus.ApprovedNotYetActive);
  });

  it("returns Active when now is within interval and > 7 days remaining", () => {
    const startAt = new Date("2026-06-01T00:00:00Z");
    const endAt = new Date("2026-06-30T00:00:00Z");
    expect(computeMembershipStatus(baseNow, startAt, endAt, false)).toBe(MembershipStatus.Active);
  });

  it("returns ExpiringSoon when within 7 days of endAt", () => {
    const startAt = new Date("2026-06-01T00:00:00Z");
    const endAt = new Date("2026-06-18T00:00:00Z"); // 2.5 days left
    expect(computeMembershipStatus(baseNow, startAt, endAt, false)).toBe(MembershipStatus.ExpiringSoon);
  });

  it("returns Expired when now >= endAt", () => {
    const startAt = new Date("2026-05-01T00:00:00Z");
    const endAt = new Date("2026-06-10T00:00:00Z");
    expect(computeMembershipStatus(baseNow, startAt, endAt, false)).toBe(MembershipStatus.Expired);
  });

  it("returns Revoked when isRevoked is true regardless of dates", () => {
    const startAt = new Date("2026-06-01T00:00:00Z");
    const endAt = new Date("2026-07-01T00:00:00Z");
    expect(computeMembershipStatus(baseNow, startAt, endAt, true)).toBe(MembershipStatus.Revoked);
  });
});

describe("Task Scope & Review Invariants", () => {
  it("enforces Category Task has categoryId and no projectId", () => {
    expect(validateTaskScope("category", "cat-123", undefined)).toBe(true);
    expect(validateTaskScope("category", "cat-123", "proj-456")).toBe(false);
    expect(validateTaskScope("category", undefined, undefined)).toBe(false);
  });

  it("enforces Project Task has projectId and no categoryId", () => {
    expect(validateTaskScope("project", undefined, "proj-456")).toBe(true);
    expect(validateTaskScope("project", "cat-123", "proj-456")).toBe(false);
    expect(validateTaskScope("project", undefined, undefined)).toBe(false);
  });

  it("strictly prevents self-approval", () => {
    expect(canApproveTask("user-1", "user-2")).toBe(true);
    expect(canApproveTask("user-1", "user-1")).toBe(false);
  });
});
