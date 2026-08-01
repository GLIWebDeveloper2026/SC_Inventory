import styles from './ui.module.css';

export default function Badge({ variant = 'neutral', size = 'md', children }) {
  const variantClass = styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const sizeClass = size === 'sm' ? styles.badgeSm : '';
  
  return (
    <span className={`${styles.badge} ${variantClass || styles.badgeNeutral} ${sizeClass}`}>
      {children}
    </span>
  );
}
