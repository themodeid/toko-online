-- Align produk table schema with controllers & orders module expectations
-- Target columns used by code: id (UUID), nama, harga, stock, status, image, created_at, updated_at

BEGIN;

-- Keep a backup in case there's existing data
ALTER TABLE IF EXISTS produk RENAME TO produk_legacy;

CREATE TABLE IF NOT EXISTS produk (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  harga NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  image VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMIT;

