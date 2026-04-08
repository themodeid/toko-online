-- Write your UP migration here
ALTER TABLE orders ADD COLUMN status_pesanan VARCHAR(20) NOT NULL DEFAULT 'PENDING';
