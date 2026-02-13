"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Produk } from "@/features/produk/types";
import { getAllProduk } from "@/features/produk/api";
import FeatherIcon from "feather-icons-react";
import { usePathname } from "next/navigation";
import { CartItem } from "@/features/cart/types";
import { createOrder } from "@/features/cart/api";
import Image from "next/image";

export default function MenuPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  useEffect(() => {
    getProduk();
  }, []);

  const addToCart = (produk: Produk) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.produkId === produk.id);
      if (exist) {
        return prev.map((item) =>
          item.produkId === produk.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
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
      alert("Order berhasil!");

      setCart([]); // kosongkan cart setelah berhasil
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
      </aside>

      {/* ================= MAIN MENU ================= */}
      <main className="flex-1 p-6 overflow-y-auto">
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
                  Rp {Number(item.harga).toLocaleString("id-ID")}
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

                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition"
                >
                  <FeatherIcon
                    icon="shopping-cart"
                    className="w-5 h-5 text-black"
                  />
                </button>

                <Link
                  href={`/menu/profil_produk/${item.id}`}
                  className="block text-center bg-green-500 hover:bg-green-600 text-black font-medium py-2 rounded-xl transition"
                >
                  Detail
                </Link>
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
              <div className="w-12 h-12 bg-gray-200 relative">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.nama}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.nama}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.produkId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
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
                Rp {(item.harga * item.quantity).toLocaleString("id-ID")}
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
      </aside>
    </div>
  );
}
