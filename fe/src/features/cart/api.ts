import api from "@/lib/axios";
import {
  CartItem,
  OrderItem,
  Order,
  GetOrdersResponse,
} from "@/features/cart/types";

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

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await api.get<GetOrdersResponse>("/api/orders");

    return res.data.data.map((order) => ({
      id: order.id,
      user_id: order.user_id,
      total_price: Number(order.total_price),
      created_at: order.created_at,
      items: [], // sementara kosong kalau belum ada JOIN
    }));
  } catch (error) {
    throw error;
  }
}
