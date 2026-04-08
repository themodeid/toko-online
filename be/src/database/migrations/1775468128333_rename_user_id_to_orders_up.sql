-- Write your UP migration here
ALTER TABLE orders RENAME COLUMN user_id TO auth_id;
