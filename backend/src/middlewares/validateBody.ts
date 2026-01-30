import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = error.errors.map(
          (err: any) => `${err.path.join(".")}: ${err.message}`
        );
        return next(
          new AppError(`Validation error: ${errorMessages.join(", ")}`, 400)
        );
      }
      next(new AppError("Validation error", 400));
    }
  };
};
