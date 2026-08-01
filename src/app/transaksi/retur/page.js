'use client'

import React, { useState } from 'react';
import { returns, getItemById, getUomById, getUserById, formatCurrency, formatDate, formatNumber } from '@/lib/dummy-data';
import Header from '@/components/layout/Header';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/ui/SearchBar';
import CustomSelect from '@/components/ui/CustomSelect';
import styles from './retur.module.css';

export default function ReturPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter logic
  const filteredReturns = returns.filter(ret => {
    const matchesSearch = ret.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ret.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || ret.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Summary
  const totalRetur = returns.length;
  const returPelanggan = returns.filter(r => r.type === 'customer').length;
  const returSupplier = returns.filter(r => r.type === 'supplier').length;
  const totalDraft = returns.filter(r => r.status === 'draft').length;

  const columns = [
    { key: 'id', label: 'No. Transaksi' },
    { key: 'date', label: 'Tanggal', render: (val) => formatDate(val) },
    { key: 'party', label: 'Pihak' },
    { key: 'type', label: 'Tipe', render: (val) => (
        <Badge variant={val === 'customer' ? 'info' : 'purple'}>
          {val === 'customer' ? 'Pelanggan' : 'Supplier'}
        </Badge>
      )
    },
    { key: 'reason', label: 'Alasan' },
    { key: 'status', label: 'Status', render: (val) => (
        <Badge variant={val === 'draft' ? 'warning' : 'success'}>
          {val === 'draft' ? 'Draft' : 'Final'}
        </Badge>
      )
    },
    { key: 'total', label: 'Total', render: (val) => formatCurrency(val) }
  ];

  return (
    <div className={styles.page}>
      <Header title="Retur Barang" subtitle="Kelola retur dan pengembalian barang" />

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{totalRetur}</div>
          <div className={styles.summaryLabel}>Total Retur</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{returPelanggan}</div>
          <div className={styles.summaryLabel}>Retur Pelanggan</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{returSupplier}</div>
          <div className={styles.summaryLabel}>Retur ke Supplier</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{totalDraft}</div>
          <div className={styles.summaryLabel}>Draft</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <SearchBar 
            placeholder="Cari transaksi, pihak..." 
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
          Tambah Retur
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredReturns} 
        onRowClick={(row) => setSelectedReturn(row)}
        emptyMessage="Tidak ada data retur yang ditemukan"
      />

      <Modal 
        isOpen={!!selectedReturn} 
        onClose={() => setSelectedReturn(null)}
        title="Detail Retur Barang"
        size="lg"
      >
        {selectedReturn && (
          <div>
            <div className={styles.detailHeader}>
              <div className={styles.detailGrid}>
                <div>
                  <div className={styles.detailLabel}>No. Transaksi</div>
                  <div className={styles.detailValue}>{selectedReturn.id}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Tanggal</div>
                  <div className={styles.detailValue}>{formatDate(selectedReturn.date)}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Pihak</div>
                  <div className={styles.detailValue}>{selectedReturn.party}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Tipe</div>
                  <div className={styles.detailValue}>
                    <Badge variant={selectedReturn.type === 'customer' ? 'info' : 'purple'}>
                      {selectedReturn.type === 'customer' ? 'Pelanggan' : 'Supplier'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #4CAF50' }}>
                <div className={styles.detailLabel}>Alasan Retur</div>
                <div style={{ fontSize: '0.9375rem', marginTop: '4px' }}>{selectedReturn.reason}</div>
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
                {selectedReturn.items.map((item, idx) => {
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
              Total: {formatCurrency(selectedReturn.total)}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Retur Baru"
        size="lg"
      >
        <div>
          <div className={styles.detailGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Pihak (Pelanggan/Supplier)</label>
              <input type="text" className={styles.formInput} placeholder="Nama pihak" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tipe Retur</label>
              <select className={styles.formInput}>
                <option value="customer">Dari Pelanggan</option>
                <option value="supplier">Ke Supplier</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Alasan</label>
            <textarea className={styles.formTextarea} placeholder="Alasan retur..."></textarea>
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
