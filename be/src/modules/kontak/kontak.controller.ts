import { Request, Response } from "express";
import {
  getAllKontak,
  getKontakById,
  createKontak,
  updateKontak,
  deleteKontak,
} from "./kontak.services";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await getAllKontak();

  res.status(200).json({
    message: "Data kontak berhasil diambil",
    data,
  });
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    throw new AppError("ID tidak valid", 400);
  }

  const data = await getKontakById(id);

  if (!data) {
    throw new AppError("Kontak tidak ditemukan", 404);
  }

  res.status(200).json({
    message: "Data kontak berhasil diambil",
    data,
  });
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const { nama, umur = 0 } = req.body;

  const data = await createKontak(nama, umur);

  res.status(201).json({
    message: "kontak berhasil dibuat",
    data,
  });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nama, umur } = req.body;

  if (isNaN(id)) {
    throw new AppError("ID tidak valid", 400);
  }

  const existingKontak = await getKontakById(id);
  if (!existingKontak) {
    throw new AppError("Kontak tidak ditemukan", 404);
  }

  const data = await updateKontak(id, nama, umur);

  res.status(200).json({
    message: "Kontak berhasil diperbarui",
    data,
  });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    throw new AppError("ID tidak valid", 400);
  }

  const existingKontak = await getKontakById(id);
  if (!existingKontak) {
    throw new AppError("Kontak tidak ditemukan", 404);
  }

  await deleteKontak(id);

  res.status(200).json({
    message: "Kontak berhasil dihapus",
  });
});
