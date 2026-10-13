import {
  AccountType,
  AdminRole,
  MembershipStatus,
  type UserWithRoles,
} from "@teamconnect/shared-types";
import { SEED_USERS } from "./seed-data";
import { hashPassword, verifyPassword } from "../auth-crypto";

interface UserCredential {
  userId: string;
  hash: string;
  salt: string;
}

const STORAGE_USERS_KEY = "tc_custom_users_v1";
const STORAGE_CREDS_KEY = "tc_custom_creds_v1";

class MockUserStore {
  private users: UserWithRoles[] = [];
  private credentials: Map<string, UserCredential> = new Map();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    this.users = [...SEED_USERS];

    if (typeof window !== "undefined") {
      try {
        const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers) as UserWithRoles[];
          for (const u of parsed) {
            if (!this.users.some((existing) => existing._id === u._id)) {
              this.users.push(u);
            }
          }
        }

        const storedCreds = localStorage.getItem(STORAGE_CREDS_KEY);
        if (storedCreds) {
          const parsed = JSON.parse(storedCreds) as UserCredential[];
          for (const c of parsed) {
            this.credentials.set(c.userId, c);
          }
        }
      } catch (err) {
        console.warn("[MockUserStore] Error loading from localStorage:", err);
      }
    }
    this.initialized = true;
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      const customUsers = this.users.filter((u) => u._id.startsWith("u-custom-"));
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(customUsers));

      const credsArray = Array.from(this.credentials.values());
      localStorage.setItem(STORAGE_CREDS_KEY, JSON.stringify(credsArray));
    } catch (err) {
      console.warn("[MockUserStore] Error persisting to localStorage:", err);
    }
  }

  public getAll(): UserWithRoles[] {
    this.init();
    return this.users;
  }

  public findById(id: string): UserWithRoles | undefined {
    this.init();
    return this.users.find((u) => u._id === id);
  }

  public findByIdentifier(identifier: string): UserWithRoles | undefined {
    this.init();
    const clean = identifier.trim().toLowerCase();
    return this.users.find((u) => {
      const emailMatch = u.email.toLowerCase() === clean;
      const idMatch = u._id.toLowerCase() === clean;
      const usernameMatch = u.email.split("@")[0]?.toLowerCase() === clean;
      const nameMatch = u.name.toLowerCase() === clean;
      return emailMatch || idMatch || usernameMatch || nameMatch;
    });
  }

  public async verifyPassword(
    user: UserWithRoles,
    passwordAttempt: string
  ): Promise<boolean> {
    this.init();
    const cred = this.credentials.get(user._id);
    if (cred) {
      return verifyPassword(passwordAttempt, cred.hash, cred.salt);
    }
    // Default seed user fallback passwords
    return (
      passwordAttempt === "Password1!" ||
      passwordAttempt === "AdminPass1!" ||
      passwordAttempt === "password"
    );
  }

  public async register(input: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: "employee" | "lead" | "manager" | "admin";
  }): Promise<{ user: UserWithRoles; accessToken: string }> {
    this.init();

    const cleanUsername = input.username.trim().toLowerCase();
    const cleanEmail = input.email.trim().toLowerCase();

    // Check duplicate username or email
    const duplicate = this.users.find((u) => {
      const e = u.email.toLowerCase();
      const un = u.email.split("@")[0]?.toLowerCase();
      return e === cleanEmail || un === cleanUsername || u._id.toLowerCase() === cleanUsername;
    });

    if (duplicate) {
      throw new Error("A user with this username or email already exists.");
    }

    const { hash, salt } = await hashPassword(input.password);
    const id = `u-custom-${Date.now()}`;
    const now = new Date().toISOString();

    let adminRole: AdminRole | undefined = undefined;
    let categoryRoles: UserWithRoles["categoryRoles"] = [];
    let projectRoles: UserWithRoles["projectRoles"] = [];

    if (input.role === "admin") {
      adminRole = AdminRole.SuperAdmin;
    } else if (input.role === "lead") {
      categoryRoles = [
        {
          categoryId: "cat-1",
          categoryName: "Engineering",
          isPrimaryLead: true,
          isDelegate: false,
          delegatePermissions: [],
        },
      ];
    } else if (input.role === "manager") {
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
      name: input.name.trim(),
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

    this.users.push(newUser);
    this.credentials.set(id, { userId: id, hash, salt });
    this.persist();

    const accessToken = `tc-token-${newUser._id}`;
    return { user: newUser, accessToken };
  }

  public createToken(user: UserWithRoles): string {
    return `tc-token-${user._id}`;
  }

  public getUserFromToken(token: string | null | undefined): UserWithRoles | null {
    this.init();
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
    if (cleanToken.startsWith("tc-token-")) {
      const userId = cleanToken.replace("tc-token-", "");
      const found = this.findById(userId);
      if (found && found.isActive) return found;
    }
    // Backward compatibility with generic mock token
    if (cleanToken === "mock-access-token" || cleanToken === "mock-access-token-refreshed") {
      return this.users[0] ?? null;
    }
    return null;
  }
}

export const mockUserStore = new MockUserStore();
