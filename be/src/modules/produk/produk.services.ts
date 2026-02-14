import { pool } from "../../config/database";
import { CreateProdukInput, UpdateProdukInput } from "./produk.schema";

export const getAllProduk = async () => {
  const result = await pool.query("SELECT * FROM produk ORDER BY id DESC");

  return result.rows;
};

export async function getProdukById(id: string) {
  const result = await pool.query(
    "SELECT * FROM produk WHERE id = $1",
    [id], // ✅ KIRIM UUID UTUH
  );

  return result.rows[0];
}

export const createProdukService = async (data: CreateProdukInput) => {
  const result = await pool.query(
    `
    INSERT INTO produk (nama, harga, stock, status, image)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [data.nama, data.harga, data.stock, data.status, data.image],
  );

  return result.rows[0];
};



export const deleteProduk = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM produk WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
