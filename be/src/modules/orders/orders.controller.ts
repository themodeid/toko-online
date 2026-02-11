import { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { pool } from "../../config/database";

export const checkout = catchAsync(async (req: Request, res: Response) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    throw new AppError("Item order tidak boleh kosong", 400);
  }

  for (const item of items) {
    if (!item.produk_id || typeof item.produk_id !== "string") {
      throw new AppError("ID produk tidak valid", 400);
    }
    if (!item.quantity || item.quantity <= 0) {
      throw new AppError("Quantity harus lebih dari 0", 400);
    }
  }

  const produksIds = items.map((i: any) => i.produk_id);

  const produksQuery = `
    SELECT id, nama, harga, stock 
    FROM produk 
    WHERE id = ANY($1::uuid[])
  `;

  const productsResult = await pool.query(produksQuery, [produksIds]);
  const products = productsResult.rows;

  if (products.length !== items.length) {
    throw new AppError("Ada produk yang tidak ditemukan", 400);
  }

  const orderItems = items.map((item: any) => {
    const produk = products.find((p) => p.id === item.produk_id);

    if (!produk) {
      throw new AppError("Produk tidak ditemukan", 400);
    }

    if (produk.stock < item.quantity) {
      throw new AppError(`Stok ${produk.nama} tidak cukup`, 400);
    }

    return {
      produk_id: produk.id,
      harga: produk.harga,
      quantity: item.quantity,
      subtotal: produk.harga * item.quantity,
    };
  });

  const total_price = orderItems.reduce(
    (acc: number, item: any) => acc + item.subtotal,
    0,
  );

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderQuery = `
      INSERT INTO orders (user_id, total_price, status_pesanan)
      VALUES ($1, $2, 'ANTRI')
      RETURNING id
    `;

    const orderResult = await client.query(orderQuery, [userId, total_price]);

    const orderId = orderResult.rows[0].id;

    const itemsQuery = `
      INSERT INTO order_items 
      (order_id, produk_id, harga_barang, qty, subtotal)
      VALUES ${orderItems
        .map(
          (_, i) =>
            `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${
              i * 5 + 5
            })`,
        )
        .join(", ")}
    `;

    const values = orderItems.flatMap((item) => [
      orderId,
      item.produk_id,
      item.harga,
      item.quantity,
      item.subtotal,
    ]);

    await client.query(itemsQuery, values);

    for (const item of orderItems) {
      await client.query("UPDATE produk SET stock = stock - $1 WHERE id = $2", [
        item.quantity,
        item.produk_id,
      ]);
    }

    await client.query("COMMIT");

    const fetchOrderQuery = `
      SELECT
        o.id as order_id,
        o.status_pesanan,
        u.username,
        o.total_price as total_amount,
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;

    const orderData = await pool.query(fetchOrderQuery, [orderId]);
    const order = orderData.rows[0];

    res.status(201).json(order);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});
