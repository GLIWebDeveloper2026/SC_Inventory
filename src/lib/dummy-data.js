// ============================================================
// Gudang Tani – Dummy Data
// All data is hardcoded for frontend prototyping
// ============================================================

// ── Categories ──────────────────────────────────────────────
export const categories = [
  { id: 'CAT001', name: 'Beras & Padi', color: '#F9A825' },
  { id: 'CAT002', name: 'Pupuk', color: '#4CAF50' },
  { id: 'CAT003', name: 'Pestisida', color: '#E53935' },
  { id: 'CAT004', name: 'Benih & Bibit', color: '#1E88E5' },
  { id: 'CAT005', name: 'Alat Pertanian', color: '#8E24AA' },
  { id: 'CAT006', name: 'Hasil Panen', color: '#FF8F00' },
];

// ── Unit of Measure ─────────────────────────────────────────
export const uoms = [
  { id: 'UOM001', name: 'Kilogram', symbol: 'kg' },
  { id: 'UOM002', name: 'Ton', symbol: 'ton' },
  { id: 'UOM003', name: 'Liter', symbol: 'L' },
  { id: 'UOM004', name: 'Karung', symbol: 'krg' },
  { id: 'UOM005', name: 'Botol', symbol: 'btl' },
  { id: 'UOM006', name: 'Unit', symbol: 'unit' },
  { id: 'UOM007', name: 'Sak', symbol: 'sak' },
  { id: 'UOM008', name: 'Pack', symbol: 'pck' },
];

export const uomConversions = [
  { from: 'UOM002', to: 'UOM001', factor: 1000, itemId: null },
  { from: 'UOM004', to: 'UOM001', factor: 50, itemId: 'ITM001' },
  { from: 'UOM004', to: 'UOM001', factor: 25, itemId: 'ITM002' },
  { from: 'UOM007', to: 'UOM001', factor: 50, itemId: 'ITM005' },
  { from: 'UOM005', to: 'UOM003', factor: 1, itemId: 'ITM008' },
];

