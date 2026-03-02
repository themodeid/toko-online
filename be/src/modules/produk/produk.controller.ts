import { Request, Response } from "express";
import { pool } from "../../config/database";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";

// ===== SERVICE FUNCTIONS =====
export const getAllProdukService = async () => {
  const result = await pool.query("SELECT * FROM produk ORDER BY id DESC");
  return result.rows;
};

export const getProdukByIdService = async (id: string) => {
  const result = await pool.query("SELECT * FROM produk WHERE id = $1", [id]);
  return result.rows[0];
};

export const createProdukService = async (data: {
  nama: string;
  harga: number;
  stock: number;
  status: boolean;
  image: string;
}) => {
  const result = await pool.query(
    `
    INSERT INTO produk (nama, harga, stock, status, image)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [data.nama, data.harga, data.stock, data.status, data.image],
  );
  return result.rows[0];
};

export const updateProdukService = async (
  id: string,
  data: {
    nama?: string;
    harga?: number;
    stock?: number;
    status?: boolean;
    image?: string;
  },
) => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.nama !== undefined) {
    fields.push(`nama = $${idx++}`);
    values.push(data.nama);
  }
  if (data.harga !== undefined) {
    fields.push(`harga = $${idx++}`);
    values.push(data.harga);
  }
  if (data.stock !== undefined) {
    fields.push(`stock = $${idx++}`);
    values.push(data.stock);
  }
  if (typeof data.status === "boolean") {
    fields.push(`status = $${idx++}`);
    values.push(data.status);
  }
  if (data.image) {
    fields.push(`image = $${idx++}`);
    values.push(data.image);
  }

  // Update timestamp
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
  return result.rows[0];
};

export const deleteProdukService = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM produk WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

// ===== CONTROLLER FUNCTIONS =====
export const getAllProduk = catchAsync(async (req: Request, res: Response) => {
  const produk = await getAllProdukService();
  res.status(200).json({
    message: "Berhasil mengambil semua produk",
    produk,
  });
});

export const getProdukById = catchAsync(async (req: Request, res: Response) => {
  let { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new AppError("ID tidak valid", 400);
  }

  const produk = await getProdukByIdService(id);

  if (!produk) throw new AppError("Produk tidak ditemukan", 404);

  res.status(200).json({
    message: "Berhasil mengambil produk by id",
    produk,
  });
});

export const createProduk = catchAsync(async (req: Request, res: Response) => {
  const { nama, harga, stock, status } = req.body;

  if (!req.file) throw new AppError("Gambar produk wajib diupload", 400);

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
  let { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new AppError("ID tidak valid", 400);
  }

  const { nama, harga, stock, status } = req.body;

  if (!id) throw new AppError("ID tidak valid", 400);

  const existing = await pool.query("SELECT * FROM produk WHERE id = $1", [id]);

  if (existing.rowCount === 0)
    throw new AppError("Produk tidak ditemukan", 404);

  const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

  const produk = await updateProdukService(id, {
    nama,
    harga: harga !== undefined ? Number(harga) : undefined,
    stock: stock !== undefined ? Number(stock) : undefined,
    status: status !== undefined ? status === "true" : undefined,
    image: imagePath,
  });

  res.status(200).json({
    message: "Berhasil mengupdate produk",
    produk,
  });
});

export const deleteProduk = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const produk = await deleteProdukService(Number(id));
  if (!produk) throw new AppError("Produk tidak ditemukan", 404);

  res.status(200).json({
    message: "Berhasil menghapus produk",
    produk,
  });
});
