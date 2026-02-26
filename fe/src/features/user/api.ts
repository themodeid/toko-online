import api from "@/lib/axios";
import { user } from "@/features/user/type";

export async function getUser(): Promise<user> {
  try {
    const res = await api.get("/api/user/getMe"); 
    return res.data; 
  } catch (error) {
    throw new Error("gagal mengambil user");
  }
}
