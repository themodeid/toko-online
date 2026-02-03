import { pool } from "../../config/database";

export const getAllKontak = async () => {
  const result = await pool.query("SELECT * FROM kontak ORDER BY id DESC");
  return result.rows;
};

export const getKontakById = async (id: number) => {
  const result = await pool.query("SELECT * FROM kontak WHERE id = $1", [id]);
  return result.rows[0];
};

export const createKontak = async (nama: string, umur: number) => {
  const result = await pool.query(
    `INSERT INTO kontak (nama, umur)
     VALUES ($1, $2)
     RETURNING *`,
    [nama, umur]
  );
  return result.rows[0];
};

export const updateKontak = async (id: number, nama: string, umur: number) => {
  const result = await pool.query(
    `UPDATE kontak 
     SET nama = $1, umur = $2 
     WHERE id = $3 
     RETURNING *`,
    [nama, umur, id]
  );
  return result.rows[0];
};

export const deleteKontak = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM kontak WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