// ── Items ───────────────────────────────────────────────────
export const items = [
  { id: 'ITM001', code: 'BRS-001', name: 'Beras IR 64 Premium', categoryId: 'CAT001', baseUom: 'UOM001', stock: 12500, minStock: 5000, price: 12000, location: 'Rak A-01', status: 'active' },
  { id: 'ITM002', code: 'BRS-002', name: 'Beras Pandan Wangi', categoryId: 'CAT001', baseUom: 'UOM001', stock: 3200, minStock: 3000, price: 14500, location: 'Rak A-02', status: 'active' },
  { id: 'ITM003', code: 'BRS-003', name: 'Gabah Kering Giling', categoryId: 'CAT001', baseUom: 'UOM001', stock: 45000, minStock: 10000, price: 5500, location: 'Rak A-03', status: 'active' },
  { id: 'ITM004', code: 'PPK-001', name: 'Pupuk Urea Subsidi', categoryId: 'CAT002', baseUom: 'UOM001', stock: 8000, minStock: 5000, price: 2500, location: 'Rak B-01', status: 'active' },
  { id: 'ITM005', code: 'PPK-002', name: 'Pupuk NPK Phonska', categoryId: 'CAT002', baseUom: 'UOM001', stock: 2100, minStock: 3000, price: 3200, location: 'Rak B-02', status: 'active' },
  { id: 'ITM006', code: 'PPK-003', name: 'Pupuk Organik Granul', categoryId: 'CAT002', baseUom: 'UOM001', stock: 6500, minStock: 2000, price: 1800, location: 'Rak B-03', status: 'active' },
  { id: 'ITM007', code: 'PPK-004', name: 'Pupuk KCL', categoryId: 'CAT002', baseUom: 'UOM001', stock: 1200, minStock: 2000, price: 7500, location: 'Rak B-04', status: 'active' },
  { id: 'ITM008', code: 'PST-001', name: 'Herbisida Roundup', categoryId: 'CAT003', baseUom: 'UOM003', stock: 450, minStock: 200, price: 85000, location: 'Rak C-01', status: 'active' },
  { id: 'ITM009', code: 'PST-002', name: 'Insektisida Decis', categoryId: 'CAT003', baseUom: 'UOM003', stock: 120, minStock: 150, price: 125000, location: 'Rak C-02', status: 'active' },
  { id: 'ITM010', code: 'PST-003', name: 'Fungisida Dithane', categoryId: 'CAT003', baseUom: 'UOM001', stock: 380, minStock: 100, price: 95000, location: 'Rak C-03', status: 'active' },
  { id: 'ITM011', code: 'BNH-001', name: 'Benih Padi Ciherang', categoryId: 'CAT004', baseUom: 'UOM001', stock: 500, minStock: 300, price: 15000, location: 'Rak D-01', status: 'active' },
  { id: 'ITM012', code: 'BNH-002', name: 'Benih Jagung Hibrida', categoryId: 'CAT004', baseUom: 'UOM001', stock: 180, minStock: 200, price: 85000, location: 'Rak D-02', status: 'active' },
  { id: 'ITM013', code: 'BNH-003', name: 'Benih Kedelai', categoryId: 'CAT004', baseUom: 'UOM001', stock: 750, minStock: 200, price: 25000, location: 'Rak D-03', status: 'active' },
  { id: 'ITM014', code: 'ALT-001', name: 'Cangkul Baja', categoryId: 'CAT005', baseUom: 'UOM006', stock: 45, minStock: 20, price: 75000, location: 'Rak E-01', status: 'active' },
  { id: 'ITM015', code: 'ALT-002', name: 'Sprayer Manual 16L', categoryId: 'CAT005', baseUom: 'UOM006', stock: 12, minStock: 10, price: 350000, location: 'Rak E-02', status: 'active' },
  { id: 'ITM016', code: 'ALT-003', name: 'Sabit Stainless', categoryId: 'CAT005', baseUom: 'UOM006', stock: 8, minStock: 15, price: 45000, location: 'Rak E-03', status: 'active' },
  { id: 'ITM017', code: 'HSL-001', name: 'Jagung Pipil Kering', categoryId: 'CAT006', baseUom: 'UOM001', stock: 18000, minStock: 5000, price: 5800, location: 'Rak F-01', status: 'active' },
  { id: 'ITM018', code: 'HSL-002', name: 'Kedelai Lokal', categoryId: 'CAT006', baseUom: 'UOM001', stock: 4200, minStock: 2000, price: 11000, location: 'Rak F-02', status: 'active' },
  { id: 'ITM019', code: 'HSL-003', name: 'Kacang Tanah', categoryId: 'CAT006', baseUom: 'UOM001', stock: 2800, minStock: 1500, price: 28000, location: 'Rak F-03', status: 'active' },
  { id: 'ITM020', code: 'PPK-005', name: 'Pupuk ZA', categoryId: 'CAT002', baseUom: 'UOM001', stock: 950, minStock: 2000, price: 2200, location: 'Rak B-05', status: 'active' },
  { id: 'ITM021', code: 'BRS-004', name: 'Beras Merah Organik', categoryId: 'CAT001', baseUom: 'UOM001', stock: 800, minStock: 500, price: 22000, location: 'Rak A-04', status: 'active' },
  { id: 'ITM022', code: 'ALT-004', name: 'Terpal Plastik 4x6m', categoryId: 'CAT005', baseUom: 'UOM006', stock: 25, minStock: 10, price: 120000, location: 'Rak E-04', status: 'active' },
];

// ── Stock helper ────────────────────────────────────────────
export function getStockStatus(item) {
  if (item.stock <= 0) return { label: 'Habis', variant: 'danger' };
  if (item.stock < item.minStock * 0.5) return { label: 'Kritis', variant: 'danger' };
  if (item.stock < item.minStock) return { label: 'Rendah', variant: 'warning' };
  return { label: 'Aman', variant: 'success' };
}

export function getLowStockItems() {
  return items.filter(i => i.stock < i.minStock);
}

