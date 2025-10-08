import { NextFunction, Request, Response } from "express";
import * as z from "zod";

export default function validateSchema(schema: z.ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // Validate the request body
      next(); // Proceed if validation succeeds
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Use z.treeifyError to format the error
        const formattedErrors = z.treeifyError(error);

        return res.status(400).json({
          message: "Validation failed",
          errors: formattedErrors, // Send the formatted errors
        });
      }

      // If it's not a ZodError, let Express handle it
      next(error);
    }
  };
}
