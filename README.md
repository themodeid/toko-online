
---

# ☕ Toko Online / Cafe Ordering System

Full-stack web application untuk sistem pemesanan menu (cafe/resto) dengan arsitektur modern berbasis:

* **Backend:** Express + TypeScript + PostgreSQL
* **Frontend:** Next.js (App Router) + Tailwind CSS
* **Infrastructure:** Docker + Docker Compose

Aplikasi ini memungkinkan:

* User melakukan registrasi, login, melihat menu, dan membuat pesanan
* Admin mengelola produk dan memproses pesanan

---

## 📁 Struktur Project

```bash
.
├── be/                     # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── app.ts          # Setup express & routes
│   │   ├── server.ts       # Entry point server
│   │   ├── config/         # Database & environment config
│   │   ├── database/       # Migration runner + SQL migrations
│   │   ├── modules/        # Feature modules (auth, users, produk, orders)
│   │   ├── middlewares/    # Auth, validation, error handler
│   │   └── errors/utils/   # Custom error handling
│   ├── Dockerfile
│   └── package.json
│
├── fe/                     # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── context/        # Auth context
│   │   ├── features/       # API logic per fitur
│   │   └── lib/            # Axios config
│   ├── dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🛠 Tech Stack

### Backend

* Node.js + Express 5
* TypeScript
* PostgreSQL (`pg`)
* Zod (validasi schema)
* JWT Authentication
* Custom Error Handling
* SQL Migration System

### Frontend

* Next.js 14 (App Router)
* React 18
* TypeScript
* Tailwind CSS
* Context API

### Infrastructure

* Docker & Docker Compose
* Container healthcheck
* Volume-based PostgreSQL

---

## 🚀 Menjalankan dengan Docker (Recommended)

Pastikan Docker sudah terinstall.

```bash
docker compose up -d --build
```

### Container yang berjalan:

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5000/api](http://localhost:5000/api)
* Postgres Dev → localhost:5433
* Postgres Prod → localhost:5434

Cek status:

```bash
docker compose ps
```

Stop semua service:

```bash
docker compose down
```

Reset database:

```bash
docker compose down -v
```

---

## 🌐 Endpoint Penting

| Service         | URL                                                                  |
| --------------- | -------------------------------------------------------------------- |
| Frontend        | [http://localhost:3000](http://localhost:3000)                       |
| Backend         | [http://localhost:5000/api](http://localhost:5000/api)               |
| Health Backend  | [http://localhost:5000/api/health](http://localhost:5000/api/health) |
| Health Frontend | [http://localhost:3000/api/health](http://localhost:3000/api/health) |

---

## ⚙️ Environment Configuration

### Backend (`be/.env`)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/toko_docker
PORT=5000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

---

### Frontend (`fe/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## ▶️ Menjalankan Tanpa Docker

### 1. Setup Database

```sql
CREATE DATABASE dev_db;
CREATE USER dev_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE dev_db TO dev_user;
```

---

### 2. Backend

```bash
cd be
npm install
npm run db:migrate
npm run dev
```

---

### 3. Frontend

```bash
cd fe
npm install
npm run dev
```

---

## 🧱 Database Overview

### Tabel Utama:

* `auth` → user & role
* `produk` → menu
* `orders` → transaksi
* `order_items` → detail pesanan
* `daily_queue` → nomor antrian

---

## 🔐 Authentication API

### Register User

```http
POST /api/auth/register
```

```json
{
  "username": "user",
  "password": "password"
}
```

---

### Login

```http
POST /api/auth/login
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

Gunakan header:

```http
Authorization: Bearer <token>
```

---

### Get Profile

```http
GET /api/users/getMe
```

---

## 🛒 Produk API

* GET `/api/produk`
* GET `/api/produk/:id`
* POST `/api/produk` (Admin)
* PATCH `/api/produk/:id` (Admin)
* DELETE `/api/produk/:id` (Admin)

---

## 📦 Orders API

### Checkout

```http
POST /api/orders
```

```json
{
  "items": [
    {
      "produk_id": "uuid",
      "quantity": 2
    }
  ]
}
```

---

### Endpoint lainnya:

* GET `/api/orders`
* GET `/api/orders/myActiveItems`
* GET `/api/orders/myAllOrders`
* PATCH `/api/orders/:id/selesai`
* PATCH `/api/orders/:id/cancel`

---

## 🎨 Frontend Structure

* `/` → Menu + Cart
* `/login` → Login user
* `/login_admin` → Login admin
* `/pesanan` → Order & history
* `/menu` → CRUD menu

---

## 🧪 Manual Testing

1. Jalankan Docker
2. Buka [http://localhost:3000](http://localhost:3000)
3. Register & login
4. Tambah produk (admin)
5. Checkout order
6. Cek status pesanan

---

## 👤 Author

**Adam Wahyu Kurniawan**
Full-Stack Developer

GitHub: [https://github.com/themodeid](https://github.com/themodeid)

---

## 🔥 Improvement dari versi sebelumnya

* Struktur lebih clean & profesional
* Tidak redundant
* Lebih readable untuk recruiter / tim
* Sudah siap jadi portfolio GitHub

---

