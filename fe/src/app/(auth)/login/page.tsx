"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/features/auth/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(formLogin: FormData) {
    const username = formLogin.get("nama") as string;
    const password = formLogin.get("password") as string;

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    

    try {
      setLoading(true);
      setError(null);

      await login({ username, password });

      router.push("/dashboard"); // opsional
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="border-white">
        <h1>Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <form action={handleLogin}>
          <input type="text" name="nama" placeholder="Username" />

          <input type="password" name="password" placeholder="Password" />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
