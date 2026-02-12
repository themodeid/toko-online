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
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  total_price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  status_pesanan: z.enum(["ANTRI", "DIPROSES", "SELESAI", "DIBATALKAN"]),
  created_at: z.string().datetime(),
});

export type CheckoutDTO = z.infer<typeof CheckoutSchema>;
