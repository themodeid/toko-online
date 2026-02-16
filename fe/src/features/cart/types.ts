// features/cart/types.ts
export interface CartItem {
  produkId: string;
  nama: string;
  harga: number;
  quantity: number;
  image?: string;
}

export interface OrderItem {
  produk_id: string;
  nama: string;
  harga: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  nama_user: string;
  total_price: string;
  created_at: string;
  items?: OrderItem[];
  status_pesanan: string;
}

interface OrderFromApi {
  id: string;
  user_id: string;
  username: string; // ini sesuai API
  total_price: string;
  status_pesanan: string;
  created_at: string;
}

export interface GetOrdersResponse {
  message: string;
  data: OrderFromApi[];
}
