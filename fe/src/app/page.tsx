"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Produk } from "@/features/produk/types";
import { getAllProduk } from "@/features/produk/api";
import FeatherIcon from "feather-icons-react";
import { usePathname } from "next/navigation";
import { CartItem, Order,  } from "@/features/cart/types";
import { user } from "@/features/user/type";
import {
  createOrder,
  cancelOrder,
  getMyOrdersActiveWithItems,
} from "@/features/cart/api";
import { getUser } from "@/features/user/api";
import Image from "next/image";

export default function MenuPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pesanan, setPesanan] = useState<Order[]>([]);
  const [user, setUser] = useState<user | null>(null);
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
    } catch (err) {
      setError("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPesanan() {
    try {
      setLoading(true);
      const data = await getMyOrdersActiveWithItems();
      setPesanan(data);
    } catch (error) {
      setError("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  }

  async function getProfil() {
    try {
      setLoading(true);
      const data = await getUser();
      setUser(data); // ✅ object sesuai state
    } catch (error) {
      setError("gagal mengambil data pribadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          // hanya ambil produk saja
          await getProduk();
          return;
        }

        // kalau ada token ambil semua
        await Promise.all([getProduk(), fetchPesanan(), getProfil()]);
      } catch {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const updateCart = (produk: Produk) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.produkId === produk.id);

      if (exist) {
        // jika sudah ada, kurangi 1
        const updated = prev
          .map((item) =>
            item.produkId === produk.id
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0); // remove jika quantity 0
        return updated;
      } else {
        // jika belum ada, tambah 1
        return [
          ...prev,
          {
            produkId: produk.id,
            nama: produk.nama,
            harga: produk.harga,
            quantity: 1,
            image: produk.image,
          },
        ];
      }
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart masih kosong!");
      return;
    }

    try {
      await createOrder(cart);
      setCart([]);
      fetchPesanan();
    } catch (error) {
      alert("Order gagal");
    }
  };

  const updateQuantity = (produkId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.produkId === produkId ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      alert("order berhasil dibatalkan");

      fetchPesanan();
    } catch (error) {
      setError("gagal menghapus pesanan");
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.harga * item.quantity,
    0,
  );
  const discount = 0;
  const total = subtotal - discount;

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

      {/* ================= MAIN MENU ================= */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-10">
          {/* Greeting */}
          <p className="text-sm text-gray-400">Selamat datang kembali,</p>

          <h2 className="text-lg font-medium text-green-400 mb-2">
            {user?.username}
          </h2>

          {/* Main Title */}
          <h1 className="text-3xl font-semibold tracking-tight">
            Menu dari Cafe Kami ☕
          </h1>

          <p className="text-sm text-gray-400 mt-2 max-w-md">
            Pilih menu favoritmu dan tambahkan ke pesanan dengan mudah.
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

                {item.status && item.stock > 0 && (
                  <button
                    onClick={() => updateCart(item)}
                    className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition"
                  >
                    <FeatherIcon
                      icon="shopping-cart"
                      className="w-5 h-5 text-black"
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= CART ================= */}
      <aside className="w-[360px] bg-white p-6 text-black">
        <h2 className="text-lg font-semibold mb-4">Current Order</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.produkId} className="flex items-center gap-3">
              {/* Image + Info */}
              <div className="flex items-center gap-3">
                {/** Cari produk sesuai produkId dari item pesanan */}
                <div className="w-12 h-12 bg-gray-200 relative">
                  {produk.find((p) => p.id === item.produkId)?.image ? (
                    <Image
                      src={`http://localhost:3000${produk.find((p) => p.id === item.produkId)?.image}`}
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
                  <p className="text-white">{item.nama}</p>
                  <p className="text-gray-400">
                    {item.quantity} x Rp{" "}
                    {Number(item.harga ?? 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.nama}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.produkId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <p>{item.quantity}x</p>
                  <button
                    onClick={() =>
                      updateQuantity(item.produkId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="font-semibold text-green-600">
                Rp{" "}
                {(Number(item.harga ?? 0) * item.quantity).toLocaleString(
                  "id-ID",
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>Rp {discount}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
            cart.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Checkout
        </button>

        {/* menampilkan seluruh pesanan anda */}
        <h1 className="h-12 w12  dflex align-middle">pesanan anda</h1>

        {/* Items */}
        <div className="space-y-6">
          {pesanan.map((order) => (
            <div
              key={order.id}
              className="bg-[#1A1A1A] p-5 rounded-2xl shadow-md border border-white/5"
            >
              {/* Header Order */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-medium text-white">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Tanggal</p>
                  <p className="text-white">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items?.map((item, index) => {
                  // Cari produk sesuai produk_id dari order item
                  const produkItem = produk.find(
                    (p) => p.id === item.produkId,
                  );

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm border-b border-white/5 pb-2"
                    >
                      {/* Image + Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 relative">
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
                          <p className="text-white">{item.nama}</p>
                          <p className="text-gray-400">
                            {item.quantity} x Rp{" "}
                            {Number(item.harga ?? 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      {/* Harga Total */}
                      <p className="text-green-400 font-medium">
                        Rp{" "}
                        {(item.harga * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="flex justify-between mt-4 pt-3 border-t border-white/5 font-semibold">
                <span className="text-white">Total</span>
                <span className="text-green-400">
                  Rp {Number(order.totalPrice ?? 0).toLocaleString("id-ID")}
                </span>

                {order.statusPesanan === "ANTRI" && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
