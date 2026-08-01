import styles from './dashboard.module.css';

export default function StatCard({ title, value, subtitle, icon, trend, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statTitle}>{title}</div>
        <div className={styles.statIcon} style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
      </div>
      
      <div className={styles.statValue}>{value}</div>
      
      {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
      
      {trend && (
        <div className={`${styles.statTrend} ${trend.direction === 'up' ? styles.trendUp : styles.trendDown}`}>
          {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </div>
  );
}
