// features/cart/types.ts
export interface CartItem {
  produkId: string;
  nama: string;
  harga: number;
  quantity: number;
  image?: string;
}
