'use client';

import { useState, useEffect } from 'react';
import { getStockOpnames, createStockOpname, finalizeStockOpname } from '@/app/actions/stock-opname';
import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import styles from './stock-opname.module.css';

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0)
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export default function StockOpnamePage() {
  const [selectedOpname, setSelectedOpname] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockOpnames, setStockOpnames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOpnames = async () => {
    setLoading(true);
    try {
      const res = await getStockOpnames();
      if (res?.data) setStockOpnames(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpnames();
  }, []);

  const filteredOpnames = stockOpnames.filter(op => {
    if (statusFilter === 'all') return true;
    return op.status === statusFilter;
  });

  const totalOpname = stockOpnames.length;
  const completedCount = stockOpnames.filter(op => op.status === 'completed').length;
  const inProgressCount = stockOpnames.filter(op => op.status === 'in_progress').length;

  const totalNegDiff = stockOpnames.reduce((sum, op) => {
    return sum + (op.stock_opname_details || []).reduce((acc, d) => d.diff < 0 ? acc + d.diff : acc, 0);
  }, 0);

  const getStatusProps = (status) => {
    switch (status) {
      case 'completed': return { label: 'Selesai', variant: 'success' };
      case 'in_progress': return { label: 'Berjalan', variant: 'warning' };
      default: return { label: status || 'Tidak diketahui', variant: 'neutral' };
    }
  };

  const handleFinalize = async (id) => {
    await finalizeStockOpname(id);
    fetchOpnames();
    setSelectedOpname(null);
  };

  return (
    <>
      <Header title="Stock Opname" subtitle="Rekonsiliasi dan verifikasi stok fisik gudang" />
      <div className="pageContent">
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{totalOpname}</div>
            <div className={styles.summaryLabel}>Total Opname</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{completedCount}</div>
            <div className={styles.summaryLabel}>Selesai</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{inProgressCount}</div>
            <div className={styles.summaryLabel}>Sedang Berjalan</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue} style={{ color: totalNegDiff < 0 ? '#c62828' : 'inherit' }}>
              {formatNumber(totalNegDiff)}
            </div>
            <div className={styles.summaryLabel}>Total Selisih Negatif</div>
          </div>
        </div>

        <div className={styles.toolbar}>
          {['all', 'completed', 'in_progress'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${statusFilter === f ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f === 'all' ? 'Semua' : f === 'completed' ? 'Selesai' : 'Sedang Berjalan'}
            </button>
          ))}
        </div>

        {loading ? (
          <div>Memuat data...</div>
        ) : (
          <div className={styles.sessionList}>
            {filteredOpnames.map(op => {
              const statusProps = getStatusProps(op.status);
              const auditorName = op.users?.name || 'Tidak diketahui';
              let matched = 0, negativeDiffs = 0, positiveDiffs = 0;
              (op.stock_opname_details || []).forEach(d => {
                if (d.diff === 0) matched++;
                else if (d.diff < 0) negativeDiffs++;
                else positiveDiffs++;
              });

              return (
                <div key={op.id} className={styles.sessionCard} onClick={() => setSelectedOpname(op)}>
                  <div className={styles.sessionHeader}>
                    <div>
                      <div className={styles.sessionId}>{op.opname_code}</div>
                      <div className={styles.sessionDate}>{formatDate(op.date)}</div>
                    </div>
                    <Badge variant={statusProps.variant}>{statusProps.label}</Badge>
                  </div>
                  <div className={styles.sessionMeta}>
                    <div className={styles.sessionMetaItem}>
                      Auditor: <strong>{auditorName}</strong>
                    </div>
                    <div className={styles.sessionMetaItem}>
                      Barang Diperiksa: <strong>{(op.stock_opname_details || []).length}</strong>
                    </div>
                    <div className={styles.sessionMetaItem}>
                      Catatan: <strong>{op.notes}</strong>
                    </div>
                  </div>
                  <div className={styles.diffSummary}>
                    {matched > 0 && <div className={`${styles.diffItem} ${styles.diffZero}`}>Sesuai: {matched}</div>}
                    {positiveDiffs > 0 && <div className={`${styles.diffItem} ${styles.diffPositive}`}>Lebih: {positiveDiffs}</div>}
                    {negativeDiffs > 0 && <div className={`${styles.diffItem} ${styles.diffNegative}`}>Kurang: {negativeDiffs}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal
          isOpen={!!selectedOpname}
          onClose={() => setSelectedOpname(null)}
          title={`Detail Opname: ${selectedOpname?.opname_code || ''}`}
          size="lg"
        >
          {selectedOpname && (
            <div>
              <div className={styles.detailInfo}>
                <div>
                  <div className={styles.detailLabel}>Tanggal</div>
                  <div className={styles.detailValue}>{formatDate(selectedOpname.date)}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Auditor</div>
                  <div className={styles.detailValue}>
                    {selectedOpname.users?.name || 'Tidak diketahui'}
                  </div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Status</div>
                  <div className={styles.detailValue}>
                    <Badge variant={getStatusProps(selectedOpname.status).variant}>
                      {getStatusProps(selectedOpname.status).label}
                    </Badge>
                  </div>
                </div>
              </div>

              <table className={styles.detailTable}>
                <thead>
                  <tr>
                    <th>Barang</th>
                    <th>Stok Sistem</th>
                    <th>Stok Fisik</th>
                    <th>Selisih</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOpname.stock_opname_details || []).map((detail, idx) => {
                    const diffClass = detail.diff < 0 ? styles.diffNegative : detail.diff > 0 ? styles.diffPositive : styles.diffZero;

                    return (
                      <tr key={idx}>
                        <td>{detail.items?.name || 'Barang'}</td>
                        <td>{formatNumber(detail.system_qty)}</td>
                        <td>{formatNumber(detail.physical_qty)}</td>
                        <td>
                          <span className={`${styles.diffItem} ${diffClass}`} style={{ display: 'inline-block' }}>
                            {detail.diff > 0 ? '+' : ''}{formatNumber(detail.diff)}
                          </span>
                        </td>
                        <td>{detail.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {selectedOpname.status !== 'completed' && (
                 <div style={{ marginTop: '20px' }}>
                   <button onClick={() => handleFinalize(selectedOpname.id)}>Finalisasi</button>
                 </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
