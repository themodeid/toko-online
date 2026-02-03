"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Kontak } from "@/types/kontak";
import { getKontak, createKontak } from "@/features/kontak/api";
import { link } from "fs";

export default function HomePage() {
  const [kontak, setKontak] = useState<Kontak[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchKontak() {
    try {
      setErrorMessage(null);
      const data = await getKontak();
      setKontak(data);
    } catch {
      setErrorMessage("Backend tidak dapat dihubungi.");
    }
  }

  useEffect(() => {
    fetchKontak();
  }, []);

  async function handleCreate(formData: FormData) {
    const nama = formData.get("nama") as string;
    const umur = Number(formData.get("umur"));
    if (!nama || !umur) return;

    try {
      setLoading(true);
      setErrorMessage(null);
      await createKontak({ nama, umur });
      await fetchKontak();
      // Reset form
      const form = document.getElementById("create-form") as HTMLFormElement;
      if (form) form.reset();
    } catch (error) {
      setErrorMessage("Gagal membuat kontak");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Daftar Kontak
        </h1>

        {/* Form Create */}
        <form
          id="create-form"
          action={handleCreate}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Tambah Kontak Baru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="nama"
              placeholder="Nama"
              required
              className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="umur"
              placeholder="Umur"
              required
              min="0"
              max="100"
              className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Menambah..." : "Tambah"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}

        {/* List Kontak */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">
            Daftar Kontak ({kontak.length})
          </h2>
          {kontak.length === 0 ? (
            <p className="text-white/60 text-center py-8">
              Belum ada kontak. Tambahkan kontak baru di atas.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kontak.map((item) => (
                <Link
                  key={item.id}
                  href={`/profil/${item.id}`}
                  className="block bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 transition-all hover:scale-105"
                >
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {item.nama}
                  </h3>
                  <p className="text-white/70">Umur: {item.umur} tahun</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
