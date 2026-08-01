import styles from './dashboard.module.css';
import { auditLogs, getUserById } from '@/lib/dummy-data';

const getActionColor = (action) => {
  switch(action) {
    case 'CREATE': return '#4CAF50';
    case 'UPDATE': return '#2196F3';
    case 'FINALIZE': return '#9C27B0';
    case 'DELETE': return '#F44336';
    default: return '#9e9e9e';
  }
};

export default function RecentActivity() {
  const recentLogs = [...auditLogs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  return (
    <div className={styles.activityCard}>
      <h3 className={styles.chartTitle}>Recent Activity</h3>
      <div className={styles.activityList}>
        {recentLogs.map((log, index) => {
          const user = getUserById(log.userId);
          const color = getActionColor(log.action);
          
          
          return (
            <div key={log.id} className={styles.activityItem}>
              <div className={styles.activityDot} style={{ backgroundColor: color }} />
              {index < recentLogs.length - 1 && <div className={styles.activityLine} />}
              <div className={styles.activityContent}>
                <div className={styles.activityDetail}>
                  <strong>{user?.name || 'Unknown'}</strong> {log.action.toLowerCase()} {log.module}
                  {log.details && `: ${log.details}`}
                </div>
                <div className={styles.activityMeta}>
                  {log.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
