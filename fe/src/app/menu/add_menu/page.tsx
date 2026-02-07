"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduk } from "@/features/produk/api";
import FeatherIcon from "feather-icons-react";

export default function AddMenuPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(formData: FormData) {
    setLoading(true);

    const image = formData.get("image") as File;
    const nama = formData.get("nama") as string;
    const harga = Number(formData.get("harga"));
    const stock = Number(formData.get("stock")) || 0;
    const status = formData.get("status") === "true";

    if (!image || !nama || !harga) {
      setError("Image, nama produk, dan harga wajib dicantumkan");
      setLoading(false);

      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      await createProduk({
        image,
        nama,
        harga,
        stock,
        status,
      });

      router.push("/menu/daftar_menu"); // redirect setelah sukses
    } catch (err) {
      setError("Gagal membuat produk");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex gap-6 mb-6 text-white">
        <FeatherIcon
          icon="home"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/")}
        />

        <FeatherIcon
          icon="user"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/login")}
        />

        <FeatherIcon
          icon="shopping-bag"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/")}
        />

        <FeatherIcon
          icon="shopping-cart"
          className="w-6 h-6 cursor-pointer hover:text-green-400"
          onClick={() => router.push("/")}
        />
      </div>
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Create Menu</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form action={handleCreate} className="space-y-3">
          <input type="file" name="image" required />

          <input
            type="text"
            name="nama"
            placeholder="Nama produk"
            className="border p-2 w-full text-black"
            required
          />

          <input
            type="number"
            name="harga"
            placeholder="Harga"
            className="border p-2 w-full text-black"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="border p-2 w-full text-black"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="status"
              value="true"
              className="w-4 h-4"
            />
            Active
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2"
          >
            {loading ? "Loading..." : "Create"}
          </button>
        </form>
      </div>
    </>
  );
}
