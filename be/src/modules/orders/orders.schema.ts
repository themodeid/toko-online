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
  id: z.string(),
  userId: z.string(),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  statusPesanan: z.enum(["ANTRI", "DIPROSES", "SELESAI", "DIBATALKAN"]),
  createdAt: z.string(),
});

export const OrderDetailSchema = OrderResponseSchema.extend({
  items: z.array(
    z.object({
      produk_id: z.string(),
      nama: z.string(),
      harga: z.number(),
      quantity: z.number(),
    }),
  ),
});

export type CheckoutDTO = z.infer<typeof CheckoutSchema>;
