import Link from 'next/link';
import styles from './dashboard.module.css';
import { getLowStockItems, getUomById, formatNumber } from '@/lib/dummy-data';

export default function AlertList() {
  const alerts = getLowStockItems().slice(0, 4); // Show top 4 alerts

  return (
    <div className={styles.alertCard}>
      <div className={styles.alertHeader}>
        <h3 className={styles.chartTitle} style={{ marginBottom: 0 }}>Stok Menipis</h3>
        <Link href="/inventori" className={styles.alertLink}>Lihat semua →</Link>
      </div>
      <div className={styles.alertList}>
        {alerts.map(item => {
          const ratio = item.stock / item.minStock;
          const isUrgent = ratio <= 0.5;
          const uom = getUomById(item.uomId);
          
          let statusText = `${formatNumber(item.stock)} ${uom?.code || ''}`;
          if (item.stock === 0) statusText = 'Habis';
          
          return (
            <div 
              key={item.id} 
              className={`${styles.alertItem} ${isUrgent ? styles.alertItemDanger : styles.alertItemWarning}`}
            >
              <div className={styles.alertInfo}>
                <div className={styles.alertName}>{item.name}</div>
                <div className={styles.alertMeta}>{item.categoryId === 'c1' ? 'Pupuk' : 'Obat / Pestisida'}</div>
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
