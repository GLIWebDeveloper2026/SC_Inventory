'use client'

import { useState } from 'react'
import { items, categories, uoms, getStockStatus, getCategoryById, getUomById, formatNumber, formatCurrency } from '@/lib/dummy-data'
import Header from '@/components/layout/Header'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import CustomSelect from '@/components/ui/CustomSelect'
import styles from './inventori.module.css'

export default function InventoriPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredItems = items.filter(item => {
    const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? item.categoryId === categoryFilter : true
    return matchesSearch && matchesCategory
  })

  const totalItems = items.length
  const stokAman = items.filter(item => item.stock >= item.minStock).length
  const stokRendah = items.filter(item => item.stock < item.minStock && item.stock > 0).length
  const stokKritis = items.filter(item => item.stock <= item.minStock * 0.5).length

  const columns = [
    { 
      header: 'Kode', 
      accessor: (item) => <span className={styles.codeCell}>{item.code}</span> 
    },
    { 
      header: 'Nama Barang', 
      accessor: 'name' 
    },
    { 
      header: 'Kategori', 
      accessor: (item) => {
        const category = getCategoryById(item.categoryId)
        return (
          <span>
            <span className={styles.categoryDot} style={{ backgroundColor: category?.color || '#ccc' }}></span>
            {category?.name}
          </span>
        )
      } 
    },
    { 
      header: 'Satuan', 
      accessor: (item) => getUomById(item.baseUom)?.symbol 
    },
    { 
      header: 'Stok', 
      accessor: (item) => formatNumber(item.stock) 
    },
    { 
      header: 'Min. Stok', 
      accessor: (item) => formatNumber(item.minStock) 
    },
    { 
      header: 'Harga', 
      accessor: (item) => formatCurrency(item.price) 
    },
    { 
      header: 'Lokasi', 
      accessor: 'location' 
    },
    { 
      header: 'Status', 
      accessor: (item) => {
        const status = getStockStatus(item)
        return <Badge variant={status.variant}>{status.label}</Badge>
      } 
    }
  ]

  return (
    <div className={styles.page}>
      <Header title="Manajemen Inventori" subtitle="Kelola master data barang gudang" />

      <div className={styles.summaryRow}>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>📦</div>
          <div>
            <div className={styles.miniCardValue}>{totalItems}</div>
            <div className={styles.miniCardLabel}>Total Barang</div>
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>✅</div>
          <div>
            <div className={styles.miniCardValue}>{stokAman}</div>
            <div className={styles.miniCardLabel}>Stok Aman</div>
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ backgroundColor: '#fff8e1', color: '#f57f17' }}>⚠️</div>
          <div>
            <div className={styles.miniCardValue}>{stokRendah}</div>
            <div className={styles.miniCardLabel}>Stok Rendah</div>
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ backgroundColor: '#ffebee', color: '#c62828' }}>🚨</div>
          <div>
            <div className={styles.miniCardValue}>{stokKritis}</div>
            <div className={styles.miniCardLabel}>Stok Kritis</div>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Cari kode atau nama barang..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CustomSelect
            options={[
              { value: '', label: 'Semua Kategori' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
          />
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <span>+</span> Tambah Barang
        </button>
      </div>

      <DataTable 
        data={filteredItems} 
        columns={columns} 
        onRowClick={(item) => setSelectedItem(item)} 
      />

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title="Detail Barang"
      >
        {selectedItem && (
          <div>
            <div className={styles.detailGrid}>
              <div className={styles.detailSection}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Kode Barang</div>
                  <div className={styles.detailValue}>{selectedItem.code}</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Nama Barang</div>
                  <div className={styles.detailValue}>{selectedItem.name}</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Kategori</div>
                  <div className={styles.detailValue}>
                    {getCategoryById(selectedItem.categoryId)?.name}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Harga</div>
                  <div className={styles.detailValue}>{formatCurrency(selectedItem.price)}</div>
                </div>
              </div>
              <div className={styles.detailSection}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Lokasi</div>
                  <div className={styles.detailValue}>
                    <Badge variant="default">{selectedItem.location}</Badge>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Stok Saat Ini</div>
                  <div className={styles.detailValue}>
                    {formatNumber(selectedItem.stock)} {getUomById(selectedItem.baseUom)?.symbol}
                  </div>
                  <div className={styles.stockBar}>
                    <div 
                      className={styles.stockBarFill} 
                      style={{ 
                        width: `${Math.min(100, (selectedItem.stock / Math.max(selectedItem.minStock * 2, 1)) * 100)}%`,
                        backgroundColor: selectedItem.stock < selectedItem.minStock ? '#f44336' : '#4CAF50'
                      }}
                    />
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Stok Minimum</div>
                  <div className={styles.detailValue}>
                    {formatNumber(selectedItem.minStock)} {getUomById(selectedItem.baseUom)?.symbol}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.actionRow}>
              <button className={styles.btnEdit} onClick={() => alert('Edit fitur UI only')}>Edit</button>
              <button className={styles.btnDelete} onClick={() => alert('Hapus fitur UI only')}>Hapus</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title="Tambah Barang Baru"
      >
        <div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Kode Barang</label>
              <input type="text" className={styles.formInput} placeholder="Masukkan kode" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nama Barang</label>
              <input type="text" className={styles.formInput} placeholder="Masukkan nama" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Kategori</label>
              <select className={styles.formInput}>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Satuan Dasar</label>
              <select className={styles.formInput}>
                {uoms.map(uom => (
                  <option key={uom.id} value={uom.id}>{uom.name} ({uom.symbol})</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stok Awal</label>
              <input type="number" className={styles.formInput} placeholder="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stok Minimum</label>
              <input type="number" className={styles.formInput} placeholder="0" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Harga</label>
              <input type="number" className={styles.formInput} placeholder="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Lokasi</label>
              <input type="text" className={styles.formInput} placeholder="Contoh: Rak A1" />
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
            <button className={styles.btnSave} onClick={() => setShowAddModal(false)}>Simpan</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
