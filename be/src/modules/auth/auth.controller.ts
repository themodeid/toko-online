import { Request, Response } from "express";
import { pool } from "../../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import { LoginSchema, LoginResponseSchema } from "./auth.schema";

// ===================== REGISTER =====================
export const registerAdmin = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO auth (username, password, role)
     VALUES ($1, $2, 'admin')
     RETURNING id, username, role, created_at`,
    [username, hashedPassword],
  );

  res.status(201).json({
    message: "Admin berhasil dibuat",
    user: result.rows[0],
  });
});

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO auth (username, password, role)
     VALUES ($1, $2, 'user')
     RETURNING id, username, role, created_at`,
    [username, hashedPassword],
  );

  res.status(201).json({
    message: "User berhasil mendaftar",
    user: result.rows[0],
  });
});

// ===================== LOGIN =====================
export const login = catchAsync(async (req: Request, res: Response) => {
  const parsed = LoginSchema.parse(req.body);
  const { username, password } = parsed;

  // ambil user langsung dari DB
  const result = await pool.query(
    `SELECT id, username, password, role
     FROM auth
     WHERE username = $1`,
    [username],
  );

  const user = result.rows[0];

  if (!user) throw new AppError("username atau password salah", 401);

  // cek password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("username atau password salah", 401);

  // buat JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  const responseData = {
    message: "login berhasil",
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };

  const validatedResponse = LoginResponseSchema.parse(responseData);

  res.json(validatedResponse);
});

// ===================== LOGOUT =====================
export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    void res.status(400).json({ message: "Refresh token diperlukan" });
    return;
  }

  await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [
    refreshToken,
  ]);

  void res.json({ message: "Logout berhasil" });
});
