import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ cek jika unauthorized
    if (error.response?.status === 401) {
      // hapus token
      localStorage.removeItem("token");

      // redirect ke login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
