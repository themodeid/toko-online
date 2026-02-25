"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import { Order } from "@/features/cart/types";
import { Produk } from "@/features/produk/types";
import { getAllMyOrders } from "@/features/cart/api";
import { getAllProduk } from "@/features/produk/api";

export default function HistoryPesanan() {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProduk, setLoadingProduk] = useState(false);
  const [history, setHistory] = useState<Order[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [images, setImages] = useState<{ id: string; image: string }[]>([]);

  const navClass = (path: string) =>
    `w-10 h-10 cursor-pointer transition-all ${
      pathname === path
        ? "bg-green-500 text-white p-2 rounded-lg"
        : "text-gray-400 hover:text-green-400"
    }`;

  const statusColor: Record<string, string> = {
    ANTRI: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DIBATALKAN: "bg-red-100 text-red-700",
  };

  async function fetchHistory() {
    try {
      setLoading(true);
      const data = await getAllMyOrders();
      setHistory(data);
    } catch (error) {
      setError("Gagal mengambil riwayat pesanan");
    } finally {
      setLoading(false);
    }
  }

  async function fetchImageProduk() {
    try {
      setLoadingProduk(true);
      const res = await getAllProduk();
      setImages(res.produk.map((p) => ({ id: p.id, image: p.image })));
    } catch {
      setError("Gagal memuat gambar produk");
    } finally {
      setLoadingProduk(false);
    }
  }

  useEffect(() => {
    fetchHistory();
    fetchImageProduk();
  }, []);

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
          className={navClass("/pesanan/history_pesanan")}
          onClick={() => router.push("/pesanan/history_pesanan")}
        >
          <FeatherIcon icon="align-justify" className="w-6 h-6 text-white" />
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Riwayat Pesanan</h1>
          <p className="text-sm text-gray-400">
            Daftar seluruh pesanan yang pernah dibuat
          </p>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && history.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            Belum ada riwayat pesanan
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {history.map((order) => (
            <div
              key={order.id}
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6 hover:scale-[1.02] transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-lg">
                    Order #{order.id.slice(0, 6)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${statusColor[order.statusPesanan]}`}
                >
                  {order.statusPesanan}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3 border-t border-white/5 pt-4">
                {order.items.map((item) => {
                  const produkItem = images.find((p) => p.id === item.produkId);

                  return (
                    <div
                      key={item.produkId}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#222] relative rounded">
                          {produkItem?.image ? (
                            <Image
                              src={`http://localhost:3000${produkItem.image}`}
                              alt={item.nama}
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-medium">{item.nama}</p>
                          <p className="text-xs text-gray-400">
                            {item.quantity} x Rp{" "}
                            {item.harga.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold text-green-400">
                        Rp{" "}
                        {(item.harga * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-white/5 mt-4 pt-4 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  Total Item:{" "}
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                </p>
                <p className="font-bold text-lg text-green-400">
                  Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
