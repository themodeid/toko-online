import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";
import { pool } from "../../config/database";

export const registerAkun = async (username: string, password: string) => {
  // Check if username already exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError("Username sudah digunakan", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (username, password)
     VALUES ($1, $2)
     RETURNING id, username`,
    [username, hashedPassword]
  );

  return result.rows[0];
};

export const loginAkun = async (username: string, password: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) {
    throw new AppError("Username atau password salah", 401);
  }

  const user = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Username atau password salah", 401);
  }

  return { id: user.id, username: user.username };
};