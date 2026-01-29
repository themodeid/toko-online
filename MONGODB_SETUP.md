# 🔧 MongoDB Setup Guide

Anda mendapat error karena MongoDB tidak running. Pilih salah satu solusi:

## ✅ Opsi 1: MongoDB Atlas (Cloud) - TERCEPAT ⭐

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up FREE (kredit $200 gratis)
3. Create cluster -> Get connection string
4. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/kontakdb1`
5. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kontakdb1
   ```
6. Run: `npm run dev`

**Kelebihan:** Tidak perlu install, langsung production-ready

---

## ✅ Opsi 2: MongoDB Compass + Local

1. Download MongoDB Community Edition:
   https://www.mongodb.com/try/download/community

2. Download MongoDB Compass:
   https://www.mongodb.com/products/tools/compass

3. Install keduanya

4. Start MongoDB Service (Windows):

   ```
   net start MongoDB
   ```

5. Verify dengan buka MongoDB Compass atau:

   ```
   mongosh
   ```

6. Run backend:
   ```
   npm run dev
   ```

---

## ✅ Opsi 3: Docker Desktop

1. Install Docker Desktop:
   https://www.docker.com/products/docker-desktop

2. Start Docker Desktop

3. Run:
   ```
   docker-compose up -d mongodb
   npm run dev
   ```

---

## 🚀 Recommended: **Opsi 1 (Atlas) - Tercepat**

Langsung bisa development tanpa install software.

---

## ⚠️ Quick Test

Setelah setup, test connection:

```bash
# Dengan mongosh
mongosh "your-connection-string"

# Atau dari backend
npm run dev
```

Harusnya tidak ada error: `❌ MongoDB error: connect ECONNREFUSED`

---

**Butuh bantuan? Tanya di terminal!**
