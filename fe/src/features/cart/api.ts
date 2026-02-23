import api from "@/lib/axios";
import {
  CartItem,
  Order,
  GetOrdersResponse,
  GetActiveOrdersWithItemsResponse,
} from "@/features/cart/types";

// ================= CREATE ORDER =================
export async function createOrder(items: CartItem[]) {
  const payload = {
    items: items.map((item) => ({
      produk_id: item.produkId,
      quantity: item.quantity,
    })),
  };
  const res = await api.post("/api/orders", payload);
  return res.data;
}

// ================= GET ORDERS =================
export async function getOrders(): Promise<Order[]> {
  const res = await api.get<GetOrdersResponse>("/api/orders");
  return res.data.data.map((o) => ({
    id: o.id,
    userId: o.user_id,
    namaUser: o.username,
    totalPrice: o.total_price,
    statusPesanan: o.status_pesanan,
    createdAt: o.created_at,
    items: [], // Tanpa items
  }));
}

export async function getActiveOrders(): Promise<Order[]> {
  const res = await api.get<GetOrdersResponse>("/api/orders/Active");
  return res.data.data.map((o) => ({
    id: o.id,
    userId: o.user_id,
    namaUser: o.username,
    totalPrice: o.total_price,
    statusPesanan: o.status_pesanan,
    createdAt: o.created_at,
    items: [],
  }));
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await api.get<GetOrdersResponse>("/api/orders/MyActive");
  return res.data.data.map((o) => ({
    id: o.id,
    userId: o.user_id,
    namaUser: o.username,
    totalPrice: o.total_price,
    statusPesanan: o.status_pesanan,
    createdAt: o.created_at,
    items: [],
  }));
}

// ================= GET ORDERS WITH ITEMS =================
export async function getAllOrderActiveItems(): Promise<Order[]> {
  const res = await api.get<GetActiveOrdersWithItemsResponse>(
    "/api/orders/ActiveItems",
  );
  return res.data.data.map((o) => ({
    id: o.id,
    userId: o.user_id,
    namaUser: o.username,
    totalPrice: o.total_price,
    statusPesanan: o.status_pesanan,
    createdAt: o.created_at,
    items: o.items.map((i) => ({
      produkId: i.produk_id,
      nama: i.nama_produk,
      harga: i.harga_barang,
      quantity: i.qty,
    })),
  }));
}

export async function getMyOrdersActiveWithItems(): Promise<Order[]> {
  const res = await api.get<GetActiveOrdersWithItemsResponse>(
    "/api/orders/MyActiveItems",
  );
  return res.data.data.map((o) => ({
    id: o.id,
    userId: o.user_id,
    namaUser: o.username,
    totalPrice: o.total_price,
    statusPesanan: o.status_pesanan,
    createdAt: o.created_at,
    items: o.items.map((i) => ({
      produkId: i.produk_id,
      nama: i.nama_produk,
      harga: i.harga_barang,
      quantity: i.qty,
    })),
  }));
}

// ================= ACTION ORDERS =================
export async function selesaiOrder(orderId: string) {
  await api.patch(`/api/orders/${orderId}/selesai`);
}

export async function cancelOrder(orderId: string) {
  await api.patch(`/api/orders/${orderId}/cancel`);
}
