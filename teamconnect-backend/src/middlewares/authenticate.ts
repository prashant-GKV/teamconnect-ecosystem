import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "../shared/errors";
import type { UserWithRoles } from "@teamconnect/shared-types";

declare global {
  namespace Express {
    interface Request { user?: UserWithRoles; }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing or malformed Authorization header"));
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as UserWithRoles;
    req.user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError("Invalid or expired access token"));
  }
}
