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

export const updateProdukService = async (
  id: string,
  data: UpdateProdukInput,
) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.nama !== undefined) {
    fields.push(`nama = $${idx++}`);
    values.push(data.nama);
  }

  if (data.harga !== undefined) {
    fields.push(`harga = $${idx++}`);
    values.push(data.harga);
  }

  if (data.stock !== undefined) {
    fields.push(`stock = $${idx++}`);
    values.push(data.stock);
  }

  if (data.status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(data.status);
  }

  if (data.image !== undefined) {
    fields.push(`image = $${idx++}`);
    values.push(data.image);
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE produk
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING *
  `;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteProduk = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM produk WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
