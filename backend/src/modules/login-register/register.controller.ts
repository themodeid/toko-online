import { Request, Response } from "express";
import { registerServices, loginServices } from "./register.services";

import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  const user = await registerServices(username, password, role);

  res.status(201).json({
    message: "berhasil mendaftar",
    user,
  });
});
