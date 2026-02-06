/* Entity (data dari backend) */
export type Produk = {
  id: string;
  nama: string;
  harga: number;
  stock: number;
  status: boolean;
  image: string;
};

/* Payload create */
export type CreateProdukPayload = {
  nama: string;
  harga: number;
  stock: number;
  status: boolean;
  image: File;
};

/* Payload update */
export type UpdateProdukPayload = {
  nama?: string;
  harga?: number;
  stock?: number;
  status?: boolean;
  image?: File;
};
