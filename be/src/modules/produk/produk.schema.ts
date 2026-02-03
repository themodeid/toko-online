import { z } from "zod";

export const produkSchema = z.object({
  nama: z.string().min(1, "nama wajib diisi").max(50),
  harga: z.number().min(0, "harga wajib diisi"),
  stock: z.number().min(0, "stock wajib diisi"),
});

export const updateProdukSchema = z.object({
  nama: z.string().min(1, "nama wajib diisi").max(50).optional(),
  harga: z.number().min(0, "harga wajib diisi").optional(),
  stock: z.number().min(0, "stock wajib diisi").optional(),
});
