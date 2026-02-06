import { Request, Response } from "express";
import {
  getAllProduk as getAllProdukService,
  getProdukById as getProdukByIdService,
  createProdukService as createProdukService,
  updateProdukService as updateProdukService,
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

  const existing = await getProdukByIdService(id);
  if (!existing) throw new AppError("Produk tidak ditemukan", 404);

  let image;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  const produk = await updateProdukService(id, {
    nama,
    harga: harga ? Number(harga) : undefined,
    stock: stock ? Number(stock) : undefined,
    status: status !== undefined ? status === "true" : undefined,
    image,
  });

  res.status(200).json({
    message: "berhasil mengupdate produk",
    produk,
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
