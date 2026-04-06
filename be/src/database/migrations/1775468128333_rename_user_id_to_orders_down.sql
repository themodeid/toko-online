-- Write your DOWN migration here
ALTER TABLE orders RENAME COLUMN auth_id TO user_id;
