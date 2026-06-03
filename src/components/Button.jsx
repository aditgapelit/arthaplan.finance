import { motion } from 'framer-motion';
import styles from './Button.module.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${styles.btn} 
        ${styles[`btn-${variant}`]} 
        ${styles[`size-${size}`]}
        ${fullWidth ? styles.fullWidth : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}
