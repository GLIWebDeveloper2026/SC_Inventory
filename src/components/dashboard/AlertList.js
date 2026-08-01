import Link from 'next/link';
import styles from './dashboard.module.css';

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0)

export default function AlertList({ data: alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className={styles.alertCard}>
        <div className={styles.alertHeader}>
          <h3 className={styles.chartTitle} style={{ marginBottom: 0 }}>Stok Menipis</h3>
          <Link href="/inventori" className={styles.alertLink}>Lihat semua →</Link>
        </div>
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Tidak ada peringatan stok menipis.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.alertCard}>
      <div className={styles.alertHeader}>
        <h3 className={styles.chartTitle} style={{ marginBottom: 0 }}>Stok Menipis</h3>
        <Link href="/inventori" className={styles.alertLink}>Lihat semua →</Link>
      </div>
      <div className={styles.alertList}>
        {alerts.slice(0, 4).map(item => {
          const ratio = item.stock / item.min_stock;
          const isUrgent = ratio <= 0.5;
          const uomCode = item.categories?.name || ''; // Assuming we might not have UOM directly, display as needed
          
          let statusText = `${formatNumber(item.stock)}`;
          if (item.stock === 0) statusText = 'Habis';
          
          return (
            <div 
              key={item.id} 
              className={`${styles.alertItem} ${isUrgent ? styles.alertItemDanger : styles.alertItemWarning}`}
            >
              <div className={styles.alertInfo}>
                <div className={styles.alertName}>{item.name}</div>
                <div className={styles.alertMeta}>{item.categories?.name || 'Kategori tidak diketahui'}</div>
              </div>
              <div className={`${styles.alertBadge} ${isUrgent ? styles.alertBadgeDanger : styles.alertBadgeWarning}`}>
                {statusText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
