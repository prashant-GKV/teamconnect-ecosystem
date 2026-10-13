export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super("NOT_FOUND", 404, id ? `${resource} '${id}' not found` : `${resource} not found`);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Insufficient permissions") {
    super("FORBIDDEN", 403, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super("UNAUTHORIZED", 401, message);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super("VALIDATION_ERROR", 422, "Validation failed", details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", 409, message);
  }
}

export class SelfApprovalError extends AppError {
  constructor() {
    super("SELF_APPROVAL_BLOCKED", 403, "You cannot approve your own task or request");
  }
}

export class ConcurrentDecisionError extends AppError {
  constructor() {
    super("CONCURRENT_DECISION", 409, "This request was already decided by another actor");
  }
}

export class MembershipInactiveError extends AppError {
  constructor() {
    super("MEMBERSHIP_INACTIVE", 403, "Your project membership is not currently active");
  }
}

export class CycleDetectedError extends AppError {
  constructor() {
    super("CYCLE_DETECTED", 422, "Adding this dependency would create a circular dependency");
  }
}
