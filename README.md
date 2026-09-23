Tema-Tema website yang ingin saya buat:

1. **DagangTrack**
    DagangTrack adalah sebuah web app yang digunakan untuk memonitoring keuangan para UMKM, seperti menghitung pemasukan, pengeluaran, laba, dan profit dari UMKM tersebut secara otomatis.

    Masalah yang akan diselesaikan : Banyak pedagang yang kecil dan menengah (seperti warung, toko, kelontong, pedagang kaki lima, dan pedagang pasar) yang masih mencatat transaksi keuangan secara manual di buku mereka. Akibatnya, mereka kesulitan mengetahui kondisi keuangan usaha secara akurat seperti keuntungan mereka berapa?, kerugian mereka berapa?, uang keluarnya kemana?, dan juga bagaimana kondisi stok barang?, sehingga keputusan bisnis tersebut sering diambil berdasarkan perkiraan, bukan data melalui data yang jelas dan akurat. Jadi, disini DagangTrack dapat membuat mereka mengetahui pemasukan, pengeluaran, kerugian, keuntungan, dan ketersedian barang dagangan mereka hitung atau cek secara manual.

    Profil Target Pengguna : 
    1) Pedagang kecil-menengah (pemilik warung, toko kelontong, UMKM) yang menjual barang secara   langsung
    2) Pedagang yang mengelola usaha nya sendiri (tanpa karyawan)
    3) Para pedagang pemula (baru mulai berdagang)

    Manfaat Web app : 
    1) Membantu pedagang mencatat transaksi keuangan dengan cepat dan terstruktur
    2) Memberikan gambaran laba-rugi usaha secara otomatis tanpa perlu hitung manual
    3) Membantu memantau kondisi stok barang secara real-time
    4) Meningkatkan kualitas pengambilan keputusan bisnis berdasarkan data yang tercatat

    Daftar Fitur Inti : 
    1) Login dan Register
    2) CRUD transaksi (pemasukan & pengeluaran)
    3) CRUD data produk/stok sederhana (nama, jumlah, harga)
    4) Dashboard ringkasan: total pemasukan, pengeluaran, laba/rugi (harian/bulanan)
    5) Laporan laba-rugi sederhana (tabel/list per periode)

    Fitur yang Tidak Dikerjakan : 
    1) Multi-role/multi-user (kasir, karyawan dengan hak akses berbeda)
    2) Multi-cabang/multi-toko
    3) Export laporan ke PDF/Excel
    4) Notifikasi otomatis (stok menipis, dll)
    5) Fitur utang-piutang
    6) Integrasi pembayaran online/payment gateway
    7) Grafik visualisasi tren penjualan (kecuali waktu tersisa memungkinkan)

    Kriteria Web app Dinyatakan Berhasil : 
    1) User dapat registrasi/login dan mengelola datanya sendiri
    2) User dapat mencatat transaksi pemasukan dan pengeluaran, tersimpan dengan benar di database
    3) Stok produk otomatis berkurang saat ada transaksi penjualan tercatat
    4) Dashboard menampilkan ringkasan laba-rugi yang perhitungannya akurat sesuai data transaksi yang ada
    5) Tidak ada bug kritis yang membuat data hilang/salah hitung saat demo

Tugas Pert 3 : 

Build a simple full-stack web application named **DagangTrack**.

Purpose:
A financial and inventory monitoring web application for micro, small, and medium enterprises (MSMEs/UMKM). It helps small business owners (warung, stalls, beginner merchants) easily track daily income, expenses, profit/loss, and product stock without manual paper calculations.

Use this stack:
* Frontend: React + TypeScript + Vite + Tailwind CSS
* Backend: Node.js + TypeScript + Express
* Database: MySQL
* ORM: Prisma
* API style: REST API
* Use Docker Compose for MySQL
* Use `.env.example` for database URL and JWT Secret

