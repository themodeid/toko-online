"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import { OrderActiveWithItems } from "@/features/cart/types";
import { getAllProduk } from "@/features/produk/api";
import { Produk } from "@/features/produk/types";
import Image from "next/image";

import {
  getAllOrderActiveItems,
  selesaiOrder,
  cancelOrder,
} from "@/features/cart/api";

export default function Antrian() {
  const router = useRouter();
  const pathname = usePathname();

  const [orders, setOrders] = useState<OrderActiveWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [produk, setProduk] = useState<Produk[]>([]);
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

  const handleDone = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      await selesaiOrder(orderId);
      await fetchOrders();
    } catch (error) {
      setError("Gagal menyelesaikan order");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      await cancelOrder(orderId);
      await fetchOrders();
    } catch (error) {
      setError("Gagal membatalkan order");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchOrders(), getProduk()]);
      } catch {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      {/* Sidebar */}
      <aside className="w-20 bg-[#0B0B0B] flex flex-col items-center py-6 gap-6 border-r border-white/5">
        {/* ================= MENU ADMIN ================= */}
        <div className="border-b border-white w-full flex flex-col items-center gap-4 pb-4">
          {[
            { path: "/pesanan", icon: "list", label: "Pesanan" },
            {
              path: "/menu/add_menu",
              icon: "plus-circle",
              label: "Tambah Menu",
            },
          ].map((menu) => (
            <div
              key={menu.path}
              className={navClass(menu.path)}
              onClick={() => router.push(menu.path)}
              title={menu.label} // tooltip saat hover
            >
              <FeatherIcon icon={menu.icon} className="w-6 h-6 text-white" />
            </div>
          ))}
        </div>

        {/* ================= MENU UMUM ================= */}
        {[
          { path: "/", icon: "home", label: "Home" },
          { path: "/login", icon: "user", label: "Login" },
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pesanan Aktif</h1>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const isFinished =
              order.status_pesanan === "SELESAI" ||
              order.status_pesanan === "DIBATALKAN";

            return (
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
                  {order.items.map((item, index) => {
                    const produkItem = produk.find(
                      (p) => p.id === item.produk_id,
                    ); // cari image

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        {/* Image + info */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 relative">
                            {produkItem?.image ? (
                              <Image
                                src={`http://localhost:3000${produkItem.image}`}
                                alt={item.nama_produk}
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
                            <p className="font-medium text-black">
                              {item.nama_produk}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.qty} x Rp{" "}
                              {item.harga_barang.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>

                        {/* Total harga item */}
                        <p className="font-semibold text-black">
                          Rp{" "}
                          {(item.harga_barang * item.qty).toLocaleString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    );
                  })}
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

                {/* Detail Button */}
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition font-medium">
                  Detail Pesanan
                </button>

                {/* Action Buttons */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={isFinished || actionLoading === order.id}
                    className={`flex-1 py-2 rounded-xl font-medium transition ${
                      isFinished
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {actionLoading === order.id
                      ? "Processing..."
                      : "Cancel Order"}
                  </button>

                  <button
                    onClick={() => handleDone(order.id)}
                    disabled={isFinished || actionLoading === order.id}
                    className={`flex-1 py-2 rounded-xl font-medium transition ${
                      isFinished
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {actionLoading === order.id
                      ? "Processing..."
                      : "Selesai Order"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
