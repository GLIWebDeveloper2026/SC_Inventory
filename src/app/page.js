'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import StockChart from '@/components/dashboard/StockChart';
import CategoryChart from '@/components/dashboard/CategoryChart';
import AlertList from '@/components/dashboard/AlertList';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { getDashboardStats, getStockMovements, getCategoryDistribution, getLowStockAlerts, getRecentActivity } from '@/app/actions/dashboard';
import styles from './page.module.css';

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);
const formatCurrency = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: null,
    movements: [],
    distribution: [],
    alerts: [],
    activity: []
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [stats, movements, distribution, alerts, activity] = await Promise.all([
          getDashboardStats(),
          getStockMovements(),
          getCategoryDistribution(),
          getLowStockAlerts(),
          getRecentActivity()
        ]);

        setData({
          stats: stats || { totalItems: 0, totalStock: 0, inventoryValue: 0, lowStockCount: 0 },
          movements: movements || [],
          distribution: distribution || [],
          alerts: alerts || [],
          activity: activity || []
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="pageContent">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#6b7c6b' }}>
            Memuat data dashboard...
          </div>
        </div>
      </>
    );
  }

  const { stats, movements, distribution, alerts, activity } = data;

  // Compute trend based on stock movements (incoming vs outgoing ratio over last 7 days)
  const totalIncoming = movements.reduce((sum, m) => sum + (m.incoming || 0), 0);
  const totalOutgoing = movements.reduce((sum, m) => sum + (m.outgoing || 0), 0);

  // Stock trend: if more incoming than outgoing, positive; otherwise negative
  const stockTrendValue = totalIncoming + totalOutgoing > 0
    ? Math.round(((totalIncoming - totalOutgoing) / Math.max(totalIncoming + totalOutgoing, 1)) * 100)
    : 0;

  // Low stock as percentage of total items
  const lowStockPercent = stats.totalItems > 0
    ? Math.round((stats.lowStockCount / stats.totalItems) * 100)
    : 0;

  return (
    <>
      <Header />
      <div className="pageContent">
        {/* ── Summary Cards ────────────────────────────── */}
        <div className={styles.statsGrid}>
          <StatCard
            title="Total Barang"
            value={formatNumber(stats.totalItems)}
            subtitle="Jenis produk terdaftar"
            color="#2E7D32"
            trend={null}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            }
          />
          <StatCard
            title="Total Stok"
            value={formatNumber(stats.totalStock)}
            subtitle="Unit tersedia di gudang"
            color="#1565C0"
            trend={stockTrendValue !== 0 ? { value: Math.abs(stockTrendValue), direction: stockTrendValue >= 0 ? 'up' : 'down' } : null}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V22H4V12"/>
                <path d="M22 7H2V12H22V7Z"/>
                <path d="M12 22V7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            }
          />
          <StatCard
            title="Nilai Inventori"
            value={formatCurrency(stats.inventoryValue)}
            subtitle="Total nilai stok gudang"
            color="#FF8F00"
            trend={null}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            }
          />
          <StatCard
            title="Stok Minimum Alert"
            value={formatNumber(stats.lowStockCount)}
            subtitle="Barang di bawah minimum"
            color="#C62828"
            trend={lowStockPercent > 0 ? { value: lowStockPercent, direction: 'up' } : null}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            }
          />
        </div>

        {/* ── Charts Row ──────────────────────────────── */}
        <div className={styles.chartsRow}>
          <div className={styles.chartMain}>
            <StockChart data={movements} />
          </div>
          <div className={styles.chartSide}>
            <CategoryChart data={distribution} />
          </div>
        </div>

        {/* ── Bottom Row ──────────────────────────────── */}
        <div className={styles.bottomRow}>
          <div className={styles.bottomMain}>
            <AlertList data={alerts} />
          </div>
          <div className={styles.bottomSide}>
            <RecentActivity data={activity} />
          </div>
        </div>
      </div>
    </>
  );
}
