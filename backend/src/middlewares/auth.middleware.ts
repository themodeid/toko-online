import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const protect = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      username: string;
      role: string;
    };
  } catch {
    throw new AppError("Token tidak valid atau kadaluarsa", 401);
  }

  req.user = decoded;

  next();
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Anda belum login", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "Anda tidak memiliki akses untuk melakukan aksi ini",
        403,
      );
    }

    next();
  };
};
