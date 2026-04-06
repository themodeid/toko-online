-- Write your DOWN migration here
ALTER TABLE order_items RENAME COLUMN produk_id TO product_id;
