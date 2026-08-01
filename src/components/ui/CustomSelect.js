'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  className = '',
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find label for current value
  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange && onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.selectContainer} ${className}`} style={style} ref={containerRef}>
      <button
        type="button"
        className={`${styles.selectTrigger} ${isOpen ? styles.selectTriggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selectValue}>{displayLabel}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.selectDropdown}>
          {options.map((opt, idx) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={idx}
                className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
