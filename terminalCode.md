 ===================================== Docker Notes

//Cek Database di Docker

/Cek status container
docker ps

/ Masuk ke PostgreSQL (interactive)
docker compose exec postgres-dev psql -U dev_user -d dev_db

/Perintah di dalam PostgreSQL
\dt        -- melihat daftar tabel
\d users   -- melihat struktur tabel users

//Cek Database Tanpa Masuk (Direct Command)
/Melihat daftar tabel
docker compose exec postgres-dev psql -U dev_user -d dev_db -c "\dt"

// Melihat struktur tabel
docker compose exec postgres-dev psql -U dev_user -d dev_db -c "\d produk"

//Melihat isi data
docker compose exec postgres-dev psql -U dev_user -d dev_db -c "SELECT * FROM order_items;"

// Menjalankan Docker
/Menyalakan container
docker compose up

//Menyalakan + build ulang

docker compose up --build

// Menjalankan di background
docker compose up -d

// Menghentikan container
docker compose down


//Logs & Debugging
Melihat logs realtime



================================= Git Commands

//Menghapus branch
git branch -d switch

//Menghapus branch secara paksa (meskipun belum merge)
git branch -D switch
