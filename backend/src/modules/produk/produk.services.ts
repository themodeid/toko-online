
import { pool } from "../../config/database";

export const getAllProduk = async() => {
  const result = await pool.query("SELECT * FROM produk ORDER BY id DESC")

  return result.rows;
}

export const getProdukById = async(id: number) => {
  const result = await pool.query("SELECT * FROM produk WHERE id = $1", [id])

  return result.rows[0];
}

export const createProduk = async(nama: string, harga: number,stock: number) => {
  const result = await pool.query("INSERT INTO produk (nama, harga, stock) VALUES ($1, $2, $3) RETURNING *", [nama, harga, stock])
  return result.rows[0];
}

export const updateProduk = async(id: number, nama: string, harga: number, stock: number) => {
  const result = await pool.query("UPDATE produk SET nama = $1, harga = $2, stock = $3 WHERE id = $4 RETURNING *", [nama, harga, stock, id])
  return result.rows[0];
}

export const deleteProduk = async(id: number) => {
  const result = await pool.query("DELETE FROM produk WHERE id = $1 RETURNING *", [id])
  return result.rows[0];
}



