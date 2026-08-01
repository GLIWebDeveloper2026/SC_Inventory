import styles from './dashboard.module.css';

const getActionColor = (action) => {
  switch(action) {
    case 'CREATE': return '#4CAF50';
    case 'UPDATE': return '#2196F3';
    case 'FINALIZE': return '#9C27B0';
    case 'DELETE': return '#F44336';
    default: return '#9e9e9e';
  }
};

const getActionText = (action) => {
  switch(action) {
    case 'CREATE': return 'membuat';
    case 'UPDATE': return 'memperbarui';
    case 'FINALIZE': return 'memfinalisasi';
    case 'DELETE': return 'menghapus';
    default: return action?.toLowerCase() || '';
  }
};

export default function RecentActivity({ data: recentLogs = [] }) {
  if (!recentLogs || recentLogs.length === 0) {
    return (
      <div className={styles.activityCard}>
        <h3 className={styles.chartTitle}>Aktivitas Terkini</h3>
        <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7c6b' }}>
          Tidak ada aktivitas.
        </div>
      </div>
    );
  }

  const sortedLogs = [...recentLogs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div className={styles.activityCard}>
      <h3 className={styles.chartTitle}>Aktivitas Terkini</h3>
      <div className={styles.activityList}>
        {sortedLogs.map((log, index) => {
          const color = getActionColor(log.action);
          
          return (
            <div key={log.id} className={styles.activityItem}>
              <div className={styles.activityDot} style={{ backgroundColor: color }} />
              {index < sortedLogs.length - 1 && <div className={styles.activityLine} />}
              <div className={styles.activityContent}>
                <div className={styles.activityDetail}>
                  <strong>{log.users?.name || 'Tidak diketahui'}</strong> {getActionText(log.action)} {log.table_name}
                  {log.record_id && `: ${log.record_id}`}
                </div>
                <div className={styles.activityMeta}>
                  {new Date(log.created_at).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
