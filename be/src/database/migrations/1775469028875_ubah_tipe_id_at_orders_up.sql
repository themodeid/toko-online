-- Write your UP migration here
ALTER TABLE orders ALTER COLUMN id TYPE UUID USING id::uuid;