"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";

// Types
import { Produk } from "@/features/produk/types";
import { CartItem, Order } from "@/features/cart/types";
import { user } from "@/features/user/type";

// API
import { getAllProduk } from "@/features/produk/api";
import {
  createOrder,
  cancelOrder,
  getMyOrdersActiveWithItems,
} from "@/features/cart/api";
import { getUser } from "@/features/user/api";

export default function MenuPage() {
  const router = useRouter();
  const pathname = usePathname();

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [user, setUser] = useState<user | null>(null);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pesanan, setPesanan] = useState<Order[]>([]);

  const navClass = (path: string) =>
    `flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer transition-all duration-300 ${
      pathname === path
        ? "bg-green-500 text-zinc-950 shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110"
        : "text-zinc-400 hover:text-green-400 hover:bg-white/5 hover:scale-105"
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
      setUser(data);
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
          await getProduk();
          return;
        }

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
        const updated = prev
          .map((item) =>
            item.produkId === produk.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        return updated;
      } else {
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
      setError("gagal membatalkan pesanan");
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.harga * item.quantity,
    0,
  );
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-50 font-poppins selection:bg-green-500/30">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-24 bg-white/[0.02] backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-8 gap-8 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10 sticky top-0 h-screen">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push("/")}>
          <FeatherIcon icon="coffee" className="w-6 h-6 text-zinc-950" />
        </div>

        <div className="flex flex-col gap-6 w-full items-center">
          <div className={navClass("/")} onClick={() => router.push("/")} title="Menu">
            <FeatherIcon icon="home" className="w-5 h-5" />
          </div>

          <div
            className={navClass("/pesanan/history_pesanan")}
            onClick={() => router.push("/pesanan/history_pesanan")}
            title="Riwayat Pesanan"
          >
            <FeatherIcon icon="file-text" className="w-5 h-5" />
          </div>
          
          <div
            className={navClass("/login")}
            onClick={() => router.push("/login")}
            title="Profil / Login"
          >
            <FeatherIcon icon="user" className="w-5 h-5" />
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full custom-scrollbar">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
            <span className="text-xs font-medium text-green-400 tracking-wider uppercase">Menu Kafe</span>
          </div>
          {user?.username && (
            <p className="text-zinc-400 text-lg mb-2">
              Selamat datang kembali, <span className="text-green-400 font-medium">{user.username}</span> 👋
            </p>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Pilih Menu Favoritmu
          </h1>
          <p className="text-sm text-zinc-500 mt-3 max-w-md">
            Pilih ragam kopi dan camilan terbaik kami, lalu tambahkan pesanan dengan mudah.
          </p>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="flex items-center gap-3 text-zinc-400 mb-8">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Memuat data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-8 flex items-center gap-3">
            <FeatherIcon icon="alert-circle" className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 pb-24">
          {produk.map((item) => (
            <div
              key={item.id}
              className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] hover:border-green-500/30 transition-all duration-500 group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 bg-zinc-900/50 m-2 rounded-2xl overflow-hidden">
                {item.image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                    alt={item.nama}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-600">
                    <FeatherIcon icon="image" className="w-8 h-8 opacity-50" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10 shadow-lg">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                      item.status
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }`}
                  >
                    {item.status ? "Tersedia" : "Habis"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-green-400 transition-colors duration-300 mb-1 leading-tight">
                    {item.nama}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                    <FeatherIcon icon="box" className="w-3 h-3" />
                    <span>Sisa stok: {item.stock}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto pt-2 border-t border-white/5">
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Harga</p>
                    <p className="text-xl font-bold text-zinc-100">
                      <span className="text-green-500 text-sm align-top mr-0.5">Rp</span>
                      {Number(item.harga ?? 0).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {item.status && item.stock > 0 && (
                    <button
                      onClick={() => updateCart(item)}
                      className="w-12 h-12 bg-white/5 hover:bg-green-500 border border-white/10 hover:border-green-400 rounded-xl flex items-center justify-center transition-all duration-300 group/btn shadow-lg"
                      title="Tambah ke Keranjang"
                    >
                      <FeatherIcon
                        icon="plus"
                        className="w-5 h-5 text-zinc-300 group-hover/btn:text-zinc-950 transition-colors"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= RIGHT PANEL (CART & ORDERS) ================= */}
      <aside className="w-[400px] flex-shrink-0 bg-white/[0.02] backdrop-blur-2xl border-l border-white/5 flex flex-col h-screen sticky top-0 shadow-[-4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* Current Order Section */}
          <div className="mb-10 flex-1">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-zinc-100">
              <FeatherIcon icon="shopping-bag" className="w-5 h-5 text-green-400" />
              Keranjang <span className="text-sm font-medium text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{cart.length}</span>
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white/[0.02] border border-white/5 rounded-3xl border-dashed flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FeatherIcon icon="shopping-cart" className="w-6 h-6 text-zinc-500" />
                </div>
                <p className="text-zinc-300 font-medium text-sm mb-1">Keranjang masih kosong</p>
                <p className="text-zinc-500 text-xs">Pilih menu favoritmu di sebelah kiri</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.produkId} className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 transition-all duration-300 hover:border-white/10">
                    <div className="w-16 h-16 bg-zinc-900 rounded-xl relative overflow-hidden flex-shrink-0 border border-white/5">
                      {produk.find((p) => p.id === item.produkId)?.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${produk.find((p) => p.id === item.produkId)?.image}`}
                          alt={item.nama}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600">
                          <FeatherIcon icon="image" className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-zinc-100 truncate mb-1 pr-2">{item.nama}</p>
                      <p className="text-green-400 font-bold text-sm mb-2">
                        Rp {(Number(item.harga ?? 0) * item.quantity).toLocaleString("id-ID")}
                      </p>
                      
                      <div className="flex items-center gap-3 bg-zinc-950/80 w-fit rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.produkId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white/10 hover:text-red-400 rounded-md transition-colors text-zinc-400"
                        >
                          <FeatherIcon icon="minus" className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-zinc-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.produkId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white/10 hover:text-green-400 rounded-md transition-colors text-zinc-400"
                        >
                          <FeatherIcon icon="plus" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Area - Stick to bottom of cart area if needed, otherwise flows naturally */}
          {cart.length > 0 && (
            <div className="mt-6 bg-zinc-900/80 p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-400"></div>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Diskon</span>
                  <span className="text-zinc-200">Rp {discount}</span>
                </div>
                <div className="h-px bg-white/10 my-3"></div>
                <div className="flex justify-between font-bold text-lg text-zinc-100">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl font-bold transition-all duration-300 bg-green-500 hover:bg-green-400 text-zinc-950 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Checkout Sekarang
                <FeatherIcon icon="arrow-right" className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Active Orders Section */}
          {pesanan.length > 0 && (
            <div className="mt-10 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-100">
                  <FeatherIcon icon="clock" className="w-5 h-5 text-zinc-400" />
                  Pesanan Aktif
                </h2>
              </div>
              
              <div className="space-y-4">
                {pesanan.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 hover:bg-white/[0.05] transition-colors relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                    <div className="flex justify-between items-start mb-4 pl-2">
                      <div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">ID Pesanan</p>
                        <p className="font-mono text-xs font-medium text-zinc-300">#{order.id.substring(0,8)}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[10px] font-bold tracking-wider mb-1">
                          {order.statusPesanan || "ANTRI"}
                        </span>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          {new Date(order.createdAt).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 pl-2">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <p className="text-zinc-300 truncate pr-2 font-medium">
                            <span className="text-zinc-500 mr-2 text-xs">{item.quantity}x</span>
                            {item.nama}
                          </p>
                          <p className="text-zinc-300 font-semibold text-xs">Rp {(item.harga * item.quantity).toLocaleString("id-ID")}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center pl-2">
                      <div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Total Bayar</p>
                        <p className="font-bold text-green-400 text-sm">
                          Rp {Number(order.totalPrice ?? 0).toLocaleString("id-ID")}
                        </p>
                      </div>

                      {order.statusPesanan === "ANTRI" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
                        >
                          Batalkan
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
