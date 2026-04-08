-- Write your DOWN migration here
ALTER TABLE orders RENAME COLUMN total_price TO total_amount;