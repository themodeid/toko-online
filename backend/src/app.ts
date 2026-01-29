// ======================================================
// 🔥 SERVER.TS — PURE CRUD API (NO AUTH)
// Author: Adam Wahyu Kurniawan
// ======================================================

// ================= IMPORT CORE =================
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";

// ================= CONFIG =================
const PORT: number = Number(process.env.PORT) || 3000;
const MONGO_URI: string =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/belajar_mongo";

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

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

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// ======================================================
// 🧯 GLOBAL ERROR HANDLER
// ======================================================
const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof AppError)) {
    console.error(error);
    error = new AppError("Internal Server Error", 500);
  }

  const appError = error as AppError;

  res.status(appError.statusCode).json({
    status: appError.status,
    message: appError.message,
  });
};

// utils
type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const catchAsync =
  (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// ======================================================
// 🧪 ZOD SCHEMA (TAMBAHAN)
// ======================================================
const kontakCreateSchema = z.object({
  nama: z
    .string()
    .min(1, "nama wajib diisi")
    .max(100, "nama maksimal 100 karakter"),
  umur: z
    .number()
    .int("umur harus bilangan bulat")
    .min(0, "umur tidak boleh negatif")
    .max(100, "umur tidak boleh lebih dari 100")
    .optional(),
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
// 📦 MODEL
// ======================================================
interface IKontak {
  nama: string;
  umur: number;
}

const kontakSchema = new mongoose.Schema<IKontak>(
  {
    nama: { type: String, required: true },
    umur: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Kontak = mongoose.model<IKontak>("Kontak", kontakSchema);

// ======================================================
// 🎯 ROUTES
// ======================================================

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// CREATE (ZOD + SEMUA FITUR TETAP)
app.post(
  "/api/kontak",
  validateBody(kontakCreateSchema),
  catchAsync(async (req: Request, res: Response) => {
    const data = await Kontak.create(req.body);

    res.status(201).json({
      message: "kontak berhasil dibuat",
      data,
    });
  }),
);

// READ ALL
app.get(
  "/api/kontak",
  catchAsync(async (_req: Request, res: Response) => {
    const data = await Kontak.find();

    res.json({
      message: "data berhasil diambil",
      data,
    });
  }),
);

// READ ONE
app.get(
  "/api/kontak/:id",
  catchAsync(async (req: Request, res: Response) => {
    const data = await Kontak.findById(req.params.id);

    if (!isValidObjectId(req.params.id)) {
      throw new AppError("ID tidak valid", 400);
    }

    res.json({
      message: "data berhasil diambil",
      data,
    });
  }),
);

// UPDATE (ZOD)
app.put(
  "/api/kontak/:id",
  validateBody(kontakUpdateSchema),
  catchAsync(async (req, res, next) => {
    const data = await Kontak.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!isValidObjectId(req.params.id)) {
      throw new AppError("ID tidak valid", 400);
    }

    res.json({
      message: "kontak berhasil diupdate",
      data,
    });
  }),
);

// DELETE
app.delete(
  "/api/kontak/:id",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Kontak.findByIdAndDelete(req.params.id);
    if (!isValidObjectId(req.params.id)) {
      throw new AppError("ID tidak valid", 400);
    }

    res.json({
      message: "kontak berhasil dihapus",
    });
  }),
);

// ======================================================
// 🧯 NOT FOUND
// ======================================================
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route tidak ditemukan", 404));
});

app.use(globalErrorHandler);

// ======================================================
// 🚀 START SERVER
// ======================================================
const startServer = async (): Promise<void> => {
  try {
    console.log("\n=========================================");
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log("=========================================");
      console.log(`🚀 API Server is running`);
      console.log(`🌐 URL : http://localhost:${PORT}/api`);
      console.log("=========================================\n");
    });
  } catch (error) {
    console.error("=========================================");
    console.error("❌ Failed to start server");
    console.error("🧨 MongoDB Error:", (error as Error).message);
    console.error("=========================================");
    process.exit(1);
  }
};

startServer();