Code rules:
* Do not add comments unless truly necessary.
* Use PascalCase for all classes, types, interfaces, enums, React components, database models, API DTOs, and JSON property names.
* Local variables may use camelCase.
* Keep code lines below 150 characters where practical.
* Use a clean and simple folder structure.
* Implement a simple JWT-based Authentication (Register & Login). 

Main entities (Prisma Models):

1. User
   * Id (UUID)
   * Name
   * StoreName
   * Email (Unique)
   * PasswordHash
   * CreatedAt

2. Product
   * Id (UUID)
   * UserId (Relation to User)
   * Name
   * Price (Decimal or Int)
   * Stock (Int)
   * CreatedAt
   * UpdatedAt

3. Transaction
   * Id (UUID)
   * UserId (Relation to User)
   * Type (Enum: INCOME, EXPENSE)
   * TotalAmount (Decimal or Int)
   * Description (String, Optional)
   * TransactionDate (DateTime)
   * CreatedAt

4. TransactionItem (Only for INCOME transactions involving products)
   * Id (UUID)
   * TransactionId (Relation to Transaction)
   * ProductId (Relation to Product)
   * Quantity (Int)
   * PriceAtTransaction (Decimal or Int)
   * Subtotal (Decimal or Int)

Database & Business Rules:
* All data (Products, Transactions) MUST be strictly isolated per `UserId`. A user can only see and modify their own data.
* When a Transaction with Type `INCOME` and `TransactionItem`s is created, automatically deduct the `Stock` of the related `Product`s within a database transaction.
* If a product stock is insufficient during a sale, return a 400 error.
* Keep it simple: Do NOT build multi-role features, multi-branch, debt-tracking (utang-piutang), or online payment integrations.

Backend features:
1. Auth
   * Register (Name, StoreName, Email, Password).
   * Login (Email, Password) -> Returns JWT.
2. CRUD Product
   * Create, list, update, delete products.
3. CRUD Transaction
   * Create Expense: Requires amount, description, and date.
   * Create Income (Sale): Requires list of items (ProductId, Quantity). Calculate TotalAmount in backend and deduct stock automatically.
   * List transactions (with filters for date range).
   * Delete transaction (if an income transaction is deleted, revert/add back the product stock).
4. Dashboard API
   * Accept `startDate` and `endDate` queries (defaults to current month).
   * Return total income, total expense, and net profit.
5. Report API
   * Return a summary list/table of profit-loss grouped by period (daily/monthly).

Frontend pages (Protected by Auth, except Login/Register):
1. Login & Register Page
   * Simple forms for authentication.
2. Dashboard
   * Summary cards: Total Pemasukan, Total Pengeluaran, Laba/Rugi.
   * Recent transactions list.
3. Manajemen Produk (Product Management)
   * Table of products showing Name, Price, and Stock.
   * Form to add/edit products.
4. Manajemen Transaksi (Transaction Management)
   * Button to "Catat Pemasukan" (Record Sale) -> Select products and quantities.
   * Button to "Catat Pengeluaran" (Record Expense) -> Input amount and description.
   * Table history of transactions.
5. Laporan Laba-Rugi (Profit/Loss Report)
   * Simple data table showing periodic calculation of income minus expense.

UI requirements:
* Use INDONESIAN language for all labels, buttons, messages, tables, and validations.
* Create a clean, responsive, mobile-friendly dashboard (since MSME owners often use phones/tablets).
* Use status badge colors: Income (Green), Expense (Red).
* Use simple tables, cards, badges, forms, and confirmation dialogs before delete.
* Empty states for tables with no data.
* NO charts in this version. NO export to PDF/Excel.

Required API routes:
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

Deliverables:
* Complete frontend and backend source code.
* Prisma schema.
* Docker Compose file for MySQL.
* `.env.example`.
* README with installation, database migration, and run instructions.

Project structure:
* Use a TypeScript monorepo with npm workspaces.