"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Produk } from "@/features/produk/types";
import FeatherIcon from "feather-icons-react";
import { usePathname } from "next/navigation";

import {
  deleteProduk,
  getProdukById,
  updateProduk,
} from "@/features/produk/api";
import type { UpdateProdukPayload } from "@/features/produk/types";

export default function MenuPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [produk, setProduk] = useState<Produk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navClass = (path: string) =>
    `w-10 h-10 cursor-pointer transition-all ${
      pathname === path
        ? "bg-green-500 text-white p-2 rounded-lg"
        : "text-gray-400 hover:text-green-400"
    }`;

  async function getProduk() {
    try {
      setLoading(true);
      const data = await getProdukById(id);
      setProduk(data.produk);
    } catch {
      setError("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduk();
  }, [id]);

  async function handleUpdateProduk(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!produk) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const hargaValue = formData.get("harga");
    const stockValue = formData.get("stock");
    const imageValue = formData.get("image");

    const payload: UpdateProdukPayload = {
      nama: formData.get("nama")?.toString(),
      harga: hargaValue !== null ? Number(hargaValue) : undefined,
      stock: stockValue !== null ? Number(stockValue) : undefined,
      status: formData.get("status") !== null,
    };

    if (imageValue instanceof File && imageValue.size > 0) {
      payload.image = imageValue;
    }

    if (!payload.nama || payload.harga === undefined || isNaN(payload.harga)) {
      setError("Nama dan harga wajib diisi");
      setLoading(false);
      return;
    }

    try {
      await updateProduk(produk.id, payload);
      router.push("/");
    } catch {
      setError("Gagal update produk");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      setError(null);
      await deleteProduk(id);
      router.push("/menu/daftar_menu");
    } catch (error) {
      setError("gagal menghapus produk");
    }
  }

  if (loading && !produk) return <p>Loading...</p>;
  if (!produk) return null;

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      <aside className="w-20 bg-[#0B0B0B] flex flex-col items-center py-6 gap-6 border-r border-white/5">
        <div className={navClass("/")} onClick={() => router.push("/")}>
          <FeatherIcon icon="home" className="w-6 h-6 text-white" />
        </div>

        <div className={navClass("/menu")} onClick={() => router.push("/menu")}>
          <FeatherIcon icon="grid" className="w-6 h-6 text-white" />
        </div>

        <div className={navClass("/cart")} onClick={() => router.push("/cart")}>
          <FeatherIcon icon="shopping-cart" className="w-6 h-6 text-white" />
        </div>

        <div
          className={navClass("/login")}
          onClick={() => router.push("/login")}
        >
          <FeatherIcon icon="user" className="w-6 h-6 text-white" />
        </div>

        <div
          className={navClass("/menu/add_menu")}
          onClick={() => router.push("/menu/add_menu")}
        >
          <FeatherIcon icon="plus-circle" className="w-6 h-6 text-white" />
        </div>

        <div
          className={navClass("/pesanan")}
          onClick={() => router.push("/pesanan")}
        >
          <FeatherIcon icon="list" className="w-6 h-6 text-white" />
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Edit Produk</h1>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <form onSubmit={handleUpdateProduk} className="space-y-3 max-w-md">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Gambar Produk
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="border p-2 w-full text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                name="nama"
                defaultValue={produk.nama}
                className="border p-2 w-full text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Harga</label>
              <input
                type="number"
                name="harga"
                defaultValue={produk.harga}
                className="border p-2 w-full text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                defaultValue={produk.stock}
                className="border p-2 w-full text-black"
              />
            </div>

            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                name="status"
                value="true"
                defaultChecked={produk.status}
              />
              <span>Active</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Update"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
