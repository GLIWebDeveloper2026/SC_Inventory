'use client'

import React, { useState } from 'react';
import { issues, getItemById, getUomById, getUserById, formatCurrency, formatDate, formatNumber } from '@/lib/dummy-data';
import Header from '@/components/layout/Header';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/ui/SearchBar';
import CustomSelect from '@/components/ui/CustomSelect';
import styles from './pengeluaran.module.css';

export default function PengeluaranPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || issue.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Summary
  const totalPengeluaran = issues.length;
  const nilaiTotal = issues.reduce((sum, i) => sum + i.total, 0);
  const totalDraft = issues.filter(i => i.status === 'draft').length;
  const totalFinal = issues.filter(i => i.status === 'final').length;

  const columns = [
    { key: 'id', label: 'No. Transaksi' },
    { key: 'date', label: 'Tanggal', render: (val) => formatDate(val) },
    { key: 'destination', label: 'Tujuan' },
    { key: 'status', label: 'Status', render: (val) => (
        <Badge variant={val === 'draft' ? 'warning' : 'success'}>
          {val === 'draft' ? 'Draft' : 'Final'}
        </Badge>
      )
    },
    { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
    { key: 'createdBy', label: 'Dibuat Oleh', render: (val) => getUserById(val)?.name || 'Unknown' }
  ];

  return (
    <div className={styles.page}>
      <Header title="Pengeluaran Barang" subtitle="Kelola pengeluaran barang keluar gudang" />

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{totalPengeluaran}</div>
          <div className={styles.summaryLabel}>Total Pengeluaran</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{formatCurrency(nilaiTotal)}</div>
          <div className={styles.summaryLabel}>Nilai Total</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{totalDraft}</div>
          <div className={styles.summaryLabel}>Draft</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{totalFinal}</div>
          <div className={styles.summaryLabel}>Final</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <SearchBar 
            placeholder="Cari transaksi, tujuan..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <CustomSelect
            options={[
              { value: 'Semua', label: 'Semua Status' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Final', label: 'Final' }
            ]}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
          />
        </div>
        <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Tambah Pengeluaran
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredIssues} 
        onRowClick={(row) => setSelectedIssue(row)}
        emptyMessage="Tidak ada data pengeluaran yang ditemukan"
      />

      <Modal 
        isOpen={!!selectedIssue} 
        onClose={() => setSelectedIssue(null)}
        title="Detail Pengeluaran Barang"
        size="lg"
      >
        {selectedIssue && (
          <div>
            <div className={styles.detailHeader}>
              <div className={styles.detailGrid}>
                <div>
                  <div className={styles.detailLabel}>No. Transaksi</div>
                  <div className={styles.detailValue}>{selectedIssue.id}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Tanggal</div>
                  <div className={styles.detailValue}>{formatDate(selectedIssue.date)}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Tujuan</div>
                  <div className={styles.detailValue}>{selectedIssue.destination}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Status</div>
                  <div className={styles.detailValue}>
                    <Badge variant={selectedIssue.status === 'draft' ? 'warning' : 'success'}>
                      {selectedIssue.status === 'draft' ? 'Draft' : 'Final'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Barang</th>
                  <th style={{ padding: '8px' }}>Qty</th>
                  <th style={{ padding: '8px' }}>UOM</th>
                  <th style={{ padding: '8px' }}>Harga</th>
                  <th style={{ padding: '8px' }}>Subtotal</th>
                  <th style={{ padding: '8px' }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {selectedIssue.items.map((item, idx) => {
                  const itemData = getItemById(item.itemId);
                  const uomData = itemData ? getUomById(itemData.uomId) : null;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{itemData?.name || 'Unknown'}</td>
                      <td style={{ padding: '8px' }}>{formatNumber(item.qty)}</td>
                      <td style={{ padding: '8px' }}>{uomData?.symbol || ''}</td>
                      <td style={{ padding: '8px' }}>{formatCurrency(item.price)}</td>
                      <td style={{ padding: '8px' }}>{formatCurrency(item.subtotal)}</td>
                      <td style={{ padding: '8px' }}>{item.notes || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold' }}>
              Total: {formatCurrency(selectedIssue.total)}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Pengeluaran Baru"
        size="lg"
      >
        <div>
          <div className={styles.detailGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tujuan</label>
              <input type="text" className={styles.formInput} placeholder="Tujuan pengeluaran" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tanggal</label>
              <input type="date" className={styles.formInput} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Catatan</label>
            <textarea className={styles.formTextarea} placeholder="Catatan tambahan..."></textarea>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label className={styles.formLabel}>Daftar Barang</label>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Barang</th>
                  <th style={{ padding: '8px' }}>Qty</th>
                  <th style={{ padding: '8px' }}>UOM</th>
                  <th style={{ padding: '8px' }}>Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px' }}><select className={styles.formInput}><option>Pilih barang...</option></select></td>
                  <td style={{ padding: '8px' }}><input type="number" className={styles.formInput} placeholder="0" /></td>
                  <td style={{ padding: '8px' }}><input type="text" className={styles.formInput} placeholder="Kg" readOnly style={{backgroundColor: '#f5f5f5'}} /></td>
                  <td style={{ padding: '8px' }}><input type="number" className={styles.formInput} placeholder="0" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.formActions}>
            <button className={styles.btnDraft} onClick={() => setIsAddModalOpen(false)}>Simpan as Draft</button>
            <button className={styles.btnFinalize} onClick={() => setIsAddModalOpen(false)}>Finalisasi</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
