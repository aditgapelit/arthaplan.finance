import { useState } from 'react';
import styles from './ArthaSecure.module.css';

export default function ArthaSecure() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Logika tambahan untuk ganti class di body/root nanti
  };

  return (
    <div className={`${styles.secureContainer} ${isDarkMode ? styles.dark : ''}`}>
      <h1>ArthaSecure</h1>
      <p>Keamanan akunmu terjaga</p>

      {/* Bagian Ubah Password */}
      <div className={styles.sectionCard}>
        <h3>Ubah Password</h3>
        <input type="password" placeholder="Password saat ini" />
        <input type="password" placeholder="Password baru" />
        <input type="password" placeholder="Konfirmasi password baru" />
        <button className={styles.btnPrimary}>Ubah Password</button>
      </div>

      {/* Pengaturan Tampilan */}
      <div className={styles.sectionCard}>
        <h3>Pengaturan Tampilan</h3>
        <div className={styles.toggleRow}>
          <span>{isDarkMode ? '🌙 Mode Gelap' : '☀️ Mode Terang'}</span>
          <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
        </div>
      </div>

      {/* Aktivitas Login & Logout */}
      <div className={styles.sectionCard}>
        <h3>Aktivitas Login</h3>
        <p className={styles.logItem}>Chrome on Windows • Jakarta, ID • 1 Jun 2026</p>
        <button className={styles.btnLogout}>Logout dari Semua Perangkat</button>
      </div>
    </div>
  );
}