import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const roleGuard =
  (...allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden: akses ditolak", 403);
    }

    next();
  };
