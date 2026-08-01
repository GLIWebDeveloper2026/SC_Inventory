'use client'

import { useState, useEffect } from 'react'
import { getConsignments, createConsignment, updateConsignmentStatus } from '@/app/actions/consignments'
import Header from '@/components/layout/Header'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import CustomSelect from '@/components/ui/CustomSelect'
import styles from './konsinyasi.module.css'

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0)
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export default function KonsinyasiPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedConsignment, setSelectedConsignment] = useState(null)
  const [consignments, setConsignments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchConsignments = async () => {
    setLoading(true)
    try {
      const res = await getConsignments()
      if (res?.data) {
        setConsignments(res.data)
      }
    } catch (error) {
      console.error('Error fetching consignments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConsignments()
  }, [])

  const filteredConsignments = consignments.filter(con => {
    const matchesSearch = (con.consignment_code || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (con.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? con.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  const totalConsignments = consignments.length
  const activeCount = consignments.filter(c => c.status === 'active').length
  const completedCount = consignments.filter(c => c.status === 'completed').length
  const withdrawnCount = consignments.filter(c => c.status === 'withdrawn').length

  const getStatusProps = (status) => {
    switch(status) {
      case 'active': return { label: 'Aktif', variant: 'success' }
      case 'completed': return { label: 'Selesai', variant: 'info' }
      case 'withdrawn': return { label: 'Ditarik', variant: 'warning' }
      default: return { label: status || 'Tidak diketahui', variant: 'default' }
    }
  }

  const handleUpdateStatus = async (id, newStatus) => {
    await updateConsignmentStatus(id, newStatus)
    fetchConsignments()
    setSelectedConsignment(null)
  }

  return (
    <div className={styles.page}>
      <Header title="Barang Titipan" subtitle="Kelola barang konsinyasi dari pihak ketiga" />

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{totalConsignments}</div>
          <div className={styles.summaryLabel}>Total Konsinyasi</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{activeCount}</div>
          <div className={styles.summaryLabel}>Aktif</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{completedCount}</div>
          <div className={styles.summaryLabel}>Selesai</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{withdrawnCount}</div>
          <div className={styles.summaryLabel}>Ditarik</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Cari ID atau nama pemilik..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CustomSelect
          options={[
            { value: '', label: 'Semua Status' },
            { value: 'active', label: 'Aktif' },
            { value: 'completed', label: 'Selesai' },
            { value: 'withdrawn', label: 'Ditarik' }
          ]}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
        />
      </div>

      {loading ? (
        <div className={styles.emptyState}>Memuat data...</div>
      ) : filteredConsignments.length > 0 ? (
        <div className={styles.cardGrid}>
          {filteredConsignments.map(con => {
            const statusProps = getStatusProps(con.status)
            return (
              <div key={con.id} className={styles.conCard} onClick={() => setSelectedConsignment(con)}>
                <div className={styles.conCardHeader}>
                  <div className={styles.conId}>{con.consignment_code}</div>
                  <Badge variant={statusProps.variant}>{statusProps.label}</Badge>
                </div>
                <div className={styles.conOwner}>{con.owner_name}</div>
                <div className={styles.conDates}>
                  📅 {formatDate(con.start_date)} - {formatDate(con.end_date)}
                </div>
                
                <div className={styles.conItems}>
                  {(con.consignment_items || []).map((item, idx) => {
                    const percentSold = (item.sold_qty / item.received_qty) * 100
                    return (
                      <div key={idx} className={styles.conItemRow}>
                        <div className={styles.conItemName}>{item.items?.name || 'Barang'}</div>
                        <div className={styles.conItemProgress}>
                          <div className={styles.progressText}>{item.sold_qty || 0}/{item.received_qty || 0}</div>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill} 
                              style={{ width: `${Math.min(100, percentSold || 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {con.notes && <div className={styles.conNotes}>{con.notes}</div>}
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <div className={styles.emptyText}>Tidak ada konsinyasi ditemukan</div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedConsignment} 
        onClose={() => setSelectedConsignment(null)} 
        title={`Detail Konsinyasi: ${selectedConsignment?.consignment_code || ''}`}
      >
        {selectedConsignment && (
          <div>
            <div className={styles.detailGrid}>
              <div>
                <div className={styles.detailLabel}>Pemilik</div>
                <div className={styles.detailValue}>{selectedConsignment.owner_name}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>Status</div>
                <div className={styles.detailValue}>
                  <Badge variant={getStatusProps(selectedConsignment.status).variant}>
                    {getStatusProps(selectedConsignment.status).label}
                  </Badge>
                </div>
              </div>
              <div>
                <div className={styles.detailLabel}>Tanggal Masuk</div>
                <div className={styles.detailValue}>{formatDate(selectedConsignment.start_date)}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>Tanggal Berakhir</div>
                <div className={styles.detailValue}>{formatDate(selectedConsignment.end_date)}</div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div className={styles.detailLabel} style={{ marginBottom: '12px' }}>Daftar Barang</div>
              <DataTable 
                data={selectedConsignment.consignment_items || []}
                columns={[
                  { 
                    header: 'Barang', 
                    accessor: (item) => item.items?.name || '-'
                  },
                  { 
                    header: 'Jumlah Diterima', 
                    accessor: (item) => `${formatNumber(item.received_qty)}`
                  },
                  { 
                    header: 'Terjual', 
                    accessor: (item) => formatNumber(item.sold_qty)
                  },
                  { 
                    header: 'Sisa', 
                    accessor: (item) => formatNumber((item.received_qty || 0) - (item.sold_qty || 0))
                  }
                ]}
              />
            </div>
            
            {selectedConsignment.notes && (
              <div style={{ marginTop: '24px' }}>
                <div className={styles.detailLabel}>Catatan</div>
                <div className={styles.detailValue} style={{ fontWeight: 'normal', fontStyle: 'italic', marginTop: '8px' }}>
                  {selectedConsignment.notes}
                </div>
              </div>
            )}

            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button onClick={() => handleUpdateStatus(selectedConsignment.id, 'completed')}>Tandai Selesai</button>
              <button onClick={() => handleUpdateStatus(selectedConsignment.id, 'withdrawn')}>Tarik</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
