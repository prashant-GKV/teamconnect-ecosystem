import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ValidationError } from "../shared/errors";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return next(new ValidationError(result.error.flatten()));
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) return next(new ValidationError(result.error.flatten()));
    (req as unknown as Record<string, unknown>).validatedQuery = result.data;
    next();
  };
}
