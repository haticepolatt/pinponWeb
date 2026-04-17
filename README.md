# PinPon Akademi

Turkce, mobil uyumlu ve rol bazli tam yigin masa tenisi antrenman merkezi uygulamasi.

## Teknoloji

- React + Vite + TailwindCSS
- Node.js + Express
- Prisma ORM
- PostgreSQL uyumlu veri modeli
- JWT + refresh token + CSRF korumasi

Gelistirme kolayligi icin varsayilan `.env.example` SQLite ile calisir. Prisma semasi PostgreSQL'e de hazirdir; sadece `DATABASE_URL` degerini PostgreSQL baglantisiyla degistirmeniz yeterlidir.

## Kurulum

```bash
cp .env.example .env
npm install
npx prisma generate --schema server/prisma/schema.prisma
npm run seed
npm run dev
```

Uygulama adresleri:

- Frontend: `http://127.0.0.1:5174`
- Backend: `http://127.0.0.1:4000/api`

## Demo Hesaplari

- Admin: `admin@pinponakademi.com` / `Admin123!`
- Antrenor 1: `selim@pinponakademi.com` / `Trainer123!`
- Antrenor 2: `ece@pinponakademi.com` / `Trainer123!`
- Ogrenci: `oyuncu@pinponakademi.com` / `Student123!`

## Ozellikler

- JWT access + refresh token sistemi
- Admin, antrenor ve ogrenci rolleri
- Paket satin alma ve kalan seans takibi
- Blok tabanli musaitlik yonetimi
- Cift rezervasyon engelleme
- Haftalik ve aylik takvim gorunumu
- Temel analitikler ve yonetim panelleri
- Guvenlik: Helmet, CORS, rate limit, CSRF, validasyon, merkezi hata yonetimi

## API Notlari

Temel endpoint ozeti [server/API.md](/Users/haticepolat/Desktop/pinponWeb/server/API.md) icindedir.

## Proje Yapisi

- `client`: React uygulamasi
- `server`: Express API, Prisma, seed
- `shared`: Ortak sabitler ve tip yardimcilari
