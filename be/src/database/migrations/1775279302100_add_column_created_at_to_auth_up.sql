-- Write your UP migration here
ALTER TABLE auth ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();
