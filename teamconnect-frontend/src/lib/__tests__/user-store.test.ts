import { describe, it, expect } from "vitest";
import { mockUserStore } from "../mocks/user-store";

describe("mockUserStore", () => {
  it("finds default users by email, id, or username", () => {
    // By exact email
    const byEmail = mockUserStore.findByIdentifier("alex.rivera@acmecorp.com");
    expect(byEmail).toBeDefined();
    expect(byEmail?.name).toBe("Alex Rivera");

    // By username prefix
    const byUsername = mockUserStore.findByIdentifier("alex.rivera");
    expect(byUsername).toBeDefined();
    expect(byUsername?._id).toBe("u-employee-1");

    // By user ID
    const byId = mockUserStore.findByIdentifier("u-lead-1");
    expect(byId).toBeDefined();
    expect(byId?.name).toBe("Jordan Lee");

    // By case-insensitive search
    const byUpper = mockUserStore.findByIdentifier("TAYLOR.KIM@ACMECORP.COM");
    expect(byUpper).toBeDefined();
    expect(byUpper?.name).toBe("Taylor Kim");
  });

  it("verifies default user passwords correctly", async () => {
    const user = mockUserStore.findByIdentifier("alex.rivera@acmecorp.com");
    expect(user).toBeDefined();

    const ok = await mockUserStore.verifyPassword(user!, "Password1!");
    expect(ok).toBe(true);

    const fail = await mockUserStore.verifyPassword(user!, "WrongPassword123!");
    expect(fail).toBe(false);
  });

  it("registers a new user and allows login with new credentials", async () => {
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const email = `testuser_${timestamp}@acmecorp.com`;
    const password = "NewUserPass1!";

    const result = await mockUserStore.register({
      name: "Test User",
      username,
      email,
      password,
      role: "manager",
    });

    expect(result.user).toBeDefined();
    expect(result.user.name).toBe("Test User");
    expect(result.user.email).toBe(email);
    expect(result.user.projectRoles.length).toBeGreaterThan(0);
    expect(result.accessToken).toBe(`tc-token-${result.user._id}`);

    // Find the newly registered user by username
    const found = mockUserStore.findByIdentifier(username);
    expect(found).toBeDefined();
    expect(found?._id).toBe(result.user._id);

    // Verify password check works
    const isPwValid = await mockUserStore.verifyPassword(found!, password);
    expect(isPwValid).toBe(true);

    const isWrongPwValid = await mockUserStore.verifyPassword(found!, "WrongPass1!");
    expect(isWrongPwValid).toBe(false);

    // Get user from token
    const userFromToken = mockUserStore.getUserFromToken(result.accessToken);
    expect(userFromToken).toBeDefined();
    expect(userFromToken?._id).toBe(result.user._id);
  });

  it("rejects registration with duplicate email or username", async () => {
    await expect(
      mockUserStore.register({
        name: "Duplicate Alex",
        username: "alex.rivera",
        email: "different.email@acmecorp.com",
        password: "Password1!",
        role: "employee",
      })
    ).rejects.toThrow(/already exists/);

    await expect(
      mockUserStore.register({
        name: "Duplicate Email",
        username: "unique.user.999",
        email: "alex.rivera@acmecorp.com",
        password: "Password1!",
        role: "employee",
      })
    ).rejects.toThrow(/already exists/);
  });
});
