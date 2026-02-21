import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  role: z.enum(["admin", "user"]),
});

export type User = z.infer<typeof UserSchema>;