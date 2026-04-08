-- Write your UP migration here
ALTER TABLE auth ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';

