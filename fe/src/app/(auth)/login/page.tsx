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

        router.replace(user.role === "admin" ? "/pesanan" : "/");
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
      {/* Sidebar */}
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

        <div
          className={navClass("/pesanan")}
          onClick={() => router.push("/pesanan")}
        >
          <FeatherIcon icon="list" className="w-6 h-6 text-white" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            {mode === "login" ? "Login" : "Register"}
          </h1>

          {error && (
            <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
          )}

          <form action={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nama"
              placeholder="Username"
              className="w-full px-4 py-2 rounded bg-white text-black outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-white text-black outline-none"
            />

            {mode === "register" && (
              <input
                type="text"
                name="role"
                placeholder="Role (default: user)"
                className="w-full px-4 py-2 rounded bg-white text-black outline-none"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium py-2 rounded transition disabled:opacity-50"
            >
              {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="text-green-400 hover:underline"
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
                  className="text-green-400 hover:underline"
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
