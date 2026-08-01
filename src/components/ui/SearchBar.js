'use client';
import styles from './ui.module.css';
import CustomSelect from './CustomSelect';

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Cari...", 
  filters = [], 
  activeFilters = {}, 
  onFilterChange 
}) {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchInput}>
        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7c6b' }} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      
      {filters.length > 0 && filters.map((filter, idx) => {
        const selectOptions = [
          { value: '', label: filter.label },
          ...filter.options
        ];
        return (
          <CustomSelect 
            key={idx} 
            options={selectOptions}
            value={activeFilters[filter.key] || ''}
            onChange={(val) => onFilterChange && onFilterChange(filter.key, val)}
          />
        );
      })}
    </div>
  );
}
