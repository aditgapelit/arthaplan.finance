import { motion } from 'framer-motion';
import styles from './PageHeader.module.css';

export default function PageHeader({ label = 'DASHBOARD', title, subtitle, avatar, children }) {
  return (
    <motion.header
      className={styles.commandHeader}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className={styles.commandTop}>
        <div className={styles.commandGreeting}>
          <span className={styles.commandLabel}>{label}</span>
          <h1>{title}</h1>
          {subtitle ? <p className={styles.commandSubtitle}>{subtitle}</p> : null}
        </div>
        {avatar ? <div className={styles.commandAvatar}>{avatar}</div> : null}
      </div>
      {children ? <div className={styles.statsStrip}>{children}</div> : null}
    </motion.header>
  );
}
