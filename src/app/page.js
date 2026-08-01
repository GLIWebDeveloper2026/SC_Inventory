'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import StockChart from '@/components/dashboard/StockChart';
import CategoryChart from '@/components/dashboard/CategoryChart';
import AlertList from '@/components/dashboard/AlertList';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { getDashboardStats, formatNumber, formatCurrency } from '@/lib/dummy-data';
import styles from './page.module.css';

export default function DashboardPage() {
  const stats = getDashboardStats();

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
            trend={{ value: 12, direction: 'up' }}
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
            trend={{ value: 8, direction: 'up' }}
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
            value={formatCurrency(stats.totalValue)}
            subtitle="Total nilai stok gudang"
            color="#FF8F00"
            trend={{ value: 5, direction: 'up' }}
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
            trend={{ value: 2, direction: 'up' }}
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
            <StockChart />
          </div>
          <div className={styles.chartSide}>
            <CategoryChart />
          </div>
        </div>

        {/* ── Bottom Row ──────────────────────────────── */}
        <div className={styles.bottomRow}>
          <div className={styles.bottomMain}>
            <AlertList />
          </div>
          <div className={styles.bottomSide}>
            <RecentActivity />
          </div>
        </div>
      </div>
    </>
  );
}
