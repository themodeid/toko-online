import api from "@/lib/axios";
import { CartItem } from "@/features/cart/types";

export async function createOrder(items: CartItem[]) {
  try {
    const payload = {
      items: items.map((item) => ({
        produk_id: item.produkId,
        quantity: item.quantity,
      })),
    };

    const res = await api.post("/api/orders", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}
