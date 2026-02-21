import { Request, Response } from "express";
import { pool } from "../../config/database";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";

// mengambil data bermodal dengan token
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await pool.query(
    "SELECT id, username, role FROM users WHERE id = $1",
    [userId],
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError("User tidak ditemukan", 404);
  }

  res.json(user);
});
