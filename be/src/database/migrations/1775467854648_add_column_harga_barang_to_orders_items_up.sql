-- Write your UP migration here
ALTER TABLE order_items ADD COLUMN harga_barang DECIMAL(10, 2) NOT NULL;
