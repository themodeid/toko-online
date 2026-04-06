-- Write your DOWN migration here
ALTER TABLE orders ALTER COLUMN id TYPE SERIAL USING id::integer;
