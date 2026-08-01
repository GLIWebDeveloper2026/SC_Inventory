'use client'

import React, { useState, useEffect } from 'react';
import { getReturns, createReturn, finalizeReturn, deleteReturn } from '@/app/actions/returns';
import { getItems } from '@/app/actions/items';
import Header from '@/components/layout/Header';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/ui/SearchBar';
import CustomSelect from '@/components/ui/CustomSelect';
import styles from './retur.module.css';

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);
const formatCurrency = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('id-ID') : '-';

export default function ReturPage() {
  const [returnsList, setReturnsList] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ party: '', type: 'customer', reason: '', date: '', notes: '' });
  const [formItems, setFormItems] = useState([{ item_id: '', qty: 0, price: 0 }]);

  async function loadData() {
    setLoading(true);
    const [returnsRes, itemsRes] = await Promise.all([
      getReturns(),
      getItems()
    ]);
    setReturnsList(returnsRes?.data || []);
    setItems(itemsRes?.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  const filteredReturns = returnsList.filter(ret => {
    const matchesSearch = ret.return_code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ret.party?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || ret.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Summary
  const totalRetur = returnsList.length;
  const returPelanggan = returnsList.filter(r => r.type === 'customer').length;
  const returSupplier = returnsList.filter(r => r.type === 'supplier').length;
  const totalDraft = returnsList.filter(r => r.status === 'draft').length;

  const handleCreate = async (status) => {
    const payload = {
      ...formData,
      status,
      return_items: formItems.map(item => ({
        item_id: item.item_id,
        qty: Number(item.qty),
        price: Number(item.price)
      }))
    };
    await createReturn(payload);
    setIsAddModalOpen(false);
    setFormData({ party: '', type: 'customer', reason: '', date: '', notes: '' });
    setFormItems([{ item_id: '', qty: 0, price: 0 }]);
    loadData();
  };

  const handleFinalize = async (id) => {
    await finalizeReturn(id);
    setSelectedReturn(null);
    loadData();
  };

  const columns = [
    { key: 'return_code', label: 'No. Transaksi' },
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
          <div className={styles.summaryValue}>{loading ? '...' : totalRetur}</div>
          <div className={styles.summaryLabel}>Total Retur</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{loading ? '...' : returPelanggan}</div>
          <div className={styles.summaryLabel}>Retur Pelanggan</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{loading ? '...' : returSupplier}</div>
          <div className={styles.summaryLabel}>Retur ke Supplier</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{loading ? '...' : totalDraft}</div>
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

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7c6b' }}>Memuat data retur...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredReturns} 
          onRowClick={(row) => setSelectedReturn(row)}
          emptyMessage="Tidak ada data retur yang ditemukan"
        />
      )}

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
                  <div className={styles.detailValue}>{selectedReturn.return_code}</div>
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
                  <th style={{ padding: '8px' }}>Harga</th>
                  <th style={{ padding: '8px' }}>Subtotal</th>
                  <th style={{ padding: '8px' }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {(selectedReturn.return_items || []).map((item, idx) => {
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
              Total: {formatCurrency(selectedReturn.total)}
            </div>
            {selectedReturn.status === 'draft' && (
               <div style={{ marginTop: '20px', textAlign: 'right' }}>
                 <button className={styles.btnFinalize} onClick={() => handleFinalize(selectedReturn.id)}>
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
        title="Tambah Retur Baru"
        size="lg"
      >
        <div>
          <div className={styles.detailGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Pihak (Pelanggan/Supplier)</label>
              <input type="text" className={styles.formInput} placeholder="Nama pihak" value={formData.party} onChange={e => setFormData({...formData, party: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tipe Retur</label>
              <select className={styles.formInput} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="customer">Dari Pelanggan</option>
                <option value="supplier">Ke Supplier</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tanggal</label>
              <input type="date" className={styles.formInput} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Alasan</label>
            <textarea className={styles.formTextarea} placeholder="Alasan retur..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
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
