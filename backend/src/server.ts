import { app } from "./app";
import { pool } from "./config/database";
import { ENV } from "./config/env";

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${ENV.PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
