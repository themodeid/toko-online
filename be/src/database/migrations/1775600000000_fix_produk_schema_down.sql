-- Rollback produk table schema alignment
-- This restores the legacy table name if it exists.

BEGIN;

DROP TABLE IF EXISTS produk;

ALTER TABLE IF EXISTS produk_legacy RENAME TO produk;

COMMIT;

