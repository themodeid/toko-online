import { z } from "zod";
import { UserSchema } from "../users/users.schema";

export const RegisterSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6).max(100),
});

export const LoginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6).max(100),
});

export const LoginResponseSchema = z.object({
  message: z.string(),
  token: z.string().min(10),
  user: UserSchema,
});
