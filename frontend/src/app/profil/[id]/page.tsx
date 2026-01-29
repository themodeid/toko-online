"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:3000/api/kontak";

type Kontak = {
  _id: string;
  nama: string;
  umur: number;
};

export default function ProfilPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [kontak, setKontak] = useState<Kontak | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setKontak(json.data);
        setLoading(false);
      });
  }, [id]);

  // ================= UPDATE =================
  async function updateKontak(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: formData.get("nama"),
        umur: Number(formData.get("umur")),
      }),
    });

    alert("Kontak berhasil diupdate");
    router.push("/");
  }

  // ================= DELETE =================
  async function deleteKontak() {
    if (!confirm("Yakin ingin menghapus kontak ini?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    router.push("/");
  }

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  if (!kontak)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Kontak tidak ditemukan
      </div>
    );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-poppins">
      <div
        className="bg-[#111] w-[400px] rounded-2xl p-8 text-white
        shadow-[0_0_30px_rgba(255,255,255,0.05)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_35px_rgba(255,255,255,0.1)]"
      >
        <h1 className="text-lg font-semibold mb-6 tracking-wide text-center">
          👤 Profil Kontak
        </h1>

        {/* ================= FORM ================= */}
        <form onSubmit={updateKontak} className="flex flex-col gap-3 mb-6">
          <input
            name="nama"
            defaultValue={kontak.nama}
            placeholder="Nama"
            className="w-full px-4 py-3 rounded-xl
              bg-[#1a1a1a] border border-[#222]
              text-white text-sm
              placeholder:text-gray-500
              focus:outline-none focus:border-gray-400
              focus:bg-[#1e1e1e] transition"
            required
          />

          <input
            type="number"
            name="umur"
            defaultValue={kontak.umur}
            placeholder="Umur"
            className="w-full px-4 py-3 rounded-xl
              bg-[#1a1a1a] border border-[#222]
              text-white text-sm
              placeholder:text-gray-500
              focus:outline-none focus:border-gray-400
              focus:bg-[#1e1e1e] transition"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl
              bg-gradient-to-r from-[#333] to-[#222]
              text-gray-300 text-sm font-medium
              transition-all duration-300
              hover:from-[#444] hover:to-[#2a2a2a]
              hover:text-white
              active:scale-95"
          >
            💾 Simpan Perubahan
          </button>
        </form>

        {/* ================= DELETE ================= */}
        <button
          onClick={deleteKontak}
          className="w-full py-3 rounded-xl mb-4
            bg-gradient-to-r from-red-700 to-red-900
            text-red-100 text-sm font-medium
            transition-all duration-300
            hover:from-red-600 hover:to-red-800
            active:scale-95"
        >
          🗑 Hapus Kontak
        </button>

        {/* ================= FOOTER ================= */}
        <div className="text-center text-sm text-gray-400">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 hover:underline transition"
          >
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
