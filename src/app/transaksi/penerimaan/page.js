'use client'

import React, { useState, useEffect } from 'react';
import { getReceipts, createReceipt, finalizeReceipt, deleteReceipt } from '@/app/actions/receipts';
import { getItems } from '@/app/actions/items';
import Header from '@/components/layout/Header';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/ui/SearchBar';
import CustomSelect from '@/components/ui/CustomSelect';
import styles from './penerimaan.module.css';

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);
const formatCurrency = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('id-ID') : '-';

export default function PenerimaanPage() {
  const [receipts, setReceipts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ supplier: '', date: '', notes: '' });
  const [formItems, setFormItems] = useState([{ item_id: '', qty: 0, price: 0 }]);

  async function loadData() {
    setLoading(true);
    const [receiptsRes, itemsRes] = await Promise.all([
      getReceipts(),
      getItems()
    ]);
    setReceipts(receiptsRes?.data || []);
    setItems(itemsRes?.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receipt_code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          receipt.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || receipt.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Summary
  const totalPenerimaan = receipts.length;
  const nilaiTotal = receipts.reduce((sum, r) => sum + (r.total || 0), 0);
  const totalDraft = receipts.filter(r => r.status === 'draft').length;
  const totalFinal = receipts.filter(r => r.status === 'final').length;

  const handleCreate = async (status) => {
    const payload = {
      ...formData,
      status,
      receipt_items: formItems.map(item => ({
        item_id: item.item_id,
        qty: Number(item.qty),
        price: Number(item.price)
      }))
    };
    await createReceipt(payload);
    setIsAddModalOpen(false);
    setFormData({ supplier: '', date: '', notes: '' });
    setFormItems([{ item_id: '', qty: 0, price: 0 }]);
    loadData();
  };

  const handleFinalize = async (id) => {
    await finalizeReceipt(id);
    setSelectedReceipt(null);
    loadData();
  };

  const columns = [
    { key: 'receipt_code', label: 'No. Transaksi' },
    { key: 'date', label: 'Tanggal', render: (val) => formatDate(val) },
    { key: 'supplier', label: 'Supplier' },
    { key: 'status', label: 'Status', render: (val) => (
        <Badge variant={val === 'draft' ? 'warning' : 'success'}>
          {val === 'draft' ? 'Draft' : 'Final'}
        </Badge>
      )
    },
    { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
    { key: 'created_by', label: 'Dibuat Oleh', render: (val, row) => row.users?.name || 'Tidak diketahui' }
  ];

  return (
    <div className={styles.page}>
      <Header title="Penerimaan Barang" subtitle="Kelola penerimaan barang masuk gudang" />

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{loading ? '...' : totalPenerimaan}</div>
          <div className={styles.summaryLabel}>Total Penerimaan</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{loading ? '...' : formatCurrency(nilaiTotal)}</div>
          <div className={styles.summaryLabel}>Nilai Total</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{loading ? '...' : totalDraft}</div>
          <div className={styles.summaryLabel}>Draft</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{loading ? '...' : totalFinal}</div>
          <div className={styles.summaryLabel}>Final</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <SearchBar 
            placeholder="Cari transaksi, supplier..." 
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
          Tambah Penerimaan
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7c6b' }}>Memuat data penerimaan...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredReceipts} 
          onRowClick={(row) => setSelectedReceipt(row)}
          emptyMessage="Tidak ada data penerimaan yang ditemukan"
        />
      )}

      <Modal 
        isOpen={!!selectedReceipt} 
        onClose={() => setSelectedReceipt(null)}
        title="Detail Penerimaan Barang"
        size="lg"
      >
        {selectedReceipt && (
          <div>
            <div className={styles.detailHeader}>
              <div className={styles.detailGrid}>
                <div>
                  <div className={styles.detailLabel}>No. Transaksi</div>
                  <div className={styles.detailValue}>{selectedReceipt.receipt_code}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Tanggal</div>
                  <div className={styles.detailValue}>{formatDate(selectedReceipt.date)}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Supplier</div>
                  <div className={styles.detailValue}>{selectedReceipt.supplier}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Status</div>
                  <div className={styles.detailValue}>
                    <Badge variant={selectedReceipt.status === 'draft' ? 'warning' : 'success'}>
                      {selectedReceipt.status === 'draft' ? 'Draft' : 'Final'}
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
                  <th style={{ padding: '8px' }}>Harga</th>
                  <th style={{ padding: '8px' }}>Subtotal</th>
                  <th style={{ padding: '8px' }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {(selectedReceipt.receipt_items || []).map((item, idx) => {
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{item.items?.name || 'Tidak diketahui'}</td>
                      <td style={{ padding: '8px' }}>{formatNumber(item.qty)}</td>
                      <td style={{ padding: '8px' }}>{formatCurrency(item.price)}</td>
                      <td style={{ padding: '8px' }}>{formatCurrency((item.qty || 0) * (item.price || 0))}</td>
                      <td style={{ padding: '8px' }}>{item.notes || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold' }}>
              Total: {formatCurrency(selectedReceipt.total)}
            </div>
            {selectedReceipt.status === 'draft' && (
               <div style={{ marginTop: '20px', textAlign: 'right' }}>
                 <button className={styles.btnFinalize} onClick={() => handleFinalize(selectedReceipt.id)}>
                   Finalisasi Transaksi
                 </button>
               </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Penerimaan Baru"
        size="lg"
      >
        <div>
          <div className={styles.detailGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Supplier</label>
              <input type="text" className={styles.formInput} placeholder="Nama supplier" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tanggal</label>
              <input type="date" className={styles.formInput} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Catatan</label>
            <textarea className={styles.formTextarea} placeholder="Catatan tambahan..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label className={styles.formLabel}>Daftar Barang</label>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Barang</th>
                  <th style={{ padding: '8px' }}>Qty</th>
                  <th style={{ padding: '8px' }}>Harga</th>
                </tr>
              </thead>
              <tbody>
                {formItems.map((fi, i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px' }}>
                      <select className={styles.formInput} value={fi.item_id} onChange={e => {
                        const newItems = [...formItems];
                        newItems[i].item_id = e.target.value;
                        setFormItems(newItems);
                      }}>
                        <option value="">Pilih barang...</option>
                        {items.map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '8px' }}><input type="number" className={styles.formInput} placeholder="0" value={fi.qty} onChange={e => {
                        const newItems = [...formItems];
                        newItems[i].qty = e.target.value;
                        setFormItems(newItems);
                      }} /></td>
                    <td style={{ padding: '8px' }}><input type="number" className={styles.formInput} placeholder="0" value={fi.price} onChange={e => {
                        const newItems = [...formItems];
                        newItems[i].price = e.target.value;
                        setFormItems(newItems);
                      }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={() => setFormItems([...formItems, { item_id: '', qty: 0, price: 0 }])} style={{ marginTop: '8px', padding: '4px 8px' }}>+ Tambah Baris</button>
          </div>

          <div className={styles.formActions}>
            <button className={styles.btnDraft} onClick={() => handleCreate('draft')}>Simpan as Draft</button>
            <button className={styles.btnFinalize} onClick={() => handleCreate('final')}>Finalisasi</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
