"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import { Order } from "@/features/cart/types";
import { getAllMyOrders } from "@/features/cart/api";

export default function HistoryPesanan() {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Order[]>([]);

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

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>

        {loading && <p className="text-gray-500">Memuat riwayat pesanan...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && history.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            Belum ada riwayat pesanan
          </div>
        )}

        {history.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">
                  Order ID: {order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  statusColor[order.statusPesanan]
                }`}
              >
                {order.statusPesanan}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 border-t pt-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-700">
                      {item.nama}
                    </p>
                    <p className="text-gray-400">
                      {item.quantity} x Rp{" "}
                      {item.harga.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-700">
                    Rp {(item.quantity * item.harga).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center border-t pt-3">
              <p className="text-sm text-gray-500">Total Pembayaran</p>
              <p className="font-bold text-green-600">
                Rp {Number(order.totalPrice).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
