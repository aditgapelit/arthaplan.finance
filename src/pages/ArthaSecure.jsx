import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Sun, Moon, Monitor, LogOut } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import styles from './ArthaSecure.module.css';

export default function ArthaSecure() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      y: -4, 
      borderColor: "rgba(16, 185, 129, 0.3)", 
      boxShadow: "0 8px 12px -1px rgba(5, 150, 105, 0.1)" 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={styles.secureContainer}
    >
      <PageHeader
        label="ARTHASECURE"
        title="ArthaSecure"
        subtitle="Keamanan akunmu terjaga"
      />

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.1 }}
        className={styles.sectionCard}
      >
        <div className={styles.sectionHeader}>
          <Lock size={20} strokeWidth={1.5} color="#059669" />
          <h3>Ubah Password</h3>
        </div>
        <div className={styles.inputWrapper}>
          <Lock size={18} strokeWidth={1.5} color="#64748b" className={styles.inputIcon} />
          <input type="password" placeholder="Password saat ini" />
        </div>
        <div className={styles.inputWrapper}>
          <Lock size={18} strokeWidth={1.5} color="#64748b" className={styles.inputIcon} />
          <input type="password" placeholder="Password baru" />
        </div>
        <div className={styles.inputWrapper}>
          <Lock size={18} strokeWidth={1.5} color="#64748b" className={styles.inputIcon} />
          <input type="password" placeholder="Konfirmasi password baru" />
        </div>
        <motion.button 
          className={styles.btnPrimary}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Ubah Password
        </motion.button>
      </motion.div>

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.2 }}
        className={styles.sectionCard}
      >
        <div className={styles.sectionHeader}>
          {isDarkMode ? (
            <Moon size={20} strokeWidth={1.5} color="#059669" />
          ) : (
            <Sun size={20} strokeWidth={1.5} color="#059669" />
          )}
          <h3>Pengaturan Tampilan</h3>
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>
            {isDarkMode ? 'Mode Gelap' : 'Mode Terang'}
          </span>
          <label className={styles.toggle}>
            <input 
              type="checkbox" 
              checked={isDarkMode} 
              onChange={toggleDarkMode} 
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </motion.div>

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.3 }}
        className={styles.sectionCard}
      >
        <div className={styles.sectionHeader}>
          <Monitor size={20} strokeWidth={1.5} color="#10b981" />
          <h3>Aktivitas Login</h3>
        </div>
        <div className={styles.activityItem}>
          <div className={styles.activityInfo}>
            <Shield size={18} strokeWidth={1.5} color="#94a3b8" />
            <div>
              <p className={styles.activityTitle}>Chrome on Windows</p>
              <p className={styles.activityMeta}>Jakarta, ID - 1 Jun 2026</p>
            </div>
          </div>
          <span className={styles.activeBadge}>Aktif</span>
        </div>
        <motion.button 
          className={styles.btnLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} strokeWidth={1.5} />
          Logout dari Semua Perangkat
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
