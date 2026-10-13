import { Router } from "express";
import jwt from "jsonwebtoken";
import { dbStore, getDefaultUser } from "../../shared/data-store";
import { env } from "../../config/env";
import { ok, created } from "../../shared/response";
import { UnauthorizedError, ConflictError, ValidationError } from "../../shared/errors";
import { AccountType, AdminRole, MembershipStatus, type UserWithRoles } from "@teamconnect/shared-types";

export const authRouter = Router();

authRouter.post("/login", (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || "").trim().toLowerCase();

    if (!identifier || !password) {
      throw new ValidationError("Email or username and password are required");
    }

    const user = dbStore.users.find((u) => {
      const e = u.email.toLowerCase();
      const idMatch = u._id.toLowerCase();
      const un = u.email.split("@")[0]?.toLowerCase();
      return e === identifier || idMatch === identifier || un === identifier;
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Allow demo password or check string
    if (password !== "Password1!" && password !== "AdminPass1!" && password !== "password") {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = jwt.sign(user, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_TTL,
    });

    res.cookie("refreshToken", "mock-refresh-token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ok(res, { accessToken, user });
  } catch (err) {
    next(err);
  }
});

const handleSignUp = (req: any, res: any, next: any) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password) {
      throw new ValidationError("Name, username, email, and password are required");
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    const duplicate = dbStore.users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.email.split("@")[0]?.toLowerCase() === cleanUsername ||
        u._id.toLowerCase() === cleanUsername
    );

    if (duplicate) {
      throw new ConflictError("A user with this username or email already exists.");
    }

    const id = `u-custom-${Date.now()}`;
    const now = new Date().toISOString();

    let adminRole: AdminRole | undefined = undefined;
    let categoryRoles: UserWithRoles["categoryRoles"] = [];
    let projectRoles: UserWithRoles["projectRoles"] = [];

    if (role === "admin") {
      adminRole = AdminRole.SuperAdmin;
    } else if (role === "lead") {
      categoryRoles = [
        {
          categoryId: "cat-1",
          categoryName: "Engineering",
          isPrimaryLead: true,
          isDelegate: false,
          delegatePermissions: [],
        },
      ];
    } else if (role === "manager") {
      projectRoles = [
        {
          projectId: "proj-1",
          projectName: "Apollo Platform",
          role: "manager",
          membershipStatus: MembershipStatus.Active,
        },
      ];
    }

    const newUser: UserWithRoles = {
      _id: id,
      name: name.trim(),
      email: cleanEmail,
      accountType: AccountType.Employee,
      adminRole,
      isActive: true,
      preferences: {
        theme: "system",
        notificationsEmail: true,
        notificationsInApp: true,
      },
      categoryRoles,
      projectRoles,
      createdAt: now,
      updatedAt: now,
    };

    dbStore.users.push(newUser);

    const accessToken = jwt.sign(newUser, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_TTL,
    });

    return created(res, { accessToken, user: newUser });
  } catch (err) {
    next(err);
  }
};

authRouter.post("/signup", handleSignUp);
authRouter.post("/register", handleSignUp);

authRouter.post("/refresh", (_req, res) => {
  const user = getDefaultUser();
  const accessToken = jwt.sign(user, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL,
  });
  return ok(res, { accessToken });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken");
  return ok(res, { message: "Logged out successfully" });
});

authRouter.post("/forgot-password", (_req, res) => {
  return ok(res, { message: "If that email is registered, you will receive a reset link." });
});

authRouter.post("/reset-password", (_req, res) => {
  return ok(res, { message: "Password updated successfully." });
});

authRouter.get("/me", (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(authHeader.slice(7), env.JWT_ACCESS_SECRET) as any;
      const found = dbStore.users.find((u) => u._id === decoded._id);
      if (found) return ok(res, found);
    } catch {
      // Invalid token
    }
  }
  return next(new UnauthorizedError("Not authenticated"));
});
