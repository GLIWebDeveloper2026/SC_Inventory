'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import {
  items, categories, receipts, issues, returns, stockOpnames,
  getStockStatus, getCategoryById, getUomById, getItemById,
  formatCurrency, formatDate, formatNumber
} from '@/lib/dummy-data';
import styles from './laporan.module.css';

export default function LaporanPage() {
  const [activeReport, setActiveReport] = useState('stok');
  const [dateRange, setDateRange] = useState({ from: '2026-07-01', to: '2026-07-31' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = (type) => {
    alert(`Fitur export ${type} akan tersedia setelah backend terintegrasi`);
  };

  // ── Stok Report Data ─────────────────────────────────
  const filteredStok = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Transaksi Report Data (combined) ──────────────────
  const allTransactions = [
    ...receipts.map(r => ({ ...r, type: 'Penerimaan', party: r.supplier })),
    ...issues.map(i => ({ ...i, type: 'Pengeluaran', party: i.destination })),
    ...returns.map(r => ({ ...r, type: 'Retur', party: r.party })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredTransaksi = allTransactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Selisih Report Data ───────────────────────────────
  const allSelisih = stockOpnames.flatMap(op =>
    op.details.map(d => ({
      opnameId: op.id,
      date: op.date,
      ...d,
    }))
  );

  const filteredSelisih = allSelisih.filter(s => {
    const itemData = getItemById(s.itemId);
    return (
      s.opnameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (itemData?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Penerimaan': return 'success';
      case 'Pengeluaran': return 'warning';
      case 'Retur': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <>
      <Header title="Laporan" subtitle="Generate dan unduh laporan gudang" />
      <div className="pageContent">
        {/* ── Report Type Tabs ──────────────────────────── */}
        <div className={styles.tabs}>
          {[
            { key: 'stok', label: 'Laporan Stok' },
            { key: 'transaksi', label: 'Laporan Transaksi' },
            { key: 'selisih', label: 'Laporan Selisih' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeReport === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveReport(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Filters ──────────────────────────────────── */}
        <div className={styles.filterRow}>
          <div className={styles.dateGroup}>
            <span className={styles.dateLabel}>Dari:</span>
            <input
              type="date"
              className={styles.dateInput}
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </div>
          <div className={styles.dateGroup}>
            <span className={styles.dateLabel}>Sampai:</span>
            <input
              type="date"
              className={styles.dateInput}
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Cari..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ── Export Buttons ────────────────────────────── */}
        <div className={styles.exportRow}>
          <button className={`${styles.exportBtn} ${styles.exportBtnPdf}`} onClick={() => handleExport('PDF')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Export PDF
          </button>
          <button className={`${styles.exportBtn} ${styles.exportBtnExcel}`} onClick={() => handleExport('Excel')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>
            Export Excel
          </button>
          <button className={`${styles.exportBtn} ${styles.exportBtnCsv}`} onClick={() => handleExport('CSV')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>

        {/* ── Stok Report ──────────────────────────────── */}
        {activeReport === 'stok' && (
          <>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Min. Stok</th>
                  <th>Status</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                {filteredStok.map(item => {
                  const status = getStockStatus(item);
                  const category = getCategoryById(item.categoryId);
                  const uom = getUomById(item.baseUom);
                  return (
                    <tr key={item.id}>
                      <td className={styles.codeCell}>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{category?.name}</td>
                      <td>{formatNumber(item.stock)} {uom?.symbol}</td>
                      <td>{formatNumber(item.minStock)} {uom?.symbol}</td>
                      <td><Badge variant={status.variant}>{status.label}</Badge></td>
                      <td>{formatCurrency(item.stock * item.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredStok.length}</div>
                <div className={styles.summaryItemLabel}>Total Item</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{formatNumber(filteredStok.reduce((a, i) => a + i.stock, 0))}</div>
                <div className={styles.summaryItemLabel}>Total Stok</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{formatCurrency(filteredStok.reduce((a, i) => a + i.stock * i.price, 0))}</div>
                <div className={styles.summaryItemLabel}>Total Nilai Aset</div>
              </div>
            </div>
          </>
        )}

        {/* ── Transaksi Report ─────────────────────────── */}
        {activeReport === 'transaksi' && (
          <>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Tipe</th>
                  <th>Tanggal</th>
                  <th>Pihak</th>
                  <th>Status</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransaksi.map(t => (
                  <tr key={t.id}>
                    <td className={styles.codeCell}>{t.id}</td>
                    <td><Badge variant={getTypeBadge(t.type)}>{t.type}</Badge></td>
                    <td>{formatDate(t.date)}</td>
                    <td>{t.party}</td>
                    <td><Badge variant={t.status === 'final' ? 'success' : 'warning'}>{t.status === 'final' ? 'Final' : 'Draft'}</Badge></td>
                    <td>{formatCurrency(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredTransaksi.length}</div>
                <div className={styles.summaryItemLabel}>Total Transaksi</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredTransaksi.filter(t => t.type === 'Penerimaan').length}</div>
                <div className={styles.summaryItemLabel}>Penerimaan</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredTransaksi.filter(t => t.type === 'Pengeluaran').length}</div>
                <div className={styles.summaryItemLabel}>Pengeluaran</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredTransaksi.filter(t => t.type === 'Retur').length}</div>
                <div className={styles.summaryItemLabel}>Retur</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{formatCurrency(filteredTransaksi.reduce((a, t) => a + t.total, 0))}</div>
                <div className={styles.summaryItemLabel}>Total Nilai</div>
              </div>
            </div>
          </>
        )}

        {/* ── Selisih Report ──────────────────────────── */}
        {activeReport === 'selisih' && (
          <>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>Opname ID</th>
                  <th>Tanggal</th>
                  <th>Barang</th>
                  <th>Stok Sistem</th>
                  <th>Stok Fisik</th>
                  <th>Selisih</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {filteredSelisih.map((s, idx) => {
                  const itemData = getItemById(s.itemId);
                  return (
                    <tr key={idx}>
                      <td className={styles.codeCell}>{s.opnameId}</td>
                      <td>{formatDate(s.date)}</td>
                      <td>{itemData?.name || s.itemId}</td>
                      <td>{formatNumber(s.systemQty)}</td>
                      <td>{formatNumber(s.physicalQty)}</td>
                      <td className={s.diff < 0 ? styles.diffNeg : s.diff > 0 ? styles.diffPos : styles.diffZero}>
                        {s.diff > 0 ? '+' : ''}{formatNumber(s.diff)}
                      </td>
                      <td>{s.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredSelisih.length}</div>
                <div className={styles.summaryItemLabel}>Total Catatan</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredSelisih.filter(s => s.diff < 0).length}</div>
                <div className={styles.summaryItemLabel}>Item Kurang</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{filteredSelisih.filter(s => s.diff === 0).length}</div>
                <div className={styles.summaryItemLabel}>Item Sesuai</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemValue}>{formatNumber(filteredSelisih.reduce((a, s) => a + s.diff, 0))}</div>
                <div className={styles.summaryItemLabel}>Total Selisih</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
