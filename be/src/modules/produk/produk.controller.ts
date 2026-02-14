import { Request, Response } from "express";
import { pool } from "../../config/database";
import {
  getAllProduk as getAllProdukService,
  getProdukById as getProdukByIdService,
  createProdukService as createProdukService,
  deleteProduk as deleteProdukService,
} from "./produk.services";
import { AppError } from "../../errors/AppError";

import { catchAsync } from "../../utils/catchAsync";

export const getAllProduk = catchAsync(async (req: Request, res: Response) => {
  const produk = await getAllProdukService();
  res.status(200).json({
    message: "berhasil mengambil semua produk",
    produk,
  });
});

export const getProdukById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // ✅ STRING UUID

  // optional: validasi UUID format
  if (!id) {
    throw new AppError("ID tidak valid", 400);
  }

  const produk = await getProdukByIdService(id);

  if (!produk) {
    throw new AppError("Produk tidak ditemukan", 404);
  }

  res.status(200).json({
    message: "berhasil mengambil produk by id",
    produk,
  });
});

export const createProduk = catchAsync(async (req: Request, res: Response) => {
  const { nama, harga, stock, status } = req.body;

  if (!req.file) {
    throw new AppError("Gambar produk wajib diupload", 400);
  }

  const imagePath = `/uploads/${req.file.filename}`;

  const produk = await createProdukService({
    nama,
    harga: Number(harga),
    stock: Number(stock),
    status: status === "true",
    image: imagePath,
  });

  res.status(201).json({
    message: "Berhasil membuat produk",
    produk,
  });
});

export const updateProduk = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nama, harga, stock, status } = req.body;

  if (!id) throw new AppError("ID tidak valid", 400);

  // Cek apakah produk ada
  const existing = await pool.query("SELECT * FROM produk WHERE id = $1", [id]);

  if (existing.rowCount === 0) {
    throw new AppError("Produk tidak ditemukan", 404);
  }

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (nama !== undefined) {
    fields.push(`nama = $${idx++}`);
    values.push(nama);
  }

  if (harga !== undefined) {
    fields.push(`harga = $${idx++}`);
    values.push(Number(harga));
  }

  if (stock !== undefined) {
    fields.push(`stock = $${idx++}`);
    values.push(Number(stock));
  }

  if (typeof status === "boolean") {
    fields.push(`status = $${idx++}`);
    values.push(status);
  }

  let image;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
    fields.push(`image = $${idx++}`);
    values.push(image);
  }

  // Optional: update timestamp
  fields.push(`updated_at = NOW()`);

  if (fields.length === 0) {
    throw new AppError("Tidak ada data yang diupdate", 400);
  }

  const query = `
    UPDATE produk
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING *
  `;

  values.push(id);

  const result = await pool.query(query, values);

  res.status(200).json({
    message: "berhasil mengupdate produk",
    produk: result.rows[0],
  });
});

export const deleteProduk = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // ✅ STRING UUID

  if (!id) {
    throw new AppError("ID tidak valid", 400);
  }

  const existing = await getProdukByIdService(id);
  if (!existing) {
    throw new AppError("Produk tidak ditemukan", 404);
  }

  await deleteProdukService(id);

  res.status(200).json({
    message: "berhasil menghapus produk",
  });
});
