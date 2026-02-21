"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduk, getAllProduk } from "@/features/produk/api";
import FeatherIcon from "feather-icons-react";
import { usePathname } from "next/navigation";
import { Produk } from "@/features/produk/types";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Image from "next/image";

export default function AddMenuPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [produk, setProduk] = useState<Produk[]>([]);

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
    <>
      <div className="min-h-screen flex bg-[#0F0F0F] text-white">
        <aside className="w-20 bg-[#0B0B0B] flex flex-col items-center py-6 gap-6 border-r border-white/5">
          {/* router admin */}
          <div className="border-b border-white">
            {" "}
            <div
              className={navClass("/pesanan")}
              onClick={() => router.push("/pesanan")}
            >
              <FeatherIcon icon="list" className="w-6 h-6 text-white" />
            </div>
            <div
              className={navClass("/menu/add_menu")}
              onClick={() => router.push("/menu/add_menu")}
            >
              <FeatherIcon icon="plus-circle" className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className={navClass("/")} onClick={() => router.push("/")}>
            <FeatherIcon icon="home" className="w-6 h-6 text-white" />
          </div>

          <div
            className={navClass("/login")}
            onClick={() => router.push("/login")}
          >
            <FeatherIcon icon="user" className="w-6 h-6 text-white" />
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-xl font-bold mb-4">Create Menu</h1>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <form action={handleCreate} className="space-y-3">
            <input type="file" name="image" required />

            <input
              type="text"
              name="nama"
              placeholder="Nama produk"
              className="border p-2 w-full text-black"
              required
            />

            <input
              type="number"
              name="harga"
              placeholder="Harga"
              className="border p-2 w-full text-black"
              required
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              className="border p-2 w-full text-black"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="status"
                value="true"
                className="w-4 h-4"
              />
              Active
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2"
            >
              {loading ? "Loading..." : "Create"}
            </button>
          </form>

          {/* daftar menu */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produk.map((item) => (
              <div
                key={item.id}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden hover:scale-[1.02] transition"
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
                    className="block text-center bg-green-500 hover:bg-green-600 text-black font-medium py-2 rounded d-x1 transition  "
                  >
                    detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