// ── Transactions ────────────────────────────────────────────
export const receipts = [
  { id: 'RCV-20260101-001', date: '2026-07-25', supplier: 'PT Pupuk Indonesia', status: 'final', total: 15000000, createdBy: 'USR002', notes: 'Pengiriman rutin pupuk subsidi',
    items: [
      { itemId: 'ITM004', qty: 3000, uom: 'UOM001', price: 2500, subtotal: 7500000 },
      { itemId: 'ITM005', qty: 2000, uom: 'UOM001', price: 3200, subtotal: 6400000 },
      { itemId: 'ITM020', qty: 500, uom: 'UOM001', price: 2200, subtotal: 1100000 },
    ]},
  { id: 'RCV-20260102-001', date: '2026-07-26', supplier: 'Petani Mitra Sukabumi', status: 'final', total: 67500000, createdBy: 'USR003', notes: 'Pembelian gabah musim tanam',
    items: [
      { itemId: 'ITM003', qty: 10000, uom: 'UOM001', price: 5500, subtotal: 55000000 },
      { itemId: 'ITM001', qty: 1000, uom: 'UOM001', price: 12500, subtotal: 12500000 },
    ]},
  { id: 'RCV-20260103-001', date: '2026-07-27', supplier: 'CV Benih Unggul', status: 'final', total: 11750000, createdBy: 'USR002', notes: 'Restock benih musim tanam',
    items: [
      { itemId: 'ITM011', qty: 200, uom: 'UOM001', price: 15000, subtotal: 3000000 },
      { itemId: 'ITM012', qty: 50, uom: 'UOM001', price: 85000, subtotal: 4250000 },
      { itemId: 'ITM013', qty: 180, uom: 'UOM001', price: 25000, subtotal: 4500000 },
    ]},
  { id: 'RCV-20260104-001', date: '2026-07-28', supplier: 'UD Agro Makmur', status: 'draft', total: 8400000, createdBy: 'USR003', notes: 'PO alat pertanian',
    items: [
      { itemId: 'ITM014', qty: 20, uom: 'UOM006', price: 75000, subtotal: 1500000 },
      { itemId: 'ITM015', qty: 5, uom: 'UOM006', price: 350000, subtotal: 1750000 },
      { itemId: 'ITM016', qty: 15, uom: 'UOM006', price: 45000, subtotal: 675000 },
      { itemId: 'ITM022', qty: 10, uom: 'UOM006', price: 120000, subtotal: 1200000 },
    ]},
  { id: 'RCV-20260105-001', date: '2026-07-29', supplier: 'PT Syngenta Indonesia', status: 'final', total: 22350000, createdBy: 'USR002', notes: 'Pestisida dan herbisida',
    items: [
      { itemId: 'ITM008', qty: 100, uom: 'UOM003', price: 85000, subtotal: 8500000 },
      { itemId: 'ITM009', qty: 50, uom: 'UOM003', price: 125000, subtotal: 6250000 },
      { itemId: 'ITM010', qty: 80, uom: 'UOM001', price: 95000, subtotal: 7600000 },
    ]},
  { id: 'RCV-20260106-001', date: '2026-07-30', supplier: 'Koperasi Tani Jaya', status: 'final', total: 34500000, createdBy: 'USR003', notes: 'Beras dari koperasi mitra',
    items: [
      { itemId: 'ITM002', qty: 1500, uom: 'UOM001', price: 14500, subtotal: 21750000 },
      { itemId: 'ITM021', qty: 400, uom: 'UOM001', price: 22000, subtotal: 8800000 },
    ]},
  { id: 'RCV-20260107-001', date: '2026-07-31', supplier: 'PT Petrokimia Gresik', status: 'draft', total: 12800000, createdBy: 'USR002', notes: 'Pupuk NPK dan KCL',
    items: [
      { itemId: 'ITM005', qty: 2500, uom: 'UOM001', price: 3200, subtotal: 8000000 },
      { itemId: 'ITM007', qty: 640, uom: 'UOM001', price: 7500, subtotal: 4800000 },
    ]},
];

