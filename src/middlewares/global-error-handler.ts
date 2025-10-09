import { DrizzleError } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`Error: `, err); // for debugging/logging

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation failed",
      errors: z.treeifyError(err),
    });
  }

  // Handle Drizzle DB constraint errors (e.g., duplicate email)
  if (err instanceof DrizzleError) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "Database error (possible conflict)",
      detail: err.message,
    });
  }

  // Fallback: unhandled errors
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    detail: (err as Error).message || "Something went wrong",
  });
};
