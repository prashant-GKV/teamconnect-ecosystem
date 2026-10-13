import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../auth-crypto";

describe("auth-crypto", () => {
  it("generates different hashes for different passwords", async () => {
    const res1 = await hashPassword("Password123!");
    const res2 = await hashPassword("Password456!");

    expect(res1.hash).not.toBe(res2.hash);
    expect(res1.salt).toBeDefined();
    expect(res2.salt).toBeDefined();
  });

  it("successfully verifies correct password", async () => {
    const pw = "SuperSecret123!";
    const { hash, salt } = await hashPassword(pw);

    const isValid = await verifyPassword(pw, hash, salt);
    expect(isValid).toBe(true);
  });

  it("rejects incorrect password", async () => {
    const { hash, salt } = await hashPassword("CorrectPassword1!");

    const isValid = await verifyPassword("WrongPassword1!", hash, salt);
    expect(isValid).toBe(false);
  });

  it("uses random salt per call if none provided", async () => {
    const res1 = await hashPassword("SamePassword1!");
    const res2 = await hashPassword("SamePassword1!");

    expect(res1.salt).not.toBe(res2.salt);
    expect(res1.hash).not.toBe(res2.hash);
  });
});
