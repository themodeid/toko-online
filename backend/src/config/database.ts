import { Pool } from "pg";
import { ENV } from "./env";

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});
