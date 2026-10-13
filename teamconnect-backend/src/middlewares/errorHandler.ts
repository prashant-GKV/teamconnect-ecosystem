import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors";
import { logger } from "../shared/logger";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.requestId ?? "unknown";

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, "Application error");
    }
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code:      err.code,
        message:   err.message,
        details:   err.details,
        requestId,
      },
    });
  }

  logger.error({ err, requestId }, "Unhandled error");
  return res.status(500).json({
    success: false,
    error: {
      code:      "INTERNAL_ERROR",
      message:   "An unexpected error occurred",
      requestId,
    },
  });
}
