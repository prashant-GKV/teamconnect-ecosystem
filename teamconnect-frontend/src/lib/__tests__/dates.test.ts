import { describe, it, expect } from "vitest";
import { isExpired, isExpiringSoon, daysUntil, isOverdue, formatDate } from "../dates";

const past   = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const future = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

describe("dates utilities", () => {
  it("isExpired: past date returns true", () => {
    expect(isExpired(past(1))).toBe(true);
  });
  it("isExpired: future date returns false", () => {
    expect(isExpired(future(1))).toBe(false);
  });
  it("isExpiringSoon: within 7 days", () => {
    expect(isExpiringSoon(future(5))).toBe(true);
    expect(isExpiringSoon(future(8))).toBe(false);
  });
  it("isExpiringSoon: custom window", () => {
    expect(isExpiringSoon(future(14), 15)).toBe(true);
  });
  it("daysUntil: positive for future", () => {
    expect(daysUntil(future(10))).toBeGreaterThan(8);
  });
  it("isOverdue: past due date", () => {
    expect(isOverdue(past(1))).toBe(true);
    expect(isOverdue(future(1))).toBe(false);
    expect(isOverdue(undefined)).toBe(false);
  });
  it("formatDate: returns a non-empty string", () => {
    expect(formatDate(new Date().toISOString())).toBeTruthy();
  });
});