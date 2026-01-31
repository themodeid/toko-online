import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "username wajib diisi").max(50),
  password: z.string().min(6, "password minimal 6 karakter").max(100),
});

export const registerSchema = z.object({
  username: z.string().min(1, "username wajib diisi").max(50),
  password: z.string().min(6, "password minimal 6 karakter").max(100),
});
