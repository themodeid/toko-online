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
      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#0B0B0B] flex flex-col items-center py-6 gap-6 border-r border-white/5">
        <div className={navClass("/")} onClick={() => router.push("/")}>
          <FeatherIcon icon="home" className="w-6 h-6 text-white" />
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

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-xl bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Edit Produk</h1>
            <p className="text-sm text-gray-400">
              Perbarui informasi produk cafe
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateProduk} className="space-y-5">
            {/* Image */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Gambar Produk
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm file:bg-green-500 file:border-0 file:px-4 file:py-2 file:rounded file:text-black hover:file:bg-green-600"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Nama Produk
              </label>
              <input
                type="text"
                name="nama"
                defaultValue={produk.nama}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Harga */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Harga</label>
              <input
                type="number"
                name="harga"
                defaultValue={produk.harga}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Stock</label>
              <input
                type="number"
                name="stock"
                defaultValue={produk.stock}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between bg-[#222] p-3 rounded-lg border border-white/10">
              <span className="text-sm text-gray-300">Status Produk</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="status"
                  value="true"
                  defaultChecked={produk.status}
                  className="accent-green-500"
                />
                <span className="text-sm">
                  {produk.status ? "Active" : "Inactive"}
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-black"
                }`}
              >
                {loading ? "Updating..." : "Update Produk"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
