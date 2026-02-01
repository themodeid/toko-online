import "express";

export interface JwtPayloadUser {
  id: number;
  role: "admin" | "user";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadUser;
    }
  }
}
