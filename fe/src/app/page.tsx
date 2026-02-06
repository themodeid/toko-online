"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Produk } from "@/features/produk/types";
import { getAllProduk } from "@/features/produk/api";
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Menu Produk</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produk.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {/* Gambar Produk */}
            <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
              {item.image ? (
                <Image
                  src={`http://localhost:3000${item.image}`}
                  alt={item.nama}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p className="text-sm">Gambar tidak tersedia</p>
                </div>
              )}
            </div>

            {/* Info Produk */}
            <div className="p-3">
              <p className="font-semibold text-lg">{item.nama}</p>
              <p className="text-red-600 font-bold mt-1">
                Rp {Number(item.harga).toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-600">Stock: {item.stock}</p>
              <p className="text-xs text-gray-500 mt-1">
                Status: {item.status ? "Aktif" : "Nonaktif"}
              </p>

              <Link
                href={`/menu/profil_produk/${item.id}`}
                className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
