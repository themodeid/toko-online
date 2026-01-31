import { Request, Response } from "express";
import {
  loginAkun,
  registerAkun
} from "./login.services";
import { catchAsync } from "../../utils/catchAsync";
import { signToken } from "../../utils/jwt";

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await loginAkun(username, password);

  const token = signToken({
    id: user.id,
    username: user.username,
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
  });

  res.status(201).json({
    message: "berhasil mendaftar",
    token,
    user,
  });
});
