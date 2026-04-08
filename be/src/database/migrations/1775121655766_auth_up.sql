-- Write your DOWN migration here
CREATE TABLE IF NOT EXISTS auth (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);