'use client'

import { useState, useEffect } from 'react'
import { getItems, createItem, updateItem, deleteItem } from '@/app/actions/items'
import { getCategories } from '@/app/actions/categories'
import { getUoms } from '@/app/actions/uoms'
import Header from '@/components/layout/Header'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import CustomSelect from '@/components/ui/CustomSelect'
import styles from './inventori.module.css'

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0)
const formatCurrency = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0)
const getStockStatus = (item) => {
  if (Number(item.stock) <= 0) return { label: 'Habis', variant: 'danger' }
  if (Number(item.stock) < Number(item.min_stock)) return { label: 'Rendah', variant: 'warning' }
  return { label: 'Aman', variant: 'success' }
}

export default function InventoriPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [uoms, setUoms] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    code: '', name: '', categoryId: '', baseUom: '', stock: 0, minStock: 0, price: 0, location: ''
  })

  async function loadData() {
    setLoading(true)
    try {
      const [itemsResult, catsResult, uomsResult] = await Promise.all([
        getItems(), getCategories(), getUoms()
      ])
      console.log('[Inventori] getCategories result:', catsResult)
      console.log('[Inventori] getUoms result:', uomsResult)
      const itemsData = itemsResult?.data || itemsResult || []
      const catsData = catsResult?.data || catsResult || []
      const uomsData = uomsResult?.data || uomsResult || []
      setItems(Array.isArray(itemsData) ? itemsData : [])
      setCategories(Array.isArray(catsData) ? catsData : [])
      setUoms(Array.isArray(uomsData) ? uomsData : [])
      console.log('[Inventori] categories loaded:', catsData?.length, 'uoms loaded:', uomsData?.length)
    } catch (err) {
      console.error('Gagal memuat data inventori:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? item.category_id === categoryFilter : true
    return matchesSearch && matchesCategory
  })

  const totalItems = items.length
  const stokAman = items.filter(item => Number(item.stock) >= Number(item.min_stock)).length
  const stokRendah = items.filter(item => Number(item.stock) < Number(item.min_stock) && Number(item.stock) > 0).length
  const stokKritis = items.filter(item => Number(item.stock) <= Number(item.min_stock) * 0.5).length

  const handleSaveAdd = async () => {
    const result = await createItem(formData)
    if (result?.error) {
      console.error('Gagal menambahkan barang:', result.error)
      alert('Gagal menambahkan barang: ' + result.error)
      return
    }
    setShowAddModal(false)
    setFormData({ code: '', name: '', categoryId: '', baseUom: '', stock: 0, minStock: 0, price: 0, location: '' })
    loadData()
  }

  const handleEdit = async () => {
    if (selectedItem) {
      await updateItem(selectedItem.id, selectedItem)
      setSelectedItem(null)
      loadData()
    }
  }

  const handleDelete = async () => {
    if (selectedItem) {
      await deleteItem(selectedItem.id)
      setSelectedItem(null)
      loadData()
    }
  }

  const columns = [
    { 
      label: 'Kode', 
      render: (item) => <span className={styles.codeCell}>{item.code}</span> 
    },
    { 
      label: 'Nama Barang', 
      key: 'name' 
    },
    { 
      label: 'Kategori', 
      render: (item) => {
        return (
          <span>
            <span className={styles.categoryDot} style={{ backgroundColor: item.categories?.color || '#ccc' }}></span>
            {item.categories?.name || '-'}
          </span>
        )
      } 
    },
    { 
      label: 'Satuan', 
      render: (item) => item.uoms?.symbol || '-'
    },
    { 
      label: 'Stok', 
      render: (item) => formatNumber(item.stock) 
    },
    { 
      label: 'Min. Stok', 
      render: (item) => formatNumber(item.min_stock) 
    },
    { 
      label: 'Harga', 
      render: (item) => formatCurrency(item.price) 
    },
    { 
      label: 'Lokasi', 
      key: 'location' 
    },
    { 
      label: 'Status', 
      render: (item) => {
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
            <div className={styles.miniCardValue}>{loading ? '...' : totalItems}</div>
            <div className={styles.miniCardLabel}>Total Barang</div>
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>✅</div>
          <div>
            <div className={styles.miniCardValue}>{loading ? '...' : stokAman}</div>
            <div className={styles.miniCardLabel}>Stok Aman</div>
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ backgroundColor: '#fff8e1', color: '#f57f17' }}>⚠️</div>
          <div>
            <div className={styles.miniCardValue}>{loading ? '...' : stokRendah}</div>
            <div className={styles.miniCardLabel}>Stok Rendah</div>
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ backgroundColor: '#ffebee', color: '#c62828' }}>🚨</div>
          <div>
            <div className={styles.miniCardValue}>{loading ? '...' : stokKritis}</div>
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

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7c6b' }}>Memuat data barang...</div>
      ) : (
        <DataTable 
          data={filteredItems} 
          columns={columns} 
          onRowClick={(item) => setSelectedItem(item)} 
        />
      )}

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
                    {selectedItem.categories?.name}
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
                    {formatNumber(selectedItem.stock)} {selectedItem.uoms?.symbol}
                  </div>
                  <div className={styles.stockBar}>
                    <div 
                      className={styles.stockBarFill} 
                      style={{ 
                        width: `${Math.min(100, (selectedItem.stock / Math.max(selectedItem.min_stock * 2, 1)) * 100)}%`,
                        backgroundColor: selectedItem.stock < selectedItem.min_stock ? '#f44336' : '#4CAF50'
                      }}
                    />
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Stok Minimum</div>
                  <div className={styles.detailValue}>
                    {formatNumber(selectedItem.min_stock)} {selectedItem.uoms?.symbol}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.actionRow}>
              <button className={styles.btnEdit} onClick={handleEdit}>Edit</button>
              <button className={styles.btnDelete} onClick={handleDelete}>Hapus</button>
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
              <input type="text" className={styles.formInput} placeholder="Masukkan kode" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nama Barang</label>
              <input type="text" className={styles.formInput} placeholder="Masukkan nama" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Kategori</label>
              <select className={styles.formInput} value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Satuan Dasar</label>
              <select className={styles.formInput} value={formData.baseUom} onChange={(e) => setFormData({...formData, baseUom: e.target.value})}>
                <option value="">Pilih Satuan</option>
                {uoms.map(uom => (
                  <option key={uom.id} value={uom.id}>{uom.name} ({uom.symbol})</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stok Awal</label>
              <input type="number" className={styles.formInput} placeholder="0" min="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stok Minimum</label>
              <input type="number" className={styles.formInput} placeholder="0" min="0" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Harga</label>
              <input type="number" className={styles.formInput} placeholder="0" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Lokasi</label>
              <input type="text" className={styles.formInput} placeholder="Contoh: Rak A1" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
            <button className={styles.btnSave} onClick={handleSaveAdd}>Simpan</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
