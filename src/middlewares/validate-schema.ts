import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export default function validateSchema(schema: ZodObject<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next(); // Only after schema validation is success
    } catch (error) {
      next(error); // global error handler will handle this
    }
  };
}
