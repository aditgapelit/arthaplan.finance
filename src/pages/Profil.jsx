import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Lock, Save } from 'lucide-react';
import { supabase } from '../supabase/client';
import PageHeader from '../components/PageHeader';
import styles from './Profil.module.css';

export default function Profil() {
  const [user, setUser] = useState({ name: "Loading...", email: "Loading...", memberSince: "-" });
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    async function getProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const nameFromEmail = authUser.email.split('@')[0];
        const rawName = authUser.user_metadata?.full_name || nameFromEmail;
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        
        setUser({
          name: formattedName,
          email: authUser.email,
          memberSince: new Date(authUser.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        });
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  async function handleUpdatePassword() {
    if (passwords.new !== passwords.confirm) {
      alert("Password baru tidak cocok!");
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    
    if (error) {
      alert("Gagal mengubah password: " + error.message);
    } else {
      alert("Password berhasil diperbarui!");
      setPasswords({ current: '', new: '', confirm: '' });
    }
  }

  if (loading) {
    return (
      <div className={styles.profilContainer}>
        <p style={{ color: '#64748b' }}>Loading...</p>
      </div>
    );
  }

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
      className={styles.profilContainer}
    >
      <PageHeader
        label="PROFIL"
        title="Profil & Keamanan"
        subtitle="Kelola identitas dan keamanan akun Anda"
      />

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.1 }}
        className={styles.card}
      >
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <h2 className={styles.profileName}>{user.name}</h2>
          <p className={styles.profileEmail}>{user.email}</p>
          <span className={styles.badge}>
            <Calendar size={14} strokeWidth={1.5} />
            Member sejak {user.memberSince}
          </span>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.statChip}>
            <span className={styles.statChipLabel}>Nama</span>
            <strong>{user.name}</strong>
          </div>
          <div className={styles.statChip}>
            <span className={styles.statChipLabel}>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className={styles.statChip}>
            <span className={styles.statChipLabel}>Member</span>
            <strong>{user.memberSince}</strong>
          </div>
        </div>

        <div className={styles.infoGroup}>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <User size={18} strokeWidth={1.5} color="#059669" />
              <p className={styles.label}>Nama Lengkap</p>
            </div>
            <p className={styles.value}>{user.name}</p>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <Mail size={18} strokeWidth={1.5} color="#059669" />
              <p className={styles.label}>Email</p>
            </div>
            <p className={styles.value}>{user.email}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.2 }}
        className={styles.card}
      >
        <div className={styles.sectionHeader}>
          <Lock size={20} strokeWidth={1.5} color="#059669" />
          <h3>Ubah Password</h3>
        </div>
        <p className={styles.sectionDescription}>
          Gunakan password yang kuat dan unik untuk menjaga akun tetap aman.
        </p>
        <div className={styles.secureForm}>
          <div className={styles.inputWrapper}>
            <Lock size={18} strokeWidth={1.5} color="#64748b" className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Password saat ini" 
              className={styles.input}
              value={passwords.current} 
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
            />
          </div>
          <div className={styles.inputWrapper}>
            <Lock size={18} strokeWidth={1.5} color="#64748b" className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Password baru" 
              className={styles.input}
              value={passwords.new} 
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
            />
          </div>
          <div className={styles.inputWrapper}>
            <Lock size={18} strokeWidth={1.5} color="#94a3b8" className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Konfirmasi password baru" 
              className={styles.input}
              value={passwords.confirm} 
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
            />
          </div>
          <motion.button 
            className={styles.btnPrimary} 
            onClick={handleUpdatePassword}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={18} strokeWidth={2} />
            Simpan Password Baru
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