export const issues = [
  { id: 'ISS-20260101-001', date: '2026-07-25', destination: 'Toko Tani Makmur', status: 'final', total: 18000000, createdBy: 'USR003', notes: 'Pengiriman pesanan reguler',
    items: [
      { itemId: 'ITM001', qty: 1000, uom: 'UOM001', price: 12000, subtotal: 12000000 },
      { itemId: 'ITM004', qty: 500, uom: 'UOM001', price: 2500, subtotal: 1250000 },
      { itemId: 'ITM017', qty: 800, uom: 'UOM001', price: 5800, subtotal: 4640000 },
    ]},
  { id: 'ISS-20260102-001', date: '2026-07-26', destination: 'Kelompok Tani Maju', status: 'final', total: 9750000, createdBy: 'USR003', notes: 'Program distribusi pupuk',
    items: [
      { itemId: 'ITM004', qty: 1500, uom: 'UOM001', price: 2500, subtotal: 3750000 },
      { itemId: 'ITM005', qty: 500, uom: 'UOM001', price: 3200, subtotal: 1600000 },
      { itemId: 'ITM006', qty: 1000, uom: 'UOM001', price: 1800, subtotal: 1800000 },
    ]},
  { id: 'ISS-20260103-001', date: '2026-07-27', destination: 'CV Agro Jaya', status: 'final', total: 32500000, createdBy: 'USR002', notes: 'Kontrak penjualan beras',
    items: [
      { itemId: 'ITM001', qty: 2000, uom: 'UOM001', price: 12000, subtotal: 24000000 },
      { itemId: 'ITM002', qty: 500, uom: 'UOM001', price: 14500, subtotal: 7250000 },
    ]},
  { id: 'ISS-20260104-001', date: '2026-07-29', destination: 'Pasar Induk Kramat Jati', status: 'final', total: 15400000, createdBy: 'USR003', notes: 'Kirim hasil panen',
    items: [
      { itemId: 'ITM017', qty: 1500, uom: 'UOM001', price: 5800, subtotal: 8700000 },
      { itemId: 'ITM018', qty: 500, uom: 'UOM001', price: 11000, subtotal: 5500000 },
    ]},
  { id: 'ISS-20260105-001', date: '2026-07-30', destination: 'UD Sarana Tani', status: 'draft', total: 7500000, createdBy: 'USR002', notes: 'Pending approval',
    items: [
      { itemId: 'ITM011', qty: 100, uom: 'UOM001', price: 15000, subtotal: 1500000 },
      { itemId: 'ITM012', qty: 30, uom: 'UOM001', price: 85000, subtotal: 2550000 },
      { itemId: 'ITM008', qty: 40, uom: 'UOM003', price: 85000, subtotal: 3400000 },
    ]},
];

export const returns = [
  { id: 'RTN-20260101-001', date: '2026-07-26', party: 'Toko Tani Makmur', type: 'customer', reason: 'Kemasan rusak saat pengiriman', status: 'final', total: 600000, createdBy: 'USR003',
    items: [
      { itemId: 'ITM001', qty: 50, uom: 'UOM001', price: 12000, subtotal: 600000 },
    ]},
  { id: 'RTN-20260102-001', date: '2026-07-28', party: 'PT Pupuk Indonesia', type: 'supplier', reason: 'Pupuk kadaluarsa', status: 'final', total: 1600000, createdBy: 'USR002',
    items: [
      { itemId: 'ITM005', qty: 500, uom: 'UOM001', price: 3200, subtotal: 1600000 },
    ]},
  { id: 'RTN-20260103-001', date: '2026-07-30', party: 'Kelompok Tani Maju', type: 'customer', reason: 'Salah kirim jenis pupuk', status: 'draft', total: 3600000, createdBy: 'USR003',
    items: [
      { itemId: 'ITM006', qty: 2000, uom: 'UOM001', price: 1800, subtotal: 3600000 },
    ]},
];

// ── Consignments ────────────────────────────────────────────
export const consignments = [
  { id: 'CON-001', owner: 'PT Beras Nusantara', startDate: '2026-06-01', endDate: '2026-08-31', status: 'active', notes: 'Titipan beras premium untuk distribusi',
    items: [
      { itemId: 'ITM001', qty: 5000, uom: 'UOM001', sold: 3200, remaining: 1800 },
      { itemId: 'ITM002', qty: 2000, uom: 'UOM001', sold: 800, remaining: 1200 },
    ]},
  { id: 'CON-002', owner: 'CV Pupuk Makmur', startDate: '2026-05-15', endDate: '2026-07-15', status: 'completed', notes: 'Konsinyasi pupuk organik',
    items: [
      { itemId: 'ITM006', qty: 3000, uom: 'UOM001', sold: 3000, remaining: 0 },
    ]},
  { id: 'CON-003', owner: 'UD Benih Sejahtera', startDate: '2026-07-01', endDate: '2026-09-30', status: 'active', notes: 'Titipan benih untuk musim tanam',
    items: [
      { itemId: 'ITM011', qty: 300, uom: 'UOM001', sold: 50, remaining: 250 },
      { itemId: 'ITM013', qty: 500, uom: 'UOM001', sold: 120, remaining: 380 },
    ]},
  { id: 'CON-004', owner: 'PT Agro Kimia', startDate: '2026-07-10', endDate: '2026-10-10', status: 'active', notes: 'Pestisida konsinyasi',
    items: [
      { itemId: 'ITM008', qty: 200, uom: 'UOM003', sold: 45, remaining: 155 },
      { itemId: 'ITM010', qty: 150, uom: 'UOM001', sold: 20, remaining: 130 },
    ]},
  { id: 'CON-005', owner: 'Koperasi Tani Sentosa', startDate: '2026-06-20', endDate: '2026-07-20', status: 'withdrawn', notes: 'Ditarik kembali oleh pemilik',
    items: [
      { itemId: 'ITM019', qty: 1000, uom: 'UOM001', sold: 200, remaining: 800 },
    ]},
];

