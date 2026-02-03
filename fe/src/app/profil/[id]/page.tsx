"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Kontak } from "@/types/kontak";
import { getKontakById, updateKontak, deleteKontak } from "@/features/kontak/api";

export default function ProfilPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [kontak, setKontak] = useState<Kontak | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErrorMessage(null);
        const data = await getKontakById(id);
        setKontak(data);
      } catch {
        setErrorMessage("Gagal memuat data kontak");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!kontak) return;

    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama") as string;
    const umur = Number(formData.get("umur"));

    if (!nama || Number.isNaN(umur)) {
      setErrorMessage("Nama dan umur harus diisi");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      await updateKontak(id, { nama, umur });
      router.push("/");
    } catch {
      setErrorMessage("Gagal memperbarui kontak");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus kontak ini?")) return;

    try {
      setDeleting(true);
      setErrorMessage(null);
      await deleteKontak(id);
      router.push("/");
    } catch {
      setErrorMessage("Gagal menghapus kontak");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Memuat data...</p>
      </div>
    );
  }

  if (!kontak) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Kontak tidak ditemukan</p>
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="inline-block text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Kembali
        </Link>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6">
            Edit Kontak
          </h1>

          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">Nama</label>
              <input
                type="text"
                name="nama"
                defaultValue={kontak.nama}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Umur</label>
              <input
                type="number"
                name="umur"
                defaultValue={kontak.umur}
                required
                min="0"
                max="100"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
