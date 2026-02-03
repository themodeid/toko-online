import {
  login as LoginType,
  register as RegisterType,
  AuthResponse,
} from "@/types/login-regsiter";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/auth`;

export async function login(data: LoginType): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to login");
  return response.json();
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