// ── Stock Opname ────────────────────────────────────────────
export const stockOpnames = [
  { id: 'SOP-20260701-001', date: '2026-07-15', status: 'completed', auditor: 'USR005', notes: 'Stock opname rutin bulanan',
    details: [
      { itemId: 'ITM001', systemQty: 12800, physicalQty: 12500, diff: -300, reason: 'Susut alami' },
      { itemId: 'ITM002', systemQty: 3250, physicalQty: 3200, diff: -50, reason: 'Penyusutan' },
      { itemId: 'ITM004', systemQty: 8100, physicalQty: 8000, diff: -100, reason: 'Selisih timbangan' },
      { itemId: 'ITM017', systemQty: 18200, physicalQty: 18000, diff: -200, reason: 'Susut gudang' },
    ]},
  { id: 'SOP-20260702-001', date: '2026-07-25', status: 'completed', auditor: 'USR005', notes: 'Verifikasi stok pupuk',
    details: [
      { itemId: 'ITM005', systemQty: 2200, physicalQty: 2100, diff: -100, reason: 'Kemasan bocor' },
      { itemId: 'ITM006', systemQty: 6500, physicalQty: 6500, diff: 0, reason: '-' },
      { itemId: 'ITM007', systemQty: 1250, physicalQty: 1200, diff: -50, reason: 'Susut' },
      { itemId: 'ITM020', systemQty: 1000, physicalQty: 950, diff: -50, reason: 'Tercecer' },
    ]},
  { id: 'SOP-20260703-001', date: '2026-07-31', status: 'in_progress', auditor: 'USR005', notes: 'Opname pestisida dan alat',
    details: [
      { itemId: 'ITM008', systemQty: 460, physicalQty: 450, diff: -10, reason: 'Pending verifikasi' },
      { itemId: 'ITM009', systemQty: 125, physicalQty: 120, diff: -5, reason: 'Pending verifikasi' },
      { itemId: 'ITM014', systemQty: 46, physicalQty: 45, diff: -1, reason: 'Pending verifikasi' },
    ]},
];

// ── Users ───────────────────────────────────────────────────
export const roles = [
  { id: 'ROLE001', name: 'Administrator', description: 'Akses penuh ke semua fitur sistem', color: '#E53935' },
  { id: 'ROLE002', name: 'Kepala Gudang', description: 'Mengelola operasional gudang dan approval', color: '#1E88E5' },
  { id: 'ROLE003', name: 'Admin Gudang', description: 'Operasional harian gudang', color: '#43A047' },
  { id: 'ROLE004', name: 'Manajer', description: 'Monitoring dan laporan', color: '#FB8C00' },
  { id: 'ROLE005', name: 'Auditor', description: 'Audit dan stock opname', color: '#8E24AA' },
];

