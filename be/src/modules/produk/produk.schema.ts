import { z } from "zod";

export const produkSchema = z.object({
  nama: z.string().min(1).max(50),
  harga: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  status: z.coerce.boolean(),
  image: z.string().optional(),
});

export type CreateProdukInput = z.infer<typeof produkSchema>;

export const updateProdukSchema = z.object({
  nama: z.string().min(1, "nama wajib diisi").max(50).optional(),
  harga: z.number().min(0, "harga wajib diisi").optional(),
  stock: z.number().min(0, "stock wajib diisi").optional(),
});

export type UpdateProdukInput = z.infer<typeof updateProdukSchema>;
