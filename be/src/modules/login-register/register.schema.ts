import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "username wajib diisi").max(50),
  password: z.string().min(6, "password minimal 6 karakter").max(100),
  role: z
    .enum(["user", "admin"], {
      message: "Role harus owner, admin, atau user",
    })
    .optional()
    .default("user"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "username wajib diisi").max(50),
  password: z.string().min(6, "password minimal 6 karakter").max(100),
});
