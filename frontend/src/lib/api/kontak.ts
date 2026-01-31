import { Kontak } from "@/types/kontak";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/kontak`;

export async function getKontak(): Promise<Kontak[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat data");
  const json = await res.json();
  return json.data ?? [];
}

export async function getKontakById(id: string): Promise<Kontak> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Kontak tidak ditemukan");
  const json = await res.json();
  return json.data;
}

export async function createKontak(data: {
  nama: string;
  umur: number;
}): Promise<void> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal membuat kontak");
}

export async function updateKontak(
  id: string,
  data: { nama: string; umur: number }
): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal memperbarui kontak");
}

export async function deleteKontak(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal menghapus kontak");
}
