'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }) {
  const [openSubmenu, setOpenSubmenu] = useState('transaksi');
  const pathname = usePathname();

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? '' : menu);
  };

  const isActive = (path) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        {!collapsed && <span className={styles.logoText}>Gudang Tani</span>}
        <button className={styles.toggleBtn} onClick={onToggle}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav className={styles.navArea}>
        <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link href="/inventori" className={`${styles.navItem} ${isActive('/inventori') ? styles.active : ''}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          {!collapsed && <span>Inventori</span>}
        </Link>

        <div className={styles.submenuContainer}>
          <div 
            className={`${styles.navItem} ${isActive('/transaksi') ? styles.active : ''}`}
            onClick={() => !collapsed && toggleSubmenu('transaksi')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            {!collapsed && (
              <>
                <span>Transaksi</span>
                <svg className={`${styles.chevron} ${openSubmenu === 'transaksi' ? styles.chevronOpen : ''}`} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </>
            )}
          </div>
          {!collapsed && openSubmenu === 'transaksi' && (
            <div className={styles.submenu}>
              <Link href="/transaksi/penerimaan" className={`${styles.submenuItem} ${pathname === '/transaksi/penerimaan' ? styles.activeSub : ''}`}>Penerimaan</Link>
              <Link href="/transaksi/pengeluaran" className={`${styles.submenuItem} ${pathname === '/transaksi/pengeluaran' ? styles.activeSub : ''}`}>Pengeluaran</Link>
              <Link href="/transaksi/retur" className={`${styles.submenuItem} ${pathname === '/transaksi/retur' ? styles.activeSub : ''}`}>Retur</Link>
            </div>
          )}
        </div>

        <Link href="/konsinyasi" className={`${styles.navItem} ${isActive('/konsinyasi') ? styles.active : ''}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          {!collapsed && <span>Konsinyasi</span>}
        </Link>
        <Link href="/stock-opname" className={`${styles.navItem} ${isActive('/stock-opname') ? styles.active : ''}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><polyline points="9 14 12 17 16 13"></polyline></svg>
          {!collapsed && <span>Stock Opname</span>}
        </Link>
        <Link href="/laporan" className={`${styles.navItem} ${isActive('/laporan') ? styles.active : ''}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          {!collapsed && <span>Laporan</span>}
        </Link>
        <Link href="/pengguna" className={`${styles.navItem} ${isActive('/pengguna') ? styles.active : ''}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          {!collapsed && <span>Pengguna</span>}
        </Link>
      </nav>

      {/* Remove hardcoded userInfo here because it is now in the Header */}
    </aside>
  );
}

