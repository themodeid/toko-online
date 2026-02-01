import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";
import { pool } from "../../config/database";

export const registerAkun = async (username: string, password: string, role?: string) => {
  // Check if username already exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
  );

  if (existingUser.rows.length > 0) {
    throw new AppError("Username sudah digunakan", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Gunakan role yang diberikan atau default 'user'
  const userRole = role || "user";

  try {
    const result = await pool.query(
      `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, username, role`,
      [username, hashedPassword, userRole],
    );

    return result.rows[0];
  } catch (error: any) {
    // Jika kolom role belum ada, coba insert tanpa role
    if (error.code === "42703" || error.message?.includes("role")) {
      const result = await pool.query(
        `INSERT INTO users (username, password)
         VALUES ($1, $2)
         RETURNING id, username`,
        [username, hashedPassword],
      );
      
      return { ...result.rows[0], role: userRole };
    }
    throw error;
  }
};

export const loginAkun = async (username: string, password: string) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (result.rows.length === 0) {
    throw new AppError("Username atau password salah", 401);
  }

  const user = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Username atau password salah", 401);
  }

  return { id: user.id, username: user.username, role: user.role || "user" };
};

export const updateUser = async (
  id: number,
  username?: string,
  password?: string,
  role?: string,
) => {
  let hashedPassword;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const result = await pool.query(
    `
    UPDATE users SET
      username = COALESCE($1, username),
      password = COALESCE($2, password),
      role     = COALESCE($3, role)
    WHERE id = $4
    RETURNING id, username, role
    `,
    [username, hashedPassword, role, id],
  );

  return result.rows[0];
};
