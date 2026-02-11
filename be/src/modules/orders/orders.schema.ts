import { z } from "zod";

export const CheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        produk_id: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const OrderResponseSchema = z.object({
  order_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  status_pesanan: z.enum(["ANTRI", "DIPROSES", "SELESAI", "DIBATALKAN"]),
  username: z.string(),
  total_harga: z.number().positive(),
  created_at: z.string(),
});

export type CheckoutDTO = z.infer<typeof CheckoutSchema>;
