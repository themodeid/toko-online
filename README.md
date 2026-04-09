Berikut draft `README.md` yang sudah disesuaikan dengan kondisi projekmu sekarang (backend `be/`, frontend `fe/`, jalan lewat Docker, port 5000/3000, dsb). Kamu bisa langsung **replace isi file `README.md`** dengan ini.

---

## ☕ Toko Online / Cafe Ordering System

Full-stack web app untuk pemesanan menu (cafe / resto) dengan:

- Backend **Express + TypeScript + PostgreSQL**
- Frontend **Next.js App Router + Tailwind CSS**
- Infrastruktur **Docker + docker-compose**

User bisa daftar/login, melihat menu, membuat pesanan, dan melihat status antrian. Admin bisa mengelola produk dan mengelola pesanan.

---

### 📁 Struktur Project

```text
.
├── be/                     # Backend (Express + TS)
│   ├── src/
│   │   ├── app.ts          # Inisialisasi express + routes
│   │   ├── server.ts       # Entry point server
│   │   ├── config/         # DB & env config
│   │   ├── database/       # migration runner + migrations (*.sql)
│   │   ├── modules/
│   │   │   ├── auth/       # auth.controller / auth.route / schema
│   │   │   ├── users/      # getMe, deleteAllUsers
│   │   │   ├── produk/     # CRUD produk
│   │   │   └── orders/     # checkout, antrian, cancel, history
│   │   ├── middlewares/    # authGuard, roleGuard, validateBody, dll
│   │   └── errors/utils/   # AppError, catchAsync, errorHandler
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── fe/                     # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # App Router pages (menu, login, pesanan, dll)
│   │   ├── context/        # AuthContext
│   │   ├── features/       # auth / produk / cart / user / kontak
│   │   └── lib/            # axios client
│   ├── next.config.js
│   ├── package.json
│   ├── dockerfile
│   └── .env.local
│
├── docker-compose.yml      # Orkestrasi backend, frontend, postgres
└── README.md
```

---

### 🛠 Tech Stack

- **Backend**
  - Node.js + **Express 5** + **TypeScript**
  - PostgreSQL + `pg`
  - Zod (validasi schema)
  - JWT (auth)
  - Custom error handling (`AppError`, `errorHandler`)
  - SQL migrations dengan file `*.sql` + `migrationRunner.ts`

