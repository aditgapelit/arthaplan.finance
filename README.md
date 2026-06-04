# ArthaPlan

ArthaPlan adalah aplikasi financial tracker fullstack untuk memantau pemasukan, pengeluaran, target keuangan, dan insight AI.

## Fitur Utama

- Auth user dengan Supabase
- Dashboard ringkasan saldo, pemasukan, pengeluaran, dan target aktif
- ArthaTrack untuk mencatat dan melacak transaksi
- ArthaGoal untuk mengelola target keuangan
- ArthaReport untuk analisis grafik dan insight
- AI insight untuk dashboard dan track

## Tech Stack

- **Frontend**: React + Vite
- **UI/Animation**: Framer Motion, Lucide React, Recharts
- **Database/Auth**: Supabase
- **AI Backend**: Netlify Functions

## Struktur Project

```text
arthaplan.finance/
├─ netlify/
│  └─ functions/
│     ├─ _ai.js
│     ├─ dashboard.js
│     └─ track.js
├─ public/
├─ src/
│  ├─ components/
│  ├─ context/
│  ├─ hooks/
│  ├─ pages/
│  ├─ routes/
│  ├─ supabase/
│  └─ model/
├─ .env
├─ netlify.toml
├─ package.json
└─ vite.config.js
```

## Environment Variables

### Local Development

Tambahkan file `.env` di root project:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Jika kamu ingin memanggil backend AI eksternal, tambahkan juga:

```env
VITE_AI_API_URL=https://your-ai-backend-url
```

### Netlify

Saat deploy ke Netlify, isi environment variables berikut di project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_AI_API_URL` opsional, kalau kamu ingin override endpoint AI

## Setup Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Jalankan frontend

```bash
npm run dev
```

Frontend akan berjalan di:

```text
http://localhost:3000
```

### 3. Build production

```bash
npm run build
```

Output build akan ada di folder `dist/`.

### 4. Preview build production

```bash
npm run preview
```

## AI / Model Workflow

> Catatan: saat ini sistem AI belum memakai model ML yang dilatih dengan proses training terpisah.  
> AI insight dibuat dari logika inference ringan berbasis data transaksi dan goals.

### Cara kerjanya

- Frontend mengirim data ringkasan ke endpoint AI
- Backend AI menghitung tren sederhana
- Hasil prediksi dikembalikan ke frontend dalam bentuk insight

### Endpoint AI

#### Dashboard

`POST /.netlify/functions/dashboard`

Payload:

```json
{
  "income": 56000000,
  "expense": 53250000,
  "active_goals": 1,
  "total_goals": 3,
  "expense_history": [2500000, 2900000, 3200000]
}
```

Response:

```json
{
  "prediction": 3400000,
  "prediction_message": "Prediksi pengeluaran bulan depan: Rp 3.400.000",
  "insights": [
    "Kamu sedang mengejar 1 target keuangan.",
    "Pengeluaranmu dalam kondisi stabil."
  ]
}
```

#### Track

`POST /.netlify/functions/track`

Payload:

```json
{
  "category_name": "Makanan",
  "category_history": [350000, 420000, 500000]
}
```

Response:

```json
{
  "prediction": 560000,
  "message": "Tren kenaikan pengeluaran terdeteksi pada Makanan."
}
```

## Integrasi Frontend ke AI

Dashboard dan Track memanggil AI endpoint secara otomatis.

### Dashboard

File:

```text
src/pages/Dashboard.jsx
```

Alurnya:

1. Ambil transaksi dan goals dari Supabase
2. Hitung:
   - income
   - expense
   - active goals
   - total goals
   - expense history
3. Kirim request ke endpoint AI
4. Tampilkan insight di UI

### Track

File:

```text
src/pages/ArthaTrack.jsx
```

Alurnya:

1. Ambil transaksi user dari Supabase
2. Kelompokkan pengeluaran per kategori
3. Kirim histori kategori ke endpoint AI
4. Tampilkan insight tren kategori

### Fallback jika AI tidak tersedia

Kalau AI endpoint tidak bisa diakses, aplikasi tetap menampilkan insight fallback lokal agar UI tetap berjalan.

## Deployment

### Netlify

Project ini bisa dideploy ke Netlify sebagai frontend + AI functions.

#### Build settings

- **Build command**:

```bash
npm run build
```

- **Publish directory**:

```text
dist
```

- **Functions directory**:

```text
netlify/functions
```

#### Deploy steps

1. Push project ke GitHub
2. Hubungkan repo ke Netlify
3. Set build settings di atas
4. Tambahkan environment variables
5. Deploy

### Deploy otomatis

Setiap push ke branch `main` akan memicu deploy otomatis jika repo sudah terhubung ke Netlify.

## Cara Menjalankan Sistem

### Mode development

```bash
npm run dev
```

### Mode production preview

```bash
npm run build
npm run preview
```

### Setelah deploy

- Buka URL Netlify
- Login dengan Supabase
- Buka Dashboard / Track / Goal / Report
- AI insight akan berjalan lewat Netlify Functions

## Data Flow

```text
User -> Frontend React -> Supabase Auth
User -> Frontend React -> Supabase Database
Frontend React -> Netlify Functions AI
Netlify Functions AI -> Frontend React
```

## Catatan Penting

- Aplikasi ini menggunakan environment variable `VITE_...` agar aman untuk frontend
- Kalau env Supabase belum diisi, aplikasi production tidak bisa login / fetch data
- AI backend sekarang tidak memakai Python lagi
- `src/model/` masih ada sebagai referensi logika lama, tetapi runtime production memakai Netlify Functions

## Checklist Quick Start

- [ ] Install dependency dengan `npm install`
- [ ] Isi `.env`
- [ ] Jalankan `npm run dev`
- [ ] Tes login dan dashboard
- [ ] Build dengan `npm run build`
- [ ] Push ke GitHub
- [ ] Deploy ke Netlify
- [ ] Tambahkan env variables di Netlify
