'use client';
import { useEffect } from 'react';
import styles from './ui.module.css';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = styles[`modal${size.charAt(0).toUpperCase() + size.slice(1)}`];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modalCard} ${sizeClass || styles.modalMd}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1a3a2a' }}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
