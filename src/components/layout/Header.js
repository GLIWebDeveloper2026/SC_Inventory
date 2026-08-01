'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.css';
import { notifications, items, users, receipts, issues } from '@/lib/dummy-data';

export default function Header({ title, subtitle }) {
  const router = useRouter();

  // ── Search state ────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // ── Notification state ──────────────────────────────────────
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState(notifications);
  const notifRef = useRef(null);

  // ── Profile state ───────────────────────────────────────────
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const unreadCount = notifList.filter(n => !n.read).length;

  // ── Global search logic ─────────────────────────────────────
  const searchResults = searchQuery.trim().length > 1 ? (() => {
    const q = searchQuery.toLowerCase();
    const matchedItems = items
      .filter(i => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q))
      .slice(0, 4)
      .map(i => ({ type: 'Barang', label: i.name, sub: i.code, href: '/inventori' }));

    const matchedTx = [...receipts, ...(issues || [])]
      .filter(t => t.id?.toLowerCase().includes(q) || t.supplier?.toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(t => ({ type: 'Transaksi', label: t.id, sub: t.supplier || t.destination || '', href: t.supplier ? '/transaksi/penerimaan' : '/transaksi/pengeluaran' }));

    const matchedUsers = users
      .filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, 2)
      .map(u => ({ type: 'Pengguna', label: u.name, sub: u.email, href: '/pengguna' }));

    return [...matchedItems, ...matchedTx, ...matchedUsers];
  })() : [];

  // ── Mark notification as read ───────────────────────────────
  const markRead = (id) => {
    setNotifList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ── Close dropdowns on outside click ───────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Notification type icons ─────────────────────────────────
  const notifIcon = (type) => {
    if (type === 'warning') return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    );
    if (type === 'success') return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    );
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    );
  };

  const notifColor = { warning: '#f59e0b', success: '#10b981', info: '#3b82f6' };

  const handleMobileMenuClick = () => {
    window.dispatchEvent(new Event('toggleMobileSidebar'));
  };

  return (
    <header className={styles.header}>
      {/* ── Left: hamburger + greeting ── */}
      <div className={styles.leftSection}>
        <button className={styles.hamburgerBtn} onClick={handleMobileMenuClick} aria-label="Menu">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        {title ? (
          <div className={styles.titleArea}>
            <h1 className={styles.pageTitle}>{title}</h1>
            {subtitle && <span className={styles.pageSubtitle}>{subtitle}</span>}
          </div>
        ) : (
          <div className={styles.greeting}>
            <span className={styles.greetingText}>Selamat datang, </span>
            <span className={styles.greetingName}>Budi Santoso</span>
          </div>
        )}
      </div>

      {/* ── Right: search + notif + profile ── */}
      <div className={styles.actions}>

        {/* Search */}
        <div className={styles.searchWrapper} ref={searchRef}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Cari barang, transaksi, anggota..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && searchQuery.trim().length > 1 && (
            <div className={styles.searchDropdown}>
              {searchResults.length === 0 ? (
                <div className={styles.searchEmpty}>Tidak ada hasil untuk "{searchQuery}"</div>
              ) : (
                searchResults.map((r, i) => (
                  <Link
                    key={i}
                    href={r.href}
                    className={styles.searchItem}
                    onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                  >
                    <span className={styles.searchType}>{r.type}</span>
                    <div className={styles.searchItemText}>
                      <span className={styles.searchLabel}>{r.label}</span>
                      {r.sub && <span className={styles.searchSub}>{r.sub}</span>}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className={styles.bellWrapper} ref={notifRef}>
          <button
            className={`${styles.iconBtn} ${notifOpen ? styles.iconBtnActive : ''}`}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            aria-label="Notifikasi"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>Notifikasi</span>
                {unreadCount > 0 && (
                  <button className={styles.markAllBtn} onClick={markAllRead}>Tandai semua dibaca</button>
                )}
              </div>
              <div className={styles.notifList}>
                {notifList.map(n => (
                  <div
                    key={n.id}
                    className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className={styles.notifIconWrap} style={{ color: notifColor[n.type], backgroundColor: `${notifColor[n.type]}18` }}>
                      {notifIcon(n.type)}
                    </div>
                    <div className={styles.notifContent}>
                      <div className={styles.notifTitle}>{n.title}</div>
                      <div className={styles.notifMessage}>{n.message}</div>
                      <div className={styles.notifDate}>{n.date}</div>
                    </div>
                    {!n.read && <div className={styles.unreadDot} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className={styles.profileWrapper} ref={profileRef}>
          <button
            className={`${styles.userProfile} ${profileOpen ? styles.userProfileActive : ''}`}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          >
            <div className={styles.avatar}>BS</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Budi Santoso</div>
              <div className={styles.userRole}>Admin</div>
            </div>
            <svg className={`${styles.chevronIcon} ${profileOpen ? styles.chevronUp : ''}`} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {profileOpen && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>BS</div>
                <div>
                  <div className={styles.profileName}>Budi Santoso</div>
                  <div className={styles.profileEmail}>budi.santoso@gudangtani.id</div>
                  <span className={styles.profileBadge}>Administrator</span>
                </div>
              </div>
              <div className={styles.profileMenu}>
                <Link href="/pengguna" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profil Saya
                </Link>
                <Link href="/pengguna" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                  </svg>
                  Pengaturan
                </Link>
              </div>
              <div className={styles.profileFooter}>
                <button className={styles.logoutBtn} onClick={() => alert('Fitur logout akan tersedia setelah integrasi backend.')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