export const users = [
  { id: 'USR001', name: 'Budi Santoso', email: 'budi@gudangtani.id', roleId: 'ROLE001', status: 'active', lastLogin: '2026-08-01 09:30', phone: '0812-3456-7890' },
  { id: 'USR002', name: 'Siti Rahayu', email: 'siti@gudangtani.id', roleId: 'ROLE002', status: 'active', lastLogin: '2026-08-01 08:45', phone: '0813-4567-8901' },
  { id: 'USR003', name: 'Ahmad Hidayat', email: 'ahmad@gudangtani.id', roleId: 'ROLE003', status: 'active', lastLogin: '2026-08-01 10:00', phone: '0815-6789-0123' },
  { id: 'USR004', name: 'Dewi Lestari', email: 'dewi@gudangtani.id', roleId: 'ROLE004', status: 'active', lastLogin: '2026-07-31 16:20', phone: '0817-8901-2345' },
  { id: 'USR005', name: 'Rizki Pratama', email: 'rizki@gudangtani.id', roleId: 'ROLE005', status: 'active', lastLogin: '2026-07-31 14:00', phone: '0819-0123-4567' },
  { id: 'USR006', name: 'Rina Wulandari', email: 'rina@gudangtani.id', roleId: 'ROLE003', status: 'active', lastLogin: '2026-07-30 09:15', phone: '0821-2345-6789' },
  { id: 'USR007', name: 'Hendra Kusuma', email: 'hendra@gudangtani.id', roleId: 'ROLE003', status: 'inactive', lastLogin: '2026-07-15 11:00', phone: '0822-3456-7890' },
  { id: 'USR008', name: 'Lia Permata', email: 'lia@gudangtani.id', roleId: 'ROLE004', status: 'active', lastLogin: '2026-07-29 10:30', phone: '0823-4567-8901' },
];

// ── Stock Movement (30 days) ────────────────────────────────
export const stockMovements = [
  { date: '2026-07-01', incoming: 2400, outgoing: 1800 },
  { date: '2026-07-02', incoming: 3100, outgoing: 2200 },
  { date: '2026-07-03', incoming: 1800, outgoing: 2600 },
  { date: '2026-07-04', incoming: 2900, outgoing: 1500 },
  { date: '2026-07-05', incoming: 350, outgoing: 200 },
  { date: '2026-07-06', incoming: 180, outgoing: 120 },
  { date: '2026-07-07', incoming: 2700, outgoing: 2100 },
  { date: '2026-07-08', incoming: 3500, outgoing: 1900 },
  { date: '2026-07-09', incoming: 2200, outgoing: 2800 },
  { date: '2026-07-10', incoming: 4100, outgoing: 2400 },
  { date: '2026-07-11', incoming: 2800, outgoing: 3200 },
  { date: '2026-07-12', incoming: 420, outgoing: 280 },
  { date: '2026-07-13', incoming: 150, outgoing: 90 },
  { date: '2026-07-14', incoming: 3200, outgoing: 2700 },
  { date: '2026-07-15', incoming: 2600, outgoing: 1800 },
  { date: '2026-07-16', incoming: 1900, outgoing: 2300 },
  { date: '2026-07-17', incoming: 3800, outgoing: 2100 },
  { date: '2026-07-18', incoming: 2500, outgoing: 2900 },
  { date: '2026-07-19', incoming: 300, outgoing: 180 },
  { date: '2026-07-20', incoming: 210, outgoing: 140 },
  { date: '2026-07-21', incoming: 2900, outgoing: 2000 },
  { date: '2026-07-22', incoming: 3400, outgoing: 2600 },
  { date: '2026-07-23', incoming: 2100, outgoing: 2400 },
  { date: '2026-07-24', incoming: 3700, outgoing: 1700 },
  { date: '2026-07-25', incoming: 4200, outgoing: 3100 },
  { date: '2026-07-26', incoming: 480, outgoing: 350 },
  { date: '2026-07-27', incoming: 220, outgoing: 160 },
  { date: '2026-07-28', incoming: 3100, outgoing: 2500 },
  { date: '2026-07-29', incoming: 2800, outgoing: 3300 },
  { date: '2026-07-30', incoming: 3600, outgoing: 2200 },
  { date: '2026-07-31', incoming: 2400, outgoing: 1900 },
];

