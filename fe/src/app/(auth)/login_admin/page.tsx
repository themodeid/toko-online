"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/features/auth/api";
import { register } from "@/features/auth/api";
import { usePathname } from "next/navigation";
import FeatherIcon from "feather-icons-react";

export default function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navClass = (path: string) =>
    `w-10 h-10 cursor-pointer transition-all ${
      pathname === path
        ? "bg-green-500 text-white p-2 rounded-lg"
        : "text-gray-400 hover:text-green-400"
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
        router.push("/login");
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
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#0B0B0B] flex flex-col items-center py-6 gap-6 border-r border-white/5">
        <div className="w-full flex flex-col items-center gap-4 pb-6 border-b border-white/10">
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
              <FeatherIcon icon={menu.icon} className="w-6 h-6 text-white" />
            </div>
          ))}
        </div>

        {[{ path: "/login_admin", icon: "user", label: "Login" }].map(
          (menu) => (
            <div
              key={menu.path}
              className={navClass(menu.path)}
              onClick={() => router.push(menu.path)}
              title={menu.label}
            >
              <FeatherIcon icon={menu.icon} className="w-6 h-6 text-white" />
            </div>
          ),
        )}
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold">
              {mode === "login" ? "Welcome Back 👋" : "Create Account"}
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              {mode === "login"
                ? "Login untuk melanjutkan"
                : "Daftar untuk mulai memesan"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Username
              </label>
              <input
                type="text"
                name="nama"
                placeholder="Masukkan username"
                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-black"
              }`}
            >
              {loading
                ? "Processing..."
                : mode === "login"
                  ? "Login"
                  : "Register"}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="text-green-400 hover:text-green-300 transition"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="text-green-400 hover:text-green-300 transition"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
