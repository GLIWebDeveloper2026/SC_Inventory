'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import styles from './dashboard.module.css';
import { stockMovements } from '@/lib/dummy-data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StockChart() {
  const last7 = stockMovements.slice(-7);
  
  const data = {
    labels: last7.map(m => m.date.substring(0, 10)),
    datasets: [
      {
        label: 'Incoming',
        data: last7.map(m => m.type === 'IN' ? m.qty : 0),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Outgoing',
        data: last7.map(m => m.type === 'OUT' ? m.qty : 0),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          color: '#f0f2f0',
        }
      }
    }
  };

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Stock Movement (7 Days)</h3>
      <div className={styles.chartWrapper}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
