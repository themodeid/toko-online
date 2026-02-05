import api from "@/lib/axios";
import {
  Produk,
  CreateProdukPayload,
  UpdateProdukPayload,
} from "@/features/produk/types";

/* =======================
   CREATE
======================= */
export async function createProduk(data: CreateProdukPayload): Promise<Produk> {
  try {
    const formData = new FormData();

    formData.append("image", data.image);
    formData.append("nama", data.nama);
    formData.append("harga", String(data.harga));
    formData.append("stock", String(data.stock));
    formData.append("status", String(data.status));

    const res = await api.post("/api/produk", formData);
    return res.data.data;
  } catch (error) {
    throw new Error("Gagal membuat produk");
  }
}

/* =======================
   GET ALL
======================= */
export async function getAllProduk(): Promise<Produk[]> {
  try {
    const res = await api.get("/api/produk");
    return res.data.data ?? [];
  } catch (error) {
    throw new Error("Gagal mengambil produk");
  }
}

/* =======================
   GET BY ID
======================= */
export async function getProdukById(id: string): Promise<Produk> {
  try {
    const res = await api.get(`/api/produk/${id}`);
    return res.data.data;
  } catch (error) {
    throw new Error("Gagal mengambil produk");
  }
}

/* =======================
   UPDATE
======================= */
export async function updateProduk(
  id: string,
  data: UpdateProdukPayload,
): Promise<Produk> {
  try {
    const res = await api.put(`/api/produk/${id}`, data);
    return res.data.data;
  } catch (error) {
    throw new Error("Gagal memperbarui produk");
  }
}

/* =======================
   DELETE
======================= */
export async function deleteProduk(id: string): Promise<void> {
  try {
    await api.delete(`/api/produk/${id}`);
  } catch (error) {
    throw new Error("Gagal menghapus produk");
  }
}
