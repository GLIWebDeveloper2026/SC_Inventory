'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './dashboard.module.css';
import { getCategoryDistribution } from '@/lib/dummy-data';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart() {
  const distribution = getCategoryDistribution();
  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  const data = {
    labels: distribution.map(d => d.name),
    datasets: [
      {
        data: distribution.map(d => d.count),
        backgroundColor: distribution.map(d => d.color),
        borderWidth: 0,
        cutout: '65%',
      },
    ],
  };

  // Plugin to draw text at the exact center of the doughnut hole
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Main number
      ctx.font = 'bold 1.5rem Inter, sans-serif';
      ctx.fillStyle = '#1a3a2a';
      ctx.fillText(total, centerX, centerY - 8);

      // Sub label
      ctx.font = '0.75rem Inter, sans-serif';
      ctx.fillStyle = '#6b7c6b';
      ctx.fillText('Items', centerX, centerY + 14);

      ctx.restore();
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Items by Category</h3>
      <div className={styles.chartWrapper}>
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
}
