import { z } from "zod";

export const kontakCreateSchema = z.object({
  nama: z.string().min(1).max(100),
  umur: z.number().int().min(0).max(100).optional(),
});

export const kontakUpdateSchema = z.object({
  nama: z.string().min(1).max(100),
  umur: z.number().int().min(0).max(100),
});