// ── Notifications ───────────────────────────────────────────
export const notifications = [
  { id: 'NTF001', type: 'warning', title: 'Stok Rendah: Pupuk NPK Phonska', message: 'Stok saat ini 2.100 kg, di bawah minimum 3.000 kg', date: '2026-08-01 09:00', read: false },
  { id: 'NTF002', type: 'warning', title: 'Stok Rendah: Insektisida Decis', message: 'Stok saat ini 120 L, di bawah minimum 150 L', date: '2026-08-01 09:00', read: false },
  { id: 'NTF003', type: 'warning', title: 'Stok Rendah: Pupuk KCL', message: 'Stok saat ini 1.200 kg, di bawah minimum 2.000 kg', date: '2026-08-01 09:00', read: false },
  { id: 'NTF004', type: 'info', title: 'Draft Penerimaan Baru', message: 'RCV-20260107-001 menunggu finalisasi', date: '2026-07-31 15:30', read: true },
  { id: 'NTF005', type: 'success', title: 'Stock Opname Selesai', message: 'SOP-20260702-001 verifikasi pupuk telah selesai', date: '2026-07-25 17:00', read: true },
  { id: 'NTF006', type: 'warning', title: 'Stok Rendah: Benih Jagung Hibrida', message: 'Stok saat ini 180 kg, di bawah minimum 200 kg', date: '2026-08-01 09:00', read: false },
  { id: 'NTF007', type: 'info', title: 'Konsinyasi Akan Berakhir', message: 'CON-001 dari PT Beras Nusantara berakhir 31 Agustus 2026', date: '2026-07-31 08:00', read: true },
  { id: 'NTF008', type: 'warning', title: 'Stok Rendah: Sabit Stainless', message: 'Stok saat ini 8 unit, di bawah minimum 15 unit', date: '2026-08-01 09:00', read: false },
  { id: 'NTF009', type: 'warning', title: 'Stok Rendah: Pupuk ZA', message: 'Stok saat ini 950 kg, di bawah minimum 2.000 kg', date: '2026-08-01 09:00', read: false },
];

// ── Audit Trail ─────────────────────────────────────────────
export const auditLogs = [
  { id: 'AUD001', action: 'CREATE', module: 'Penerimaan', detail: 'Membuat penerimaan RCV-20260107-001', userId: 'USR002', timestamp: '2026-07-31 15:25' },
  { id: 'AUD002', action: 'UPDATE', module: 'Inventori', detail: 'Update stok Beras IR 64 Premium (+1000 kg)', userId: 'USR003', timestamp: '2026-07-31 14:10' },
  { id: 'AUD003', action: 'FINALIZE', module: 'Penerimaan', detail: 'Finalisasi RCV-20260106-001', userId: 'USR002', timestamp: '2026-07-30 16:45' },
  { id: 'AUD004', action: 'CREATE', module: 'Pengeluaran', detail: 'Membuat pengeluaran ISS-20260105-001', userId: 'USR002', timestamp: '2026-07-30 11:20' },
  { id: 'AUD005', action: 'FINALIZE', module: 'Stock Opname', detail: 'Finalisasi SOP-20260702-001', userId: 'USR005', timestamp: '2026-07-25 17:00' },
  { id: 'AUD006', action: 'CREATE', module: 'Konsinyasi', detail: 'Membuat konsinyasi CON-004', userId: 'USR002', timestamp: '2026-07-10 09:30' },
  { id: 'AUD007', action: 'UPDATE', module: 'Pengguna', detail: 'Nonaktifkan user Hendra Kusuma', userId: 'USR001', timestamp: '2026-07-15 11:30' },
  { id: 'AUD008', action: 'CREATE', module: 'Retur', detail: 'Membuat retur RTN-20260103-001', userId: 'USR003', timestamp: '2026-07-30 10:00' },
];

// ── Dashboard summary helpers ───────────────────────────────
export function getDashboardStats() {
  const totalItems = items.length;
  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const totalValue = items.reduce((s, i) => s + (i.stock * i.price), 0);
  const lowStockCount = getLowStockItems().length;
  const todayTransactions = 5;
  const pendingReceipts = receipts.filter(r => r.status === 'draft').length;
  return { totalItems, totalStock, totalValue, lowStockCount, todayTransactions, pendingReceipts };
}

export function getCategoryDistribution() {
  return categories.map(cat => ({
    ...cat,
    count: items.filter(i => i.categoryId === cat.id).length,
    totalStock: items.filter(i => i.categoryId === cat.id).reduce((s, i) => s + i.stock, 0),
  }));
}

// ── Formatting helpers ──────────────────────────────────────
export function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getItemById(id) {
  return items.find(i => i.id === id);
}

export function getUserById(id) {
  return users.find(u => u.id === id);
}

export function getRoleById(id) {
  return roles.find(r => r.id === id);
}

export function getCategoryById(id) {
  return categories.find(c => c.id === id);
}

export function getUomById(id) {
  return uoms.find(u => u.id === id);
}
