import { Request, Response } from "express";
import { registerServices, loginServices } from "./register.services";
import bcrypt from "bcrypt";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import jwt from "jsonwebtoken";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await registerServices(username, hashedPassword, role);

  res.status(201).json({
    message: "berhasil mendaftar",
    user,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await loginServices(username);
  if (!user) {
    throw new AppError("username atau password salah", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("username atau password salah", 401);
  }

  // 🔑 Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    },
  );

  res.json({
    message: "login berhasil",
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});
