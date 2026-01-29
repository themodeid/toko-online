import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Kontak = {
  _id: string;
  nama: string;
  umur: number;
};

const API_URL = "http://localhost:3000/api/kontak";

export default async function HomePage() {
  const res = await fetch(API_URL, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Gagal mengambil data kontak");
  }

  const json = await res.json();
  const kontak: Kontak[] = json.data;

  // ================= CREATE (SERVER ACTION) =================
  async function createKontakAction(formData: FormData) {
    "use server";

    const nama = formData.get("nama");
    const umur = Number(formData.get("umur"));

    if (!nama || !umur) {
      throw new Error("Nama dan umur harus diisi");
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, umur }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menambah kontak");
    }

    revalidatePath("/");
  }

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
          📇 Manajemen Kontak
        </h1>

        {/* ================= FORM CREATE ================= */}
        <form action={createKontakAction} className="flex flex-col gap-3 mb-6">
          <input
            name="nama"
            placeholder="Nama"
            required
            className="w-full px-4 py-3 rounded-xl
              bg-[#1a1a1a] border border-[#222]
              text-white text-sm
              placeholder:text-gray-500
              focus:outline-none focus:border-gray-400
              focus:bg-[#1e1e1e] transition"
          />

          <input
            name="umur"
            type="number"
            min={0}
            placeholder="Umur"
            required
            className="w-full px-4 py-3 rounded-xl
              bg-[#1a1a1a] border border-[#222]
              text-white text-sm
              placeholder:text-gray-500
              focus:outline-none focus:border-gray-400
              focus:bg-[#1e1e1e] transition"
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
            ➕ Tambah Kontak
          </button>
        </form>

        {/* ================= LIST KONTAK ================= */}
        <ul className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
          {kontak.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              Belum ada kontak
            </p>
          ) : (
            kontak.map((k) => (
              <li
                key={k._id}
                className="bg-[#1a1a1a] border border-[#222]
                  rounded-xl px-4 py-3
                  flex justify-between items-center
                  transition hover:bg-[#1e1e1e]"
              >
                <div>
                  <p className="text-sm font-medium text-white">{k.nama}</p>
                  <p className="text-xs text-gray-400">Umur: {k.umur}</p>
                </div>

                <Link
                  href={`/profil/${k._id}`}
                  className="text-xs px-3 py-1.5 rounded-lg
                    bg-gradient-to-r from-[#333] to-[#222]
                    text-gray-300
                    hover:from-[#444] hover:to-[#2a2a2a]
                    hover:text-white
                    active:scale-95 transition"
                >
                  Profil
                </Link>
              </li>
            ))
          )}
        </ul>
        <div id="footer" className="mt-8 text-center text-gray-500 text-sm">
          © 2026 Manajemen Kontak - by adam wahyu kurniawan
        </div>
      </div>
    </div>
  );
}
