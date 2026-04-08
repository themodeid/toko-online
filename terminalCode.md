========================= 🐳 Docker Notes =================================

## 📊 Cek Database di Docker

### 🔹 Cek status container

```bash
docker ps
```

### 🔹 Masuk ke PostgreSQL (interactive)

```bash
docker compose exec postgres-dev psql -U dev_user -d dev_db
```

### 🔹 Perintah di dalam PostgreSQL

```sql
\dt        -- melihat daftar tabel
\d users   -- melihat struktur tabel users
```

---

## 🔍 Cek Database Tanpa Masuk (Direct Command)

### 🔹 Melihat daftar tabel

```bash
docker compose exec postgres-dev psql -U dev_user -d dev_db -c "\dt"
```

### 🔹 Melihat struktur tabel

```bash
docker compose exec postgres-dev psql -U dev_user -d dev_db -c "\d produk"
```

### 🔹 Melihat isi data

```bash
docker compose exec postgres-dev psql -U dev_user -d dev_db -c "SELECT * FROM produk;"
```

---

## 🚀 Menjalankan Docker

### 🔹 Menyalakan container

```bash
docker compose up
```

### 🔹 Menyalakan + build ulang

```bash
docker compose up --build
```

### 🔹 Menjalankan di background

```bash
docker compose up -d
```

### 🔹 Menghentikan container

```bash
docker compose down
```

---

## 📜 Logs & Debugging

### 🔹 Melihat logs

```bash
docker compose logs -f
```

---

## 💡 Tips

* Gunakan `-d` agar terminal tetap bisa dipakai
* Gunakan `logs -f` untuk monitoring realtime
* Simpan file ini sebagai `DOCKER.md` di root project agar mudah diakses



=============================== git ==============================

