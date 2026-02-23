import {
  login as LoginType,
  register as RegisterType,
  AuthResponse,
} from "@/features/auth/types";

import api from "@/lib/axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/auth`;

export async function login(data: LoginType): Promise<AuthResponse> {
  const res = await api.post("/api/auth/login", data);

  const token = res.data.token;
  const role = res.data.user.role;

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  return { token, role };
}

export async function register(data: RegisterType): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to register");
  return response.json();
}
