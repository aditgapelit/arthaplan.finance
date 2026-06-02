import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import styles from './Profil.module.css';

export default function Profil() {
  const [user, setUser] = useState({ name: "Loading...", email: "Loading...", memberSince: "-" });
  const [loading, setLoading] = useState(true);
  
  // State untuk form password
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    async function getProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Logika: Ambil nama dari metadata, jika tidak ada, ambil dari email sebelum @
        const nameFromEmail = authUser.email.split('@')[0];
        const rawName = authUser.user_metadata?.full_name || nameFromEmail;
        
        // Kapitalisasi huruf pertama
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

  if (loading) return <div className={styles.profilContainer}>Loading...</div>;

  return (
    <div className={styles.profilContainer}>
      <h1>Profil & Keamanan</h1>
      <p>Kelola identitas dan keamanan akun Anda</p>

      {/* Profil Section */}
      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className={styles.badge}>Member sejak {user.memberSince}</span>
        </div>
        <div className={styles.infoGroup}>
          <p className={styles.label}>Nama Lengkap</p>
          <p className={styles.value}>{user.name}</p>
        </div>
        <div className={styles.infoGroup}>
          <p className={styles.label}>Email</p>
          <p className={styles.value}>{user.email}</p>
        </div>
      </div>

      {/* Ubah Password Section */}
      <div className={styles.card}>
        <h3>Ubah Password</h3>
        <div className={styles.secureForm}>
          <input 
            type="password" placeholder="Password saat ini" className={styles.input}
            value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})}
          />
          <input 
            type="password" placeholder="Password baru" className={styles.input}
            value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})}
          />
          <input 
            type="password" placeholder="Konfirmasi password baru" className={styles.input}
            value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
          />
          <button className={styles.btnPrimary} onClick={handleUpdatePassword}>
            Simpan Password Baru
          </button>
        </div>
      </div>
    </div>
  );
}