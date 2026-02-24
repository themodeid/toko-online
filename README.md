## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   └── components/
│   └── package.json
│
└── docker-compose.yml
```

# ☕ Cafe Ordering System

Full-Stack Web Application (Express + PostgreSQL + Next.js)

A modern full-stack ordering system where users can browse products, add items to cart, checkout orders, and manage order status.
Built with clean REST architecture, transaction-safe checkout logic, and responsive UI.

---

## 🚀 Live Architecture Overview

```
Next.js (Frontend - React 19)
        ↓
Express API (TypeScript)
        ↓
PostgreSQL (Transaction & Row Locking)
```

---

## ✨ Features

### 👤 Authentication & Authorization

* JWT-based authentication
* Role-based access (USER / ADMIN)
* Protected routes
* Secure order cancellation rules

### 🛒 Ordering System

* Add to cart
* Checkout with transaction (`BEGIN / COMMIT / ROLLBACK`)
* Stock validation before and during checkout
* Prevent race condition using `SELECT ... FOR UPDATE`
* Automatic stock deduction
* Cancel order with stock restoration
* Order queue logic (Top 3 orders protected from cancellation)

### 📦 Order Management

* View active orders
* View order history
* Get orders with items (aggregated JSON)
* Admin view all active orders
* Complete order (ADMIN)

### 🗃 Database Design

* Relational database (PostgreSQL)
* Foreign key relationships
* Transaction-safe checkout
* Row-level locking for concurrency safety

### 🎨 Frontend

* Responsive modern UI (Tailwind CSS)
* Sidebar navigation
* Cart system with dynamic total calculation
* Conditional UI based on product availability
* Order list with item preview

---

## 🛠 Tech Stack

### Backend

* Express.js
* TypeScript
* PostgreSQL
* Node-Postgres (`pg`)
* Zod (validation)
* Custom Error Handling
* Transaction-based logic

### Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Feather Icons

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/themodeid/toko-online.git
cd toko-online
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/cafe_db
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Run:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3001
```

---

## 📡 API Endpoints (Orders)

### Checkout

```
POST /api/orders/checkout
```

### Cancel Order

```
PATCH /api/orders/:id/cancel
```

### Complete Order (Admin)

```
PATCH /api/orders/:id/done
```

### Get My Active Orders

```
GET /api/orders/my/active
```

### Get All Active Orders (Admin)

```
GET /api/orders/active
```

---

## 🔐 Concurrency Safety

This project implements:

* `SELECT ... FOR UPDATE`
* Explicit database transactions
* Stock consistency validation
* Safe order cancellation with row locking

Ensures no overselling and prevents race conditions during high traffic.

---

## 📸 Screenshots

(Add your screenshots here)

```
/docs/home.png
/docs/cart.png
/docs/orders.png
```

---

## 🧪 Recommended Improvements (Future Roadmap)

* Payment Gateway Integration (Midtrans / Stripe)
* Email Notification
* React Query for better data fetching
* Service Layer separation
* Unit & Integration Testing
* CI/CD Pipeline
* Deployment (Vercel + Railway)

---

## 🏗 Why This Project Matters

This project demonstrates:

* Understanding of relational database integrity
* Transaction-safe business logic
* Concurrency handling
* Role-based authorization
* Full-stack integration
* Clean UI implementation

---

## 👨‍💻 Author

**Adam Wahyu Kurniawan**
Full-Stack Developer

GitHub: [https://github.com/themodeid](https://github.com/themodeid)

---

# 🎯 Status

Actively maintained and open for improvement.

---

Kalau kamu pakai README ini + deploy project + rapikan service layer…

Ini sudah terlihat seperti portfolio **Strong Junior menuju Mid** 🔥

Kalau kamu mau, saya bisa bantu buat versi README yang lebih "enterprise style" lagi supaya terlihat level mid developer.

