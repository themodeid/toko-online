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
    <>
      {/* TOP ICON MENU */}
      <div className="flex gap-6 mb-6 text-white">
        <FeatherIcon
          icon="home"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/")}
        />

        <FeatherIcon
          icon="user"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/login")}
        />

        <FeatherIcon
          icon="shopping-bag"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/")}
        />

        <FeatherIcon
          icon="shopping-cart"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="min-h-screen bg-[#0F0F0F] text-white p-6">
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

        {/* Grid Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produk.map((item) => (
            <div
              key={item.id}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-[#222]">
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
                <p className="text-lg font-medium">{item.nama}</p>

                <p className="text-green-400 font-semibold">
                  Rp {Number(item.harga).toLocaleString("id-ID")}
                  <span className="text-xs text-gray-400 ml-1">/ pcs</span>
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

                {/* Action */}
                <Link
                  href={`/menu/profil_produk/${item.id}`}
                  className="mt-3 block text-center bg-green-500 hover:bg-green-600 text-black font-medium py-2 rounded-xl transition"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
