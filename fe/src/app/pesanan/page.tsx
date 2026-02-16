"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import { OrderActiveWithItems } from "@/features/cart/types";
import { getAllOrderActiveItems } from "@/features/cart/api";

export default function Antrian() {
  const router = useRouter();
  const pathname = usePathname();

  const [orders, setOrders] = useState<OrderActiveWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await getAllOrderActiveItems();
      setOrders(data);
    } catch (err) {
      setError("Gagal mengambil pesanan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pesanan Aktif</h1>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-bold text-lg text-gray-800">
                    {order.username}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString("id-ID")}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    statusColor[order.status_pesanan]
                  }`}
                >
                  {order.status_pesanan}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3 border-t pt-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <div>
                      <p className="font-medium">{item.nama_produk}</p>
                      <p className="text-xs text-gray-400">
                        {item.qty} x Rp{" "}
                        {item.harga_barang.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <p className="font-semibold">
                      Rp{" "}
                      {(item.harga_barang * item.qty).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t mt-4 pt-3 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Total Item:{" "}
                  {order.items.reduce((acc, item) => acc + item.qty, 0)}
                </p>

                <p className="font-bold text-lg text-green-600">
                  Rp {Number(order.total_price).toLocaleString("id-ID")}
                </p>
              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition font-medium">
                Detail Pesanan
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
