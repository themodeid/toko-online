"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/features/auth/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(formLogin: FormData) {
    const username = formLogin.get("nama") as string;
    const password = formLogin.get("password") as string;
    const role = formLogin.get("role") as string;

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await register({ username, password });

      router.push("/login"); // opsional
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="border-white">
        <h1>Register</h1>

        {error && <p className="text-red-500">{error}</p>}

        <form action={handleRegister}>
          <input type="text" name="nama" placeholder="Username" />

          <input type="password" name="password" placeholder="Password" />
          <input type="text" name="role" placeholder="Role" />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
