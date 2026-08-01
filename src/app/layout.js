'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import "./globals.css";

export default function RootLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleToggle = () => setSidebarCollapsed(prev => !prev);
    const handleMobileToggle = () => setMobileSidebarOpen(prev => !prev);
    const handleMobileClose = () => setMobileSidebarOpen(false);
    
    window.addEventListener('toggleSidebar', handleToggle);
    window.addEventListener('toggleMobileSidebar', handleMobileToggle);
    window.addEventListener('closeMobileSidebar', handleMobileClose);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
      window.removeEventListener('toggleMobileSidebar', handleMobileToggle);
      window.removeEventListener('closeMobileSidebar', handleMobileClose);
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <html lang="id">
      <head>
        <title>Gudang Tani – Sistem Manajemen Inventori</title>
        <meta name="description" content="Sistem Manajemen Inventori Gudang Pertanian - Dashboard analitik, manajemen stok, transaksi, dan laporan." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="appLayout">
          {/* Mobile backdrop */}
          {mobileSidebarOpen && (
            <div 
              className="sidebarBackdrop" 
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
          
          <Sidebar 
            collapsed={sidebarCollapsed} 
            mobileOpen={mobileSidebarOpen}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
          <main className={`mainContent ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
