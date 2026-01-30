"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kontak`;

type Kontak = {
  id: number;
  nama: string;
  umur: number;
};

export default function ProfilPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [kontak, setKontak] = useState<Kontak | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchKontak();
  }, [id]);

  async function fetchKontak() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(`${API_URL}/${id}`);

      if (!res.ok) {
        setErrorMessage("Gagal memuat data kontak");
        return;
      }

      const json = await res.json();
      setKontak(json.data);
    } catch {
      setErrorMessage("Backend tidak dapat dihubungi");
    } finally {
      setLoading(false);
    }
  }

  // ================= UPDATE =================
  async function updateKontak(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!kontak) return;

    setSaving(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama") as string;
    const umur = Number(formData.get("umur"));

    if (!nama || Number.isNaN(umur)) {
      setErrorMessage("Nama dan umur harus diisi");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, umur }),
      });

      if (!res.ok) {
        setErrorMessage("Gagal memperbarui kontak");
        return;
      }

      // optimistic update
      setKontak({ ...kontak, nama, umur });
      router.push("/");
    } catch {
      setErrorMessage("Backend tidak dapat dihubungi");
    } finally {
      setSaving(false);
    }
  }

  // ================= DELETE =================
  async function deleteKontak() {
    if (!confirm("Yakin ingin menghapus kontak ini?")) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setErrorMessage("Gagal menghapus kontak");
        return;
      }

      router.push("/");
    } catch {
      setErrorMessage("Backend tidak dapat dihubungi");
    } finally {
      setSaving(false);
    }
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-poppins">
      <div className="bg-[#111] w-[400px] rounded-2xl p-8 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <h1 className="text-lg font-semibold mb-4 tracking-wide text-center">
          👤 Profil Kontak
        </h1>

        {errorMessage && (
          <div className="mb-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 text-sm text-yellow-400">
            ⚠ {errorMessage}
          </div>
        )}

        <form onSubmit={updateKontak} className="flex flex-col gap-3 mb-6">
          <input
            name="nama"
            defaultValue={kontak?.nama}
            disabled={saving}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#222] text-white text-sm disabled:opacity-40"
            required
          />

          <input
            type="number"
            name="umur"
            defaultValue={kontak?.umur}
            disabled={saving}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#222] text-white text-sm disabled:opacity-40"
            required
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#333] to-[#222] text-gray-300 text-sm font-medium disabled:opacity-40"
          >
            💾 {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <button
          onClick={deleteKontak}
          disabled={saving}
          className="w-full py-3 rounded-xl mb-4 bg-gradient-to-r from-red-700 to-red-900 text-red-100 text-sm font-medium disabled:opacity-40"
        >
          🗑 {saving ? "Memproses..." : "Hapus Kontak"}
        </button>

        <div className="text-center text-sm text-gray-400">
          <Link href="/" className="text-blue-400 hover:underline">
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
