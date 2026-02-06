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
  nama: z.string().min(1).max(50).optional(),
  harga: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0).optional(),
  status: z.coerce.boolean().optional(),
  image: z.any().optional(), // multer
});

export type UpdateProdukInput = z.infer<typeof updateProdukSchema>;
