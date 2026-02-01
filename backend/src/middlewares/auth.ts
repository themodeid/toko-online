import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { JwtPayloadUser } from "../types/express"; // optional, hanya untuk typing

export const authGuard = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    role: string;
  };

  req.user = payload;
  next();
};
