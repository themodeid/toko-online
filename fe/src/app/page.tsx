"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Produk } from "@/features/produk/types";
import { getAllProduk } from "@/features/produk/api";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";

export default function MenuPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [produk, setProduk] = useState<Produk[]>([]);

  async function getProduk() {
    try {
      setLoading(true);
      const data = await getAllProduk();
      setProduk(data.produk);
    } catch (err) {
      setError("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduk();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#0B0B0B] flex flex-col items-center py-6 gap-8 border-r border-white/5">
        <FeatherIcon
          icon="home"
          className="w-6 h-6 cursor-pointer text-green-400"
          onClick={() => router.push("/")}
        />
        <FeatherIcon
          icon="grid"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
        />
        <FeatherIcon
          icon="shopping-cart"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
        />
        <FeatherIcon
          icon="user"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/login")}
        />

        <FeatherIcon
          icon="plus-circle"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/menu/add_menu")}
        />
      </aside>

      {/* ================= MAIN MENU ================= */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Menu Coffee</h1>
          <p className="text-sm text-gray-400">
            Pilih menu untuk ditambahkan ke pesanan
          </p>
        </div>

        {/* State */}
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Grid */}
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
                  Rp {Number(item.harga).toLocaleString("id-ID")}
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
      </main>

      {/* ================= CART ================= */}
      <aside className="w-[360px] bg-white text-black p-6">
        <h2 className="text-lg font-semibold mb-4">Current Order</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <p className="font-medium">Cappuccino</p>
              <p className="text-sm text-gray-500">2x</p>
            </div>
            <p className="font-semibold text-green-600">$11.96</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <p className="font-medium">Coffee Latte</p>
              <p className="text-sm text-gray-500">1x</p>
            </div>
            <p className="font-semibold text-green-600">$4.98</p>
          </div>
        </div>

        <div className="border-t mt-6 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$22.74</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-$5.00</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>$19.99</span>
          </div>
        </div>

        <button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold">
          Print Bills
        </button>
      </aside>
    </div>
  );
}
