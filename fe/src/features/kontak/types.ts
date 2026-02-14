export type Kontak = {
  id: number;
  nama: string;
  umur: number;
};

// features/produk/types.ts
export interface Produk {
  id: string;
  nama: string;
  harga: number;
  stock: number;
  status: boolean;
  image?: string;
}

export interface ProdukResponse {
  produk: Produk[];
}
