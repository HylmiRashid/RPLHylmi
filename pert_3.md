**Tujuan:**
Aplikasi web pemantau keuangan dan stok barang untuk Usaha Mikro, Kecil, dan Menengah (UMKM/Warung). Membantu pemilik usaha mencatat pencatatan harian (pemasukan, pengeluaran, laba/rugi, dan stok produk) secara digital tanpa perhitungan manual di kertas.

**Tech Stack:**
* Frontend: React + TypeScript + Vite + Tailwind CSS
* Backend: Node.js + TypeScript + Express
* Database: Firebase Cloud Firestore (NoSQL Document Database)
* SDK Backend: Firebase Admin SDK
* API Style: REST API
* Environment: Pakai .env.example untuk kredensial Firebase Project (Project ID, Client Email, Private Key) dan JWT Secret.

**Aturan Kode (Code Rules):**
* Jangan tambahkan komentar kecuali jika benar-benar diperlukan.
* Gunakan PascalCase untuk semua nama class, type, interface, enum, komponen React, skema koleksi/dokumen Firestore, API DTO, dan nama properti JSON.
* Variabel lokal boleh menggunakan camelCase.
* Usahakan panjang baris kode di bawah 150 karakter.
* Gunakan struktur folder yang bersih dan sederhana.
* Implementasikan Autentikasi berbasis JWT (Register & Login).

**Entitas Utama (Koleksi & Dokumen Firestore):**

1. Users (Collection)
   * Id (UUID / Document ID)
   * Name (String)
   * StoreName (String)
   * Email (String, Unique)
   * PasswordHash (String)
   * CreatedAt (ISO String)

2. Products (Collection)
   * Id (UUID / Document ID)
   * UserId (String, relasi ke User)
   * Name (String)
   * Price (Number)
   * Stock (Number)
   * CreatedAt (ISO String)
   * UpdatedAt (ISO String)

3. Transactions (Collection)
   * Id (UUID / Document ID)
   * UserId (String, relasi ke User)
   * Type (Enum: INCOME, EXPENSE)
   * TotalAmount (Number)
   * Description (String, Opsional)
   * TransactionDate (ISO String)
   * CreatedAt (ISO String)
   * Items (Array of Object, khusus transaksi INCOME):
     * Id (String)
     * ProductId (String)
     * ProductName (String)
     * Quantity (Number)
     * PriceAtTransaction (Number)
     * Subtotal (Number)

**Aturan Database & Bisnis:**
* Semua data (Products, Transactions) WAJIB terisolasi secara ketat per UserId. Pengguna hanya bisa melihat dan mengedit datanya sendiri.
* Saat Transaksi bertipe INCOME dibuat, potong Stock dari Product terkait secara otomatis menggunakan transaksi atomic Firestore (runTransaction).
* Jika stok produk tidak mencukupi saat penjualan, kembalikan respon error HTTP 400.
* Sederhana: DILARANG membuat fitur multi-role, multi-cabang, utang-piutang, atau integrasi pembayaran online.

**Fitur Backend:**
1. Auth
   * Register (Name, StoreName, Email, Password).
   * Login (Email, Password) -> Mengembalikan token JWT.
2. CRUD Product
   * Tambah, lihat daftar, perbarui, dan hapus produk.
3. CRUD Transaction
   * Catat Pengeluaran: Butuh TotalAmount, Description, dan tanggal.
   * Catat Pemasukan (Penjualan): Butuh daftar item (ProductId, Quantity). Hitung TotalAmount di backend dan potong stok otomatis via Firestore Transaction.
   * Daftar transaksi (dengan filter rentang tanggal).
   * Hapus transaksi (jika transaksi pemasukan dihapus, kembalikan stok produk secara otomatis).
4. Dashboard API
   * Menerima query StartDate dan EndDate (default ke bulan berjalan).
   * Mengembalikan TotalIncome, TotalExpense, dan NetProfit.
5. Report API
   * Mengembalikan ringkasan data laba-rugi yang dikelompokkan berdasarkan periode (harian/bulanan).

**Halaman Frontend (Dilindungi Auth, kecuali Login/Register):**
1. Halaman Login & Register: Formulir sederhana untuk autentikasi.
2. Dashboard: Kartu ringkasan (Total Pemasukan, Total Pengeluaran, Laba/Rugi) dan Daftar transaksi terbaru.
3. Manajemen Produk: Tabel produk (Nama, Harga, Stok) dan Form tambah/edit produk.
4. Manajemen Transaksi: Tombol “Catat Pemasukan” (Pilih produk dan kuantitas), Tombol “Catat Pengeluaran” (Input nominal dan keterangan), dan Tabel riwayat transaksi.
5. Laporan Laba-Rugi: Tabel ringkasan perhitungan berkala (pemasukan dikurangi pengeluaran).

**Persyaratan UI & Desain:**
* Gunakan Bahasa Indonesia untuk semua label, tombol, pesan error, tabel, dan validasi.
* Desain yang bersih, responsif, dan ramah pengguna seluler (mobile-friendly).
* Gunakan warna status badge: Pemasukan (Hijau), Pengeluaran (Merah).
* Gunakan tabel sederhana, kartu (cards), badge, form, dan dialog konfirmasi sebelum menghapus data.
* Sediakan empty state pada tabel jika tidak ada data.
* TANPA grafik (charts) dan TANPA fitur ekspor PDF/Excel pada versi ini.

**Daftar Rute API (Endpoints):**
* POST /api/auth/register
* POST /api/auth/login
* GET /api/products
* POST /api/products
* PUT /api/products/:Id
* DELETE /api/products/:Id
* GET /api/transactions
* POST /api/transactions/income
* POST /api/transactions/expense
* DELETE /api/transactions/:Id
* GET /api/dashboard/summary
* GET /api/reports/profit-loss

**Hasil Akhir (Deliverables):**
* Kode sumber lengkap frontend dan backend.
* Konfigurasi & Struktur Firestore.
* File .env.example.
* README yang berisi panduan instalasi, konfigurasi Firebase Admin SDK, dan cara menjalankan aplikasi.
* Struktur Monorepo TypeScript dengan npm workspaces.