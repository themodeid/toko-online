-- Write your UP migration here
ALTER TABLE orders RENAME COLUMN total_amount TO total_price;
