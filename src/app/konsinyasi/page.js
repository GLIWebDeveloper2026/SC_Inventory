'use client'

import { useState } from 'react'
import { consignments, getItemById, getUomById, formatDate, formatNumber } from '@/lib/dummy-data'
import Header from '@/components/layout/Header'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import CustomSelect from '@/components/ui/CustomSelect'
import styles from './konsinyasi.module.css'

export default function KonsinyasiPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedConsignment, setSelectedConsignment] = useState(null)

  const filteredConsignments = consignments.filter(con => {
    const matchesSearch = con.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          con.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
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
      default: return { label: status, variant: 'default' }
    }
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

      {filteredConsignments.length > 0 ? (
        <div className={styles.cardGrid}>
          {filteredConsignments.map(con => {
            const statusProps = getStatusProps(con.status)
            return (
              <div key={con.id} className={styles.conCard} onClick={() => setSelectedConsignment(con)}>
                <div className={styles.conCardHeader}>
                  <div className={styles.conId}>{con.id}</div>
                  <Badge variant={statusProps.variant}>{statusProps.label}</Badge>
                </div>
                <div className={styles.conOwner}>{con.ownerName}</div>
                <div className={styles.conDates}>
                  📅 {formatDate(con.startDate)} - {formatDate(con.endDate)}
                </div>
                
                <div className={styles.conItems}>
                  {con.items.map((item, idx) => {
                    const itemData = getItemById(item.itemId)
                    const percentSold = (item.soldQty / item.receivedQty) * 100
                    return (
                      <div key={idx} className={styles.conItemRow}>
                        <div className={styles.conItemName}>{itemData?.name}</div>
                        <div className={styles.conItemProgress}>
                          <div className={styles.progressText}>{item.soldQty}/{item.receivedQty}</div>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill} 
                              style={{ width: `${Math.min(100, percentSold)}%` }}
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
        title={`Detail Konsinyasi: ${selectedConsignment?.id}`}
      >
        {selectedConsignment && (
          <div>
            <div className={styles.detailGrid}>
              <div>
                <div className={styles.detailLabel}>Pemilik</div>
                <div className={styles.detailValue}>{selectedConsignment.ownerName}</div>
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
                <div className={styles.detailValue}>{formatDate(selectedConsignment.startDate)}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>Tanggal Berakhir</div>
                <div className={styles.detailValue}>{formatDate(selectedConsignment.endDate)}</div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div className={styles.detailLabel} style={{ marginBottom: '12px' }}>Daftar Barang</div>
              <DataTable 
                data={selectedConsignment.items}
                columns={[
                  { 
                    header: 'Barang', 
                    accessor: (item) => getItemById(item.itemId)?.name || item.itemId
                  },
                  { 
                    header: 'Jumlah Diterima', 
                    accessor: (item) => {
                      const itemData = getItemById(item.itemId)
                      const uom = getUomById(itemData?.baseUom)
                      return `${formatNumber(item.receivedQty)} ${uom?.symbol || ''}`
                    }
                  },
                  { 
                    header: 'Terjual', 
                    accessor: (item) => formatNumber(item.soldQty)
                  },
                  { 
                    header: 'Sisa', 
                    accessor: (item) => formatNumber(item.receivedQty - item.soldQty)
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
          </div>
        )}
      </Modal>
    </div>
  )
}
