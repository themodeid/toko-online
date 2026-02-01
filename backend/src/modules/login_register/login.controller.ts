import { Request, Response } from "express";
import {
  loginAkun,
  registerAkun,
  updateUser as updateUserServices,
} from "./login.services";
import { catchAsync } from "../../utils/catchAsync";
import { signToken } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await loginAkun(username, password);

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  res.status(200).json({
    message: "berhasil terhubung",
    token,
    user,
  });
});

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await registerAkun(username, password);

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  res.status(201).json({
    message: "berhasil mendaftar",
    token,
    user,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    throw new AppError("ID tidak valid", 400);
  }

  const { username, password, role } = req.body;

  const user = await updateUserServices(id, username, password, role);

  res.status(200).json({
    message: "berhasil mengupdate user",
    user,
  });
});
