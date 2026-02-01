import { pool } from "../../config/database";

export const registerServices = async (
  username: string,
  password: string,
  role: "user" | "admin",
) => {
  const result = await pool.query(
    `INSERT INTO users (username, password, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [username, password, role],
  );

  return result.rows[0];
};

export const loginServices = async (username: string, password: string) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};