- **Frontend**
  - **Next.js 14** (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Feather Icons
  - Context API untuk auth

- **Infra**
  - Docker & docker-compose
  - Healthcheck container (backend & frontend)
  - Volume untuk Postgres dev/prod

---

## 🚀 Menjalankan dengan Docker (disarankan)

Pastikan **Docker** sudah terinstall dan berjalan.

Di root project (`toko-online`):

```bash
docker compose up -d --build
```

Container yang akan jalan:

- **frontend-app** → Next.js dev server  
  `http://localhost:3000`
- **backend-api** → Express API  
  `http://localhost:5000/api`
- **postgres-db-dev** → Postgres dev  
  `localhost:5433`
- **postgres-db-pro** → Postgres “prod”  
  `localhost:5434`

Cek status:

```bash
docker compose ps
```

Semua service idealnya berstatus **Up (...) (healthy)**.

Stop semua:

```bash
docker compose down
```

Reset semua data Postgres dev/pro:

```bash
docker compose down -v
```

---

### 🌍 URL Penting

- Frontend: `http://localhost:3000`
- Backend base: `http://localhost:5000/api`
- Health backend: `http://localhost:5000/api/health`
- Health frontend: `http://localhost:3000/api/health`

---

## ⚙️ Konfigurasi Environment

### Backend (`be/`)

Untuk **local (tanpa Docker)**, buat file `.env` di folder `be/`:

```env
# contoh local
DATABASE_URL=postgresql://postgres:password@localhost:5433/toko_docker
PORT=5000
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1d
```

Di mode Docker, sebagian env di-inject dari `docker-compose.yml`:

```yaml
backend:
  build: ./be
  container_name: backend-api
  environment:
    - DATABASE_URL=postgresql://dev_user:adamwahyukur@postgres-dev:5432/dev_db
    - PORT=5000
    - NODE_ENV=development
    - CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (`fe/`)

File `.env.local` (baik saat jalan lokal maupun di dalam container):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Di `docker-compose.yml`:

```yaml
frontend:
  build: ./fe
  container_name: frontend-app
  environment:
    - NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

`NEXT_PUBLIC_API_BASE_URL` selalu menunjuk ke **port API yang di-publish ke host** (5000), karena request dilakukan dari browser.

---

## ▶️ Menjalankan Tanpa Docker (opsional)

### 1️⃣ Jalankan Postgres sendiri

Buat database manual (contoh):

```sql
CREATE DATABASE dev_db;
CREATE USER dev_user WITH PASSWORD 'adamwahyukur';
GRANT ALL PRIVILEGES ON DATABASE dev_db TO dev_user;
```

Sesuaikan `DATABASE_URL` di `.env` backend.

### 2️⃣ Backend

```bash
cd be
npm install

# jalankan migrations
npm run db:migrate

# development
npm run dev
# atau build + start
npm run build
npm start
```

Backend jalan di `http://localhost:5000/api`.

### 3️⃣ Frontend

```bash
cd fe
npm install
npm run dev
```

Frontend jalan di `http://localhost:3000`.

---

## 🧱 Desain Database (ringkas)

Tabel utama (setelah migrasi terbaru):

- **`auth`**
  - `id UUID PK`
  - `username VARCHAR`
  - `password VARCHAR (bcrypt)`
  - `role VARCHAR(50) DEFAULT 'user'`
  - `created_at TIMESTAMP`

- **`produk`**
  - `id UUID PK`
  - `nama VARCHAR`
  - `harga NUMERIC(10,2)`
  - `stock INT`
  - `status BOOLEAN` (tersedia / tidak)
  - `image VARCHAR` (path `/uploads/...`)
  - `created_at`, `updated_at`

- **`orders`**
  - `id UUID PK`
  - `auth_id UUID FK → auth(id)`
  - `total_price NUMERIC(10,2)`
  - `status_pesanan VARCHAR(20)` (`ANTRI`, `DIPROSES`, `SELESAI`, `DIBATALKAN`)
  - `created_at TIMESTAMPTZ`

- **`order_items`**
  - `id UUID PK`
  - `order_id UUID FK → orders(id)`
  - `produk_id UUID FK → produk(id)`
  - `harga_barang NUMERIC(10,2)`
  - `quantity INT`
  - `subtotal NUMERIC(10,2)`

- **`daily_queue`**
  - Menyimpan nomor antrian harian per order.

Migrations ada di `be/src/database/migrations`, dijalankan otomatis saat server start (`runMigrations()` di `server.ts`).

---

## 🔐 Auth & User Endpoints

Base URL backend: `http://localhost:5000/api`

Semua body contoh dalam **JSON**.

### Register user biasa

```http
POST /api/auth/register
POST /api/auth/registerUser
Content-Type: application/json

{
  "username": "fuga",
  "password": "adamwahyu"
}
```

Respon:

```json
{
  "message": "User berhasil mendaftar",
  "user": {
    "id": "...",
    "username": "fuga",
    "role": "user",
    "created_at": "..."
  }
}
```

### Register admin

> Gunakan endpoint ini hanya untuk setup awal admin.

```http
POST /api/auth/registerAdmin
Content-Type: application/json

{
  "username": "admin",
  "password": "adamwahyu"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "fuga",
  "password": "adamwahyu"
}
```

Respon berisi `token` (JWT) dan data user. Simpan `token` di frontend (localStorage) dan kirim di header:

```http
Authorization: Bearer <token>
```

### Logout

```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "..."  // jika dipakai
}
```

### Get profil saya

```http
GET /api/users/getMe
Authorization: Bearer <token>
```

---

## 🛒 Produk (Menu) Endpoints

Semua biasanya di-protect dengan `authGuard` untuk operasi tulis.

- **GET semua produk**

```http
GET /api/produk
```

- **GET produk by id**

```http
GET /api/produk/:id
```

- **POST buat produk** (admin)

```http
POST /api/produk
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data

image: <file>
nama: "Kopi Hitam"
harga: 15000
stock: 10
status: true
```

- **PATCH update produk** (admin)

```http
PATCH /api/produk/:id
Authorization: Bearer <ADMIN_TOKEN>
# multipart/form-data kalau ganti gambar, atau JSON kalau hanya data
```

- **DELETE hapus produk** (admin)

```http
DELETE /api/produk/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📦 Orders & Antrian

### Checkout (buat order baru)

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "produk_id": "<UUID produk>",
      "quantity": 2
    }
  ]
}
```

- Mengecek ketersediaan stok
- Mengurangi stok
- Membuat record di `orders`, `order_items`, `daily_queue`
- Mengembalikan `order_id`, `no_antrian`, dan `total_price`

### Ambil semua orders (admin / kasir)

```http
GET /api/orders
Authorization: Bearer <token>
```

### Ambil semua order aktif + items (admin view)

```http
GET /api/orders/activeItems
Authorization: Bearer <token>
```

### Ambil semua order aktif saya + items

```http
GET /api/orders/myActiveItems
Authorization: Bearer <token>
```

### Ambil semua order saya (riwayat) + items

```http
GET /api/orders/myAllOrders
Authorization: Bearer <token>
```

### Ambil items dari 1 order

```http
GET /api/orders/:id/items
Authorization: Bearer <token>
```

### Tandai order selesai (admin)

```http
PATCH /api/orders/:id/selesai
Authorization: Bearer <ADMIN_TOKEN>
```

### Cancel order

```http
PATCH /api/orders/:id/cancel
Authorization: Bearer <token>
```

- Admin bisa cancel order apa saja.
- User hanya bisa cancel order miliknya sendiri.
- Order di status tertentu / top 3 antrian bisa **tidak boleh dicancel**.

---

## 🎨 Frontend (Next.js)

Di frontend, API dipanggil lewat:

- `src/lib/axios.ts` dengan `baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"`
- `features/*/api.ts` membungkus pemanggilan endpoint (auth/produk/orders/user).

Halaman utama:

- `/` → daftar menu + cart
- `/login` → login user
- `/login_admin` → login admin
- `/pesanan/...` → daftar pesanan, history, dsb
- `/menu/...` → detail / tambah menu

---

## 🧪 Smoke Test Manual

Setelah `docker compose up -d --build`:

1. Buka `http://localhost:3000` → UI muncul.
2. Coba register via frontend atau Postman:
   - `POST http://localhost:5000/api/auth/register`
3. Login → pastikan token tersimpan dan API lain bisa dipanggil.
4. Tambah produk (via UI atau Postman).
5. Checkout order dari UI → cek stok berkurang dan pesanan muncul di halaman pesanan.

---

## 👤 Author

**Adam Wahyu Kurniawan**  
Full-Stack Developer

GitHub: [`https://github.com/themodeid`](https://github.com/themodeid)

---

Kalau kamu mau, aku juga bisa menambahkan contoh **Postman collection** section atau **step khusus untuk deployment** (mis. ke Railway/Vercel) di README ini.
