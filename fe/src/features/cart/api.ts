import api from "@/lib/axios";
import {
  CartItem,
  Order,
  GetOrdersResponse,
  GetActiveOrdersWithItemsResponse,
  OrderActiveWithItems,
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
      nama_user: order.username,
      total_price: order.total_price,
      status_pesanan: order.status_pesanan,
      created_at: order.created_at,
      items: [],
    }));
  } catch (error) {
    throw error;
  }
}

export async function getActiveOrders(): Promise<Order[]> {
  try {
    const res = await api.get<GetOrdersResponse>("/api/orders/Active");
    return res.data.data.map((order) => ({
      id: order.id,
      user_id: order.user_id,
      nama_user: order.username, // mapping ke nama_user
      status_pesanan: order.status_pesanan,
      total_price: order.total_price,
      created_at: order.created_at,
      items: [],
    }));
  } catch (error) {
    throw error;
  }
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await api.get<GetOrdersResponse>("/api/orders/MyActive");

  return res.data.data.map((order) => ({
    id: order.id,
    user_id: order.user_id,
    nama_user: order.username, // mapping username dari API ke nama_user
    status_pesanan: order.status_pesanan, // wajib karena Order interface memerlukannya
    total_price: order.total_price,
    created_at: order.created_at,
    items: [], // sementara kosong, bisa diisi nanti jika ingin detail items
  }));
}

export async function selesaiOrder(orderId: string) {
  try {
    const res = await api.patch(`/api/orders/${orderId}/selesai`);
  } catch (error) {
    console.error("Gagal cancel order:", error);
    throw error;
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const res = await api.patch(`/api/orders/${orderId}/cancel`);
    return res.data;
  } catch (error) {
    console.error("Gagal cancel order:", error);
    throw error;
  }
}

export async function getAllOrderActiveItems(): Promise<
  OrderActiveWithItems[]
> {
  const res = await api.get<GetActiveOrdersWithItemsResponse>(
    "/api/orders/ActiveItems",
  );

  return res.data.data;
}

export async function getMyOrdersActiveWithItems(): Promise<
  OrderActiveWithItems[]
> {
  try {
    const res = await api.get<GetActiveOrdersWithItemsResponse>(
      "/api/orders/MyActiveItems",
    );

    return res.data.data;
  } catch (error) {
    console.error("Gagal mengambil pesanan aktif milik user:", error);
    throw error;
  }
}
