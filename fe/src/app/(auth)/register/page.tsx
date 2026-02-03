"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/features/auth/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(formData: FormData) {
    const username = formData.get("nama") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!username || !password || !role) {
      setError("Username, password, dan role wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await register({ username, password, role });

      router.push("/login");
    } catch (err) {
      setError("Gagal mendaftar. Username mungkin sudah digunakan");
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
          <input
            type="text"
            name="nama"
            placeholder="Username"
            className="text-black"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="text-black"
          />

          <input
            type="text"
            name="role"
            placeholder="Role"
            className="text-black"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <Link href={`/login`}>ke halaman login</Link>
      </div>
    </div>
  );
}
