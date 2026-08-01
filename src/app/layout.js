'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import "./globals.css";

function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

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

  // Auth guard: redirect to /login if not authenticated
  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.replace('/login');
    }
    // Redirect away from /login if already authenticated
    if (!loading && user && pathname === '/login') {
      router.replace('/');
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7c6b' }}>Memuat aplikasi...</div>;
  }

  // Show login page without sidebar layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Don't render protected pages until user is confirmed
  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7c6b' }}>Mengalihkan ke halaman login...</div>;
  }

  return (
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
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>Gudang Tani – Sistem Manajemen Inventori</title>
        <meta name="description" content="Sistem Manajemen Inventori Gudang Pertanian - Dashboard analitik, manajemen stok, transaksi, dan laporan." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
