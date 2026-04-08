import { app } from "./app";
import { pool } from "./config/database";
import { ENV } from "./config/env";
import { runMigrations } from "./database/migrationRunner";

async function startServer(): Promise<void> {
  console.log("===================================");
  console.log("🔄 Starting server...");

  try {
    // ================= TEST DB CONNECTION
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");

    // ================= RUN MIGRATIONS
    console.log("🔄 Running database migrations...");
    await runMigrations();

    // ================= START HTTP SERVER
    app.listen(ENV.PORT, () => {
      console.log("===================================");
      console.log("🚀 Server is up and running");
      console.log(`🌐 URL : http://localhost:${ENV.PORT}/api`);
      console.log(`🕒 Time: ${new Date().toLocaleString()}`);
      console.log("===================================");
    });
  } catch (error) {
    console.error("===================================");
    console.error("❌ Server failed to start");
    console.error("📛 Reason:", error);
    console.error("===================================");

    process.exit(1);
  }
}

startServer();
