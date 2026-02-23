"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";

import {
  getAllOrderActiveItems,
  selesaiOrder,
  cancelOrder,
} from "@/features/cart/api";
import { getAllProduk } from "@/features/produk/api";
import { Produk } from "@/features/produk/types";
import { Order } from "@/features/cart/types";

export default function Antrian() {
  const router = useRouter();
  const pathname = usePathname();

  const [orders, setOrders] = useState<Order[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProduk, setLoadingProduk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  // ================= FETCH ORDERS =================
  async function fetchOrders() {
    try {
      setLoadingOrders(true);
      const ordersData = await getAllOrderActiveItems();
      setOrders(ordersData);
    } catch {
      setError("Gagal memuat orders");
    } finally {
      setLoadingOrders(false);
    }
  }

  async function fetchProduk() {
    try {
      setLoadingProduk(true);
      const res = await getAllProduk();
      setProduk(res.produk);
    } catch {
      setError("Gagal memuat produk");
    } finally {
      setLoadingProduk(false);
    }
  }

  const handleDone = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      await selesaiOrder(orderId);
      await fetchOrders();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      await cancelOrder(orderId);
      await fetchOrders();
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProduk();
  }, []);

  const isLoading = loadingOrders || loadingProduk;

  // ================= RENDER =================
  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      {/* SIDEBAR */}
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
      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Pesanan Aktif</h1>
          <p className="text-sm text-gray-400">Kelola pesanan pelanggan cafe</p>
        </div>

        {isLoading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const isFinished =
              order.statusPesanan === "SELESAI" ||
              order.statusPesanan === "DIBATALKAN";

            return (
              <div
                key={order.id}
                className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6 hover:scale-[1.02] transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="font-semibold text-lg">{order.namaUser}</h2>
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
                    const produkItem = produk.find(
                      (p) => p.id === item.produkId,
                    );
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

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={isFinished || actionLoading === order.id}
                    className={`flex-1 py-2 rounded-xl font-medium transition ${isFinished ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
                  >
                    {actionLoading === order.id ? "Processing..." : "Cancel"}
                  </button>
                  <button
                    onClick={() => handleDone(order.id)}
                    disabled={isFinished || actionLoading === order.id}
                    className={`flex-1 py-2 rounded-xl font-medium transition ${isFinished ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-black"}`}
                  >
                    {actionLoading === order.id ? "Processing..." : "Selesai"}
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
