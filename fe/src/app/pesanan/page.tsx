"use client";

import link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Order } from "@/features/cart/types";
import { getActiveOrders } from "@/features/cart/api";
import FeatherIcon from "feather-icons-react";

export default function Antrian() {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const navClass = (path: string) =>
    `w-10 h-10 cursor-pointer transition-all ${
      pathname === path
        ? "bg-green-500 text-white p-2 rounded-lg"
        : "text-gray-400 hover:text-green-400"
    }`;

  async function getOrders() {
    try {
      setLoading(true);
      const data = await getActiveOrders();
      setOrders(data);
    } catch (error) {
      setError("gagal mengambil pesanan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

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

      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Pesanan Aktif</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders &&
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-lg">{order.nama_user}</h2>

                  <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
                    {order.status_pesanan}
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Order ID:</span> {order.id}
                  </p>

                  <p>
                    <span className="font-medium">Total:</span> Rp{" "}
                    {Number(order.total_price).toLocaleString("id-ID")}
                  </p>

                  <p>
                    <span className="font-medium">Tanggal:</span>{" "}
                    {new Date(order.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>

                {/* Button */}
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                  Detail Pesanan
                </button>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
