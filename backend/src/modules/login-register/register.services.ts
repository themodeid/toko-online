import { pool } from "../../config/database";

export const registerServices = async (
  username: string,
  hashedPassword: string,
  role: string,
) => {
  const result = await pool.query(
    `INSERT INTO users (username, password, role)
     VALUES ($1, $2, $3)
     RETURNING id, username, role, created_at`,
    [username, hashedPassword, role],
  );

  return result.rows[0];
};

export const loginServices = async (username: string) => {
  const result = await pool.query(
    `SELECT id, username, password, role
     FROM users
     WHERE username = $1`,
    [username],
  );

  return result.rows[0];
};
