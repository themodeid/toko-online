"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";

// Types
import { Produk } from "@/features/produk/types";

// API
import { createProduk, getAllProduk } from "@/features/produk/api";

export default function AddMenuPage() {
  const pathname = usePathname();
  const router = useRouter();

  // UI / state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [produk, setProduk] = useState<Produk[]>([]);

  // useEffect, functions, handlers bisa ditambahkan di sini

  const navClass = (path: string) =>
    `w-10 h-10 cursor-pointer transition-all ${
      pathname === path
        ? "bg-green-500 text-white p-2 rounded-lg"
        : "text-gray-400 hover:text-green-400"
    }`;

  async function getProduk() {
    try {
      setLoading(true);

      const data = await getAllProduk();
      setProduk(data.produk);
    } catch (error) {
      setError("gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduk();
  }, []);

  async function handleCreate(formData: FormData) {
    setLoading(true);

    const image = formData.get("image") as File;
    const nama = formData.get("nama") as string;
    const harga = Number(formData.get("harga"));
    const stock = Number(formData.get("stock")) || 0;
    const status = formData.get("status") === "true";

    if (!image || !nama || !harga) {
      setError("Image, nama produk, dan harga wajib dicantumkan");
      setLoading(false);

      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      await createProduk({
        image,
        nama,
        harga,
        stock,
        status,
      });

      router.push("/"); // redirect setelah sukses
    } catch (err) {
      setError("Gagal membuat produk");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#0B0B0B] flex flex-col items-center py-6 gap-6 border-r border-white/5">
        <div className="w-full flex flex-col items-center gap-4 pb-6 border-b border-white/10">
          {[
            { path: "/pesanan/daftar_pesanan", icon: "list", label: "Pesanan" },

            { path: "/menu/add_menu", icon: "plus", label: "Tambah Menu" },
          ].map((menu) => (
            <div
              key={menu.path}
              className={navClass(menu.path)}
              onClick={() => router.push(menu.path)}
              title={menu.label}
            >
              <FeatherIcon icon={menu.icon} className="w-6 h-6 text-white" />
            </div>
          ))}
        </div>

        {[{ path: "/login_admin", icon: "user", label: "Login" }].map(
          (menu) => (
            <div
              key={menu.path}
              className={navClass(menu.path)}
              onClick={() => router.push(menu.path)}
              title={menu.label}
            >
              <FeatherIcon icon={menu.icon} className="w-6 h-6 text-white" />
            </div>
          ),
        )}
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 overflow-y-auto space-y-10">
        {/* ===== CREATE FORM CARD ===== */}
        <div className="max-w-xl bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 shadow-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Create Menu</h1>
            <p className="text-sm text-gray-400">
              Tambahkan produk baru ke cafe
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form action={handleCreate} className="space-y-5">
            {/* Image */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Gambar Produk
              </label>
              <input
                type="file"
                name="image"
                required
                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm file:bg-green-500 file:border-0 file:px-4 file:py-2 file:rounded file:text-black hover:file:bg-green-600"
              />
            </div>

            {/* Nama */}
            <input
              type="text"
              name="nama"
              placeholder="Nama produk"
              className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Harga */}
            <input
              type="number"
              name="harga"
              placeholder="Harga"
              className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Stock */}
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Status */}
            <div className="flex items-center justify-between bg-[#222] p-3 rounded-lg border border-white/10">
              <span className="text-sm text-gray-300">Status Produk</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="status"
                  value="true"
                  className="accent-green-500"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-black"
              }`}
            >
              {loading ? "Creating..." : "Create Menu"}
            </button>
          </form>
        </div>

        {/* ===== LIST MENU GRID ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Daftar Menu</h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produk.map((item) => (
              <div
                key={item.id}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:scale-[1.02] transition"
              >
                {/* Image */}
                <div className="relative h-40 bg-[#222]">
                  {item.image ? (
                    <Image
                      src={`http://localhost:3000${item.image}`}
                      alt={item.nama}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <p className="font-medium">{item.nama}</p>

                  <p className="text-green-400 font-semibold">
                    Rp {Number(item.harga ?? 0).toLocaleString("id-ID")}
                    <span className="text-xs text-gray-400"> / pcs</span>
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Stock: {item.stock}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        item.status
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <Link
                    href={`/menu/profil_produk/${item.id}`}
                    className="block text-center bg-green-500 hover:bg-green-600 text-black font-medium py-2 rounded-xl transition"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
