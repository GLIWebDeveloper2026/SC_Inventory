'use client';
import styles from './ui.module.css';

export default function DataTable({ columns, data, onRowClick, emptyMessage = "Tidak ada data." }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={styles.tableRow} 
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '24px', color: '#6b7c6b' }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
