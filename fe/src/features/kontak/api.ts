import api from "@/lib/axios";
import { Kontak } from "@/types/kontak";

// GET ALL
export async function getKontak(): Promise<Kontak[]> {
  try {
    const res = await api.get("/api/kontak");
    return res.data.data ?? [];
  } catch (error) {
    throw new Error("Gagal memuat data");
  }
}

// GET BY ID
export async function getKontakById(id: string): Promise<Kontak> {
  try {
    const res = await api.get(`/api/kontak/${id}`);
    return res.data.data;
  } catch (error) {
    throw new Error("Kontak tidak ditemukan");
  }
}

// CREATE
export async function createKontak(data: {
  nama: string;
  umur: number;
}): Promise<void> {
  try {
    await api.post("/api/kontak", data);
  } catch (error) {
    throw new Error("Gagal membuat kontak");
  }
}

// UPDATE
export async function updateKontak(
  id: string,
  data: { nama: string; umur: number },
): Promise<void> {
  try {
    await api.put(`/api/kontak/${id}`, data);
  } catch (error) {
    throw new Error("Gagal memperbarui kontak");
  }
}

// DELETE
export async function deleteKontak(id: string): Promise<void> {
  try {
    await api.delete(`/api/kontak/${id}`);
  } catch (error) {
    throw new Error("Gagal menghapus kontak");
  }
}
