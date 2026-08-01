# 🌾 Gudang Tani – Sistem Manajemen Inventori & Operasional Gudang
> **Koperasi Tani Mekar Jaya**

Aplikasi web modern berbasis **Next.js (App Router)** dan **InsForge (Backend-as-a-Service / PostgreSQL)** untuk mengelola operasional inventori gudang pertanian, penerimaan barang, pengeluaran, retur, barang konsinyasi, stock opname, serta pelaporan secara *real-time*.

---

## 🚀 Fitur Utama

- **📊 Dashboard & Analitik**:
  - Ringkasan total barang, total stok, nilai inventori, dan stok menipis.
  - Grafik pergerakan stok masuk vs keluar 7 hari terakhir (Chart.js).
  - Diagram lingkaran (doughnut) distribusi barang per kategori.
  - Peringatan stok kritis & lini masa aktivitas terkini (audit log).
- **📦 Manajemen Inventori**: Master data barang, filter kategori, status stok (Aman, Rendah, Kritis, Habis), serta modal detail & tambah/edit barang.
- **📥 Penerimaan Barang (Goods Receipt)**: Pencatatan barang masuk dari supplier dengan status Draft dan Finalisasi.
- **📤 Pengeluaran Barang (Goods Issue)**: Pencatatan barang keluar untuk distribusi/tujuan tertentu.
- **🔄 Retur Barang**: Manajemen pengembalian barang dari pelanggan maupun retur ke supplier.
- **🤝 Barang Konsinyasi**: Pengelolaan barang titipan pihak ketiga lengkap dengan visualisasi persentase barang terjual.
- **📋 Stock Opname**: Rekonsiliasi stok fisik gudang dengan stok sistem serta perhitungan selisih otomatis.
- **📈 Laporan & Eksport**: Laporan stok, transaksi, dan selisih opname dengan opsi ekspor PDF, Excel, dan CSV.
- **👥 Manajemen Pengguna & Role (RBAC)**: Autentikasi pengguna, manajemen hak akses (Administrator, Kepala Gudang, Admin Gudang, Manajer, Auditor).
- **🔔 Notifikasi & Pencarian Global**: Panel notifikasi *real-time* dan fitur cari barang/pengguna langsung di navbar.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), React 19
- **Styling**: Vanilla CSS Modules & CSS Custom Properties (Design Tokens)
- **Visualisasi Data**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
- **Backend (BaaS)**: [InsForge](https://insforge.dev/) (PostgreSQL, Auth, Realtime, Storage, RLS)
- **Client SDK**: `@insforge/sdk`

---

## 📋 Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem Anda sudah terinstal:
- **Node.js**: v18.17.0 atau versi lebih baru (Disarankan v20.x+)
- **npm**: v9.x atau versi lebih baru (bawaan Node.js)
- **Git**
- Akun **InsForge** (untuk koneksi backend/database)

---

## ⚙️ Panduan Instalasi & Memulai

Ikuti langkah-langkah berikut untuk menjalankan project di lingkungan lokal setelah melakukan `git clone`:

### 1. Clone Repository
```bash
git clone https://github.com/username-anda/gudang-tani.git
cd gudang-tani
```

### 2. Install Dependensi
Jalankan perintah berikut untuk memasang seluruh package yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Buat file `.env.local` di direktori utama (root) project dan tambahkan kredensial InsForge Anda:

```env
NEXT_PUBLIC_INSFORGE_URL=https://46vtc9zy.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=kredensial-anon-key-insforge-anda
```

### 4. Hubungkan dengan InsForge CLI (Opsional / Pengembang)
Jika Anda perlu mengelola skema database, RLS policies, atau migrasi via CLI:

```bash
# Login ke InsForge CLI menggunakan API Key Anda
npx @insforge/cli login --user-api-key <AKUN_API_KEY_ANDA>

# Link project lokal ke instance InsForge
npx @insforge/cli link --project-id 2e39286c-b49f-444a-8a51-cef25472001d
```

### 5. Jalankan Server Pengembang (Development Server)
Jalankan server lokal Next.js:

```bash
npm run dev
```

Buka browser Anda dan akses:
👉 **`http://localhost:3000`**

---

## 📜 Skrip Perintah yang Tersedia

Di dalam file `package.json`, Anda dapat menggunakan perintah berikut:

- `npm run dev`: Jalankan server pengembang Next.js di lingkungan lokal.
- `npm run build`: Membuat build produksi yang teroptimasi.
- `npm run start`: Jalankan server Next.js mode produksi hasil build.
- `npm run lint`: Menjalankan verifikasi sintaks & ESLint.

---

## 📁 Struktur Folder Project

```text
gudang-tani/
├── src/
│   ├── app/                    # Next.js App Router (Halaman & Server Actions)
│   │   ├── actions/            # Server Actions InsForge (CRUD, Auth, Reports)
│   │   ├── inventori/          # Halaman Manajemen Inventori
│   │   ├── konsinyasi/         # Halaman Barang Konsinyasi
│   │   ├── laporan/            # Halaman Pelaporan & Export
│   │   ├── login/              # Halaman Autentikasi / Login
│   │   ├── pengguna/           # Halaman Manajemen User & Role
│   │   ├── stock-opname/       # Halaman Verifikasi Stock Opname
│   │   ├── transaksi/          # Halaman Penerimaan, Pengeluaran & Retur
│   │   ├── globals.css         # Reset & Token Desain Global
│   │   ├── layout.js           # Layout Utama, Context Provider & Backdrop Mobile
│   │   └── page.js             # Halaman Utama (Dashboard Operasional)
│   ├── components/
│   │   ├── dashboard/          # Komponen Widget, Chart & Alert Dashboard
│   │   ├── layout/             # Header (Search, Notif, Profile) & Sidebar Responsive
│   │   └── ui/                 # CustomSelect, DataTable, Badge, Modal, SearchBar
│   ├── contexts/               # AuthContext untuk State Login & User
│   └── lib/                    # InsForge Client Config (`insforge.js`)
├── public/                     # Asset Statis (Favicon, Logo, Gambar)
├── .env.local                  # Environment Variable Kredensial lokal (abaikan dari git)
├── next.config.mjs             # Konfigurasi Next.js
├── package.json                # Dependencies & Skrip npm
└── README.md                   # Dokumentasi Instalasi & Penggunaan
```

---

## 💡 Catatan Penting untuk Pengembang (Windows OS)

- **Next.js & Webpack**: Jika Anda menjalankan di sistem operasi Windows dan mengalami kendala kompatibilitas SWC binary, dev server menggunakan flag `--webpack` (`next dev --webpack`) secara otomatis untuk menjamin stabilitas.
- **Clearing Cache**: Jika terjadi error chunk webpack saat pengembangan, cukup hapus direktori `.next` dan restart dev server:
  ```bash
  npx rimraf .next # atau rmdir /s /q .next di CMD
  npm run dev
  ```

---

## 📄 Lisensi & Hak Cipta

Dikembangkan untuk **Lomba Web Development Koperasi Tani Mekar Jaya**. Hak Cipta © 2026 Gudang Tani. Seluruh hak cipta dilindungi undang-undang.
