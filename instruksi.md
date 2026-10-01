# DagangTrack

Aplikasi web pemantau keuangan dan stok barang untuk UMKM/Warung. Pemilik usaha dapat mencatat pemasukan, pengeluaran,
mengelola stok produk, dan melihat laporan laba-rugi tanpa perhitungan manual.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + TypeScript + Express (REST API)
- Database: Firebase Cloud Firestore (lewat Firebase Admin SDK)
- Autentikasi: JWT
- Monorepo: npm workspaces (`backend`, `frontend`)

## Struktur Folder

```
dagangtrack/
├── .env.example
├── firestore.rules
├── package.json
├── backend/src/
│   ├── config/        Env dan koneksi Firestore
│   ├── middleware/    Auth JWT, async handler, error handler
│   ├── routes/        Auth, Product, Transaction, Dashboard, Report
│   ├── services/      Logika bisnis dan akses Firestore
│   ├── types/         Model dan DTO
│   └── utils/         Validasi, HttpError, rentang tanggal
└── frontend/src/
    ├── api/           Klien REST API
    ├── components/    Komponen UI (Modal, Badge, tabel, form)
    ├── context/       AuthContext
    ├── pages/         Login, Register, Dashboard, Produk, Transaksi, Laporan
    ├── types/
    └── utils/
```

## Prasyarat

- Node.js 18 atau lebih baru
- Akun Google dan sebuah Firebase Project

## Konfigurasi Firebase Admin SDK

1. Buka [Firebase Console](https://console.firebase.google.com) lalu buat project baru (atau pakai yang sudah ada).
2. Menu **Build > Firestore Database > Create database**, pilih mode **production** dan lokasi terdekat
   (misalnya `asia-southeast2` untuk Jakarta).
3. Buka **Project settings > Service accounts > Generate new private key**. File JSON akan terunduh.
4. Salin `.env.example` menjadi `.env` di root proyek, lalu isi dari file JSON tersebut:

   | Variabel di `.env`      | Field di file JSON |
   | ----------------------- | ------------------ |
   | `FIREBASE_PROJECT_ID`   | `project_id`       |
   | `FIREBASE_CLIENT_EMAIL` | `client_email`     |
   | `FIREBASE_PRIVATE_KEY`  | `private_key`      |

   `FIREBASE_PRIVATE_KEY` harus diapit tanda kutip ganda, dan karakter baris baru ditulis sebagai `\n`
   (sama seperti nilai di file JSON).
5. Isi `JWT_SECRET` dengan string acak yang panjang, misalnya hasil dari
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
6. Opsional: terapkan `firestore.rules` (menolak semua akses langsung dari klien) lewat tab **Rules** di Firestore.
   Backend memakai Admin SDK sehingga tidak terpengaruh aturan ini.

File kunci service account bersifat rahasia. Jangan di-commit ke Git.

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173 (permintaan `/api` otomatis diteruskan ke backend)

Perintah lain:

```bash
npm run dev:backend
npm run dev:frontend
npm run typecheck
npm run build
npm run start -w backend
```

## Struktur Firestore

Tiga koleksi tingkat atas. ID dokumen sama dengan field `Id` (UUID).

**Users**: `Id`, `Name`, `StoreName`, `Email` (unik, huruf kecil), `PasswordHash`, `CreatedAt`

**Products**: `Id`, `UserId`, `Name`, `Price`, `Stock`, `CreatedAt`, `UpdatedAt`

**Transactions**: `Id`, `UserId`, `Type` (`INCOME` | `EXPENSE`), `TotalAmount`, `Description`, `TransactionDate`, `CreatedAt`,
`Items[]` (`Id`, `ProductId`, `ProductName`, `Quantity`, `PriceAtTransaction`, `Subtotal`; kosong untuk `EXPENSE`)

Semua query Products dan Transactions selalu memakai `where("UserId", "==", userId)` sehingga data tiap pengguna terisolasi.
Filter rentang tanggal dan pengurutan dilakukan di memori setelah query per `UserId`, jadi tidak perlu membuat composite index.

## Aturan Bisnis

- Pemasukan: `TotalAmount` dihitung di backend dari harga produk saat ini. Stok dipotong atomik dengan `runTransaction`.
  Jika stok tidak cukup, API membalas HTTP 400.
- Menghapus transaksi pemasukan mengembalikan stok produk (selama produknya masih ada) dalam satu transaksi Firestore.
- Menghapus produk tidak menghapus riwayat transaksi, karena nama dan harga produk tersimpan di `Items`.

## Daftar Endpoint

Semua endpoint selain `/api/auth/*` membutuhkan header `Authorization: Bearer <Token>`.
Properti JSON memakai PascalCase.

| Method | Endpoint                      | Keterangan                                                                      |
| ------ | ----------------------------- | ------------------------------------------------------------------------------- |
| POST   | `/api/auth/register`          | Body: `Name`, `StoreName`, `Email`, `Password`. Mengembalikan `Token` dan `User` |
| POST   | `/api/auth/login`             | Body: `Email`, `Password`. Mengembalikan `Token` dan `User`                      |
| GET    | `/api/products`               | Daftar produk milik pengguna                                                    |
| POST   | `/api/products`               | Body: `Name`, `Price`, `Stock`                                                  |
| PUT    | `/api/products/:Id`           | Body: `Name`, `Price`, `Stock`                                                  |
| DELETE | `/api/products/:Id`           | Hapus produk                                                                    |
| GET    | `/api/transactions`           | Query opsional: `StartDate`, `EndDate` (YYYY-MM-DD), `Limit`                    |
| POST   | `/api/transactions/income`    | Body: `TransactionDate`, `Description`, `Items[{ ProductId, Quantity }]`        |
| POST   | `/api/transactions/expense`   | Body: `TransactionDate`, `Description`, `TotalAmount`                           |
| DELETE | `/api/transactions/:Id`       | Hapus transaksi (stok dikembalikan jika pemasukan)                              |
| GET    | `/api/dashboard/summary`      | Query: `StartDate`, `EndDate` (default bulan berjalan). Hasil: `TotalIncome`, `TotalExpense`, `NetProfit` |
| GET    | `/api/reports/profit-loss`    | Query: `StartDate`, `EndDate`, `GroupBy` (`daily` atau `monthly`)               |

Respons error berbentuk `{ "Message": "..." }` dalam Bahasa Indonesia.

## Catatan Zona Waktu

Tanggal transaksi disimpan sebagai ISO string pada pukul 00:00 UTC dari tanggal yang dipilih pengguna.
Pengelompokan laporan dan filter tanggal memakai bagian tanggal (`YYYY-MM-DD`) dari nilai tersebut,
sehingga hasilnya konsisten dengan tanggal yang diinput.
