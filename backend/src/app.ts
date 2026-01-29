// ======================================================
// 🔥 SERVER.TS — PURE CRUD API (NO AUTH)
// Author: Adam Wahyu Kurniawan
// ======================================================

// ================= IMPORT CORE =================
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { Pool } from "pg";

// ================= CONFIG =================
const PORT: number = 3000;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:adamwahyukur@localhost:5433/kontakdb",
});

// ======================================================
// ⚙️ EXPRESS APP
// ======================================================
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://192.168.1.7:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// ======================================================
// 🧠 ERROR CLASS
// ======================================================
class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

// ======================================================
// 🧯 GLOBAL ERROR HANDLER
// ======================================================
const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error =
    err instanceof AppError ? err : new AppError("Internal Server Error", 500);

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

// ======================================================
// utils
// ======================================================
type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const catchAsync =
  (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ======================================================
// 🧪 ZOD SCHEMA
// ======================================================
const kontakCreateSchema = z.object({
  nama: z.string().min(1).max(100),
  umur: z.number().int().min(0).max(100).optional(),
});

const kontakUpdateSchema = z.object({
  nama: z.string().min(1).optional(),
  umur: z.number().int().min(0).optional(),
});

// ======================================================
// 🧩 ZOD MIDDLEWARE
// ======================================================
const validateBody =
  (schema: z.ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }
    req.body = parsed.data;
    next();
  };

// ======================================================
// 🎯 ROUTES
// ======================================================

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// CREATE
app.post(
  "/api/kontak",
  validateBody(kontakCreateSchema),
  catchAsync(async (req, res) => {
    const { nama, umur = 0 } = req.body;

    const result = await pool.query(
      `INSERT INTO kontak (nama, umur)
       VALUES ($1, $2)
       RETURNING *`,
      [nama, umur],
    );

    res.status(201).json({
      message: "kontak berhasil dibuat",
      data: result.rows[0],
    });
  }),
);

// READ ALL
app.get(
  "/api/kontak",
  catchAsync(async (_req, res) => {
    const result = await pool.query(`SELECT * FROM kontak ORDER BY id DESC`);

    res.json({
      message: "data berhasil diambil",
      data: result.rows,
    });
  }),
);

// READ ONE
app.get(
  "/api/kontak/:id",
  catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError("ID tidak valid", 400);

    const result = await pool.query(`SELECT * FROM kontak WHERE id = $1`, [id]);

    if (!result.rows[0]) {
      throw new AppError("Data tidak ditemukan", 404);
    }

    res.json({ data: result.rows[0] });
  }),
);

// UPDATE
app.put(
  "/api/kontak/:id",
  validateBody(kontakUpdateSchema),
  catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError("ID tidak valid", 400);

    const { nama, umur } = req.body;

    const result = await pool.query(
      `UPDATE kontak
       SET nama = COALESCE($1, nama),
           umur = COALESCE($2, umur),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [nama, umur, id],
    );

    if (!result.rows[0]) {
      throw new AppError("Data tidak ditemukan", 404);
    }

    res.json({
      message: "kontak berhasil diupdate",
      data: result.rows[0],
    });
  }),
);

// DELETE
app.delete(
  "/api/kontak/:id",
  catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError("ID tidak valid", 400);

    const result = await pool.query(`DELETE FROM kontak WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      throw new AppError("Data tidak ditemukan", 404);
    }

    res.json({ message: "kontak berhasil dihapus" });
  }),
);

// ======================================================
// 🧯 NOT FOUND
// ======================================================
app.use((_req, _res, next) => {
  next(new AppError("Route tidak ditemukan", 404));
});

app.use(globalErrorHandler);

// ======================================================
// 🚀 START SERVER
// ======================================================
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`🚀 API Server running on http://localhost:${PORT}/`);
  console.log("=========================================");
});
