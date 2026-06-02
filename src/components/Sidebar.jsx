import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase/client';
import styles from './Sidebar.module.css';
// 1. Impor gambar logo
import logoImage from '../assets/logo.jpeg'; 

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({ name: 'User', email: '' });

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const nameFromEmail = user.email.split('@')[0];
        const rawName = user.user_metadata?.full_name || nameFromEmail;
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        setUserData({ name: formattedName, email: user.email });
      }
    }
    getUser();
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'ArthaTrack', path: '/track' },
    { name: 'ArthaGoal', path: '/goal' },
    { name: 'ArthaReport', path: '/report' },
    { name: 'Profil', path: '/profile' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        {/* 2. Ganti div ikon dengan img */}
        <img src={logoImage} alt="Logo" className={styles.logoIcon} />
        
        <div>
          <h2 className={styles.brandName}>ArthaPlan</h2>
          <p className={styles.brandTag}>FINANCIAL TRACKER</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? styles.active : ''}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>{userData.name.charAt(0).toUpperCase()}</div>
        <div>
          <p className={styles.userName}>{userData.name}</p>
          <p className={styles.userEmail}>{userData.email}</p>
        </div>
      </div>
    </aside>
  );
}