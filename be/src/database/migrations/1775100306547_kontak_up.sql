CREATE TABLE IF NOT EXISTS kontak (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nama varchar(255) NOT NULL,
  umur int NOT NULL,
  PRIMARY KEY (id)
);