import api from "@/lib/axios";
import {
  Produk,
  CreateProdukPayload,
  UpdateProdukPayload,
  ProdukResponse,
} from "@/features/produk/types";

/* =======================
   CREATE
======================= */
export async function createProduk(data: CreateProdukPayload): Promise<Produk> {
  try {
    const formData = new FormData();

    formData.append("image", data.image);
    formData.append("nama", data.nama);
    formData.append("harga", String(data.harga));
    formData.append("stock", String(data.stock));
    formData.append("status", String(data.status));

    const res = await api.post("/api/produk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.produk;
  } catch (error) {
    throw new Error("Gagal membuat produk");
  }
}

/* =======================
   GET ALL
======================= */

export async function getAllProduk(): Promise<{ produk: Produk[] }> {
  try {
    const res = await api.get("/api/produk");
    return {
      produk: res.data.produk ?? [], // pastikan response API punya property 'produk'
    };
  } catch (error) {
    console.error(error); // optional, untuk debugging
    throw new Error("Gagal mengambil produk");
  }
}

/* =======================
   GET IMAGES
======================= */
export async function getImageProduk(): Promise<{ images: string[] }> {
  try {
    const res = await api.get("/api/produk/images");
    return res.data;
  } catch (error) {
    throw new Error("Gagal mengambil gambar produk");
  }
}

/* =======================
   GET BY ID
======================= */
export async function getProdukById(id: string): Promise<{ produk: Produk }> {
  try {
    const res = await api.get(`/api/produk/${id}`);
    return {
      produk: res.data.produk,
    };
  } catch (error) {
    throw new Error("Gagal mengambil produk");
  }
}

/* =======================
   UPDATE
======================= */
export async function updateProduk(
  id: string,
  data: UpdateProdukPayload,
): Promise<Produk> {
  try {
    // Check if there's a file to upload
    if (data.image instanceof File) {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("nama", data.nama || "");
      formData.append("harga", String(data.harga || 0));
      formData.append("stock", String(data.stock || 0));
      formData.append("status", String(data.status || false));

      const res = await api.patch(`/api/produk/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.produk;
    } else {
      // No file, send as JSON
      const res = await api.patch(`/api/produk/${id}`, data);
      return res.data.produk;
    }
  } catch (error) {
    throw new Error("Gagal memperbarui produk");
  }
}
