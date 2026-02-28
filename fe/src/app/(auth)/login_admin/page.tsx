"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, register } from "@/features/auth/api";
import { usePathname } from "next/navigation";
import FeatherIcon from "feather-icons-react";

export default function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navClass = (path: string) =>
    `flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer transition-all duration-300 ${
      pathname === path
        ? "bg-blue-500 text-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110"
        : "text-zinc-400 hover:text-blue-400 hover:bg-white/5 hover:scale-105"
    }`;

  async function handleSubmit(formData: FormData) {
    const username = formData.get("nama") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "user";

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (mode === "login") {
        const user = await login({ username, password });

        console.log("ROLE DARI BACKEND:", user.role);

        router.replace(user.role === "admin" ? "/pesanan/daftar_pesanan" : "/");
      } else {
        await register({ username, password, role });
        setMode("login");
        setError(null);
      }
    } catch (err) {
      setError(
        mode === "login" ? "Username atau password salah" : "Gagal mendaftar",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#09090b] text-zinc-50 font-poppins selection:bg-blue-500/30">
      {/* ================= SIDEBAR / BOTTOM NAV ================= */}
      <aside className="w-full md:w-24 h-20 md:h-screen fixed bottom-0 md:sticky md:top-0 bg-zinc-950/80 md:bg-white/[0.02] backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/5 flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-8 gap-0 md:gap-8 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] md:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50">
        <div className="flex flex-row md:flex-col gap-2 md:gap-6 w-full items-center justify-evenly md:justify-start px-4 md:px-0">
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
              <FeatherIcon icon={menu.icon} className="w-5 h-5" />
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-col gap-6 w-full items-center mt-auto">
          {[{ path: "/login_admin", icon: "user", label: "Admin Login" }].map(
          (menu) => (
            <div
              key={menu.path}
              className={navClass(menu.path)}
              onClick={() => router.push(menu.path)}
              title={menu.label}
            >
              <FeatherIcon icon={menu.icon} className="w-5 h-5" />
            </div>
          ),
        )}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 lg:p-12 pb-28 md:pb-12 relative overflow-hidden w-full">
        {/* Decorative effects - Using Blue for Admin */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10 transition-all duration-500 hover:border-white/20">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner transition-colors duration-500 ${mode === "login" ? "bg-white/5" : "bg-blue-500/10 border-blue-500/20"}`}>
              <FeatherIcon icon={mode === "login" ? "shield" : "user-plus"} className={`w-8 h-8 ${mode === "login" ? "text-blue-400" : "text-blue-300"}`} />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              Admin Portal
            </h1>
            <p className="text-zinc-400 mt-3 text-sm">
              {mode === "login"
                ? "Login ke area khusus admin"
                : "Daftar akun admin baru"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
              <FeatherIcon icon="alert-circle" className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">
                Admin Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FeatherIcon icon="user" className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="nama"
                  placeholder="Masukkan username admin"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-zinc-600 text-zinc-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FeatherIcon icon="lock" className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password rahasia"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-zinc-600 text-zinc-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-2 ${
                loading
                  ? "bg-white/10 text-zinc-400 cursor-not-allowed border border-white/5"
                  : "bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : mode === "login" ? (
                <>
                  Akses Dashboard
                  <FeatherIcon icon="arrow-right" className="w-4 h-4" />
                </>
              ) : (
                <>
                  Daftar Admin
                  <FeatherIcon icon="check" className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-8 text-center text-sm text-zinc-400 border-t border-white/5 pt-6">
            {mode === "login" ? (
              <p>
                Admin baru?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors hover:underline underline-offset-4"
                >
                  Daftar akses admin
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akses admin?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors hover:underline underline-offset-4"
                >
                  Login di sini
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
