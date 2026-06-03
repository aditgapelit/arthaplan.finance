import styles from './BenefitCard.module.css';

export default function BenefitCard({ icon, title, description }) {
  return (
    <div className={styles.card}>
      {icon && (
        <div className={styles.iconWrapper}>
          {icon}
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
