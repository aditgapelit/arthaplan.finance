import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Target, 
  FileBarChart, 
  User,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { supabase } from '../supabase/client';
import styles from './Sidebar.module.css';
import logoImage from '../assets/logo.jpeg'; 

export default function Sidebar({ onClose }) {
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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'ArthaTrack', path: '/track', icon: ArrowRightLeft },
    { name: 'ArthaGoal', path: '/goal', icon: Target },
    { name: 'ArthaReport', path: '/report', icon: FileBarChart },
    { name: 'Profil', path: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Redirect to landing after signout completes
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if signout fails
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoSection}>
          <img src={logoImage} alt="Logo" className={styles.logoIcon} />
          <div>
            <h2 className={styles.brandName}>ArthaPlan</h2>
            <p className={styles.brandTag}>FINANCIAL TRACKER</p>
          </div>
        </div>
        <motion.button 
          className={styles.collapseBtn}
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={18} strokeWidth={1.5} color="#64748b" />
        </motion.button>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.button 
              key={item.name}
              onClick={() => navigate(item.path)}
              className={isActive ? styles.active : ''}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Icon 
                size={20} 
                strokeWidth={1.5} 
                color={isActive ? '#059669' : '#64748b'} 
              />
              {item.name}
            </motion.button>
          );
        })}
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>{userData.name.charAt(0).toUpperCase()}</div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{userData.name}</p>
          <p className={styles.userEmail}>{userData.email}</p>
        </div>
        <motion.button 
          className={styles.logoutBtn}
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Logout"
        >
          <LogOut size={18} strokeWidth={1.5} color="#64748b" />
        </motion.button>
      </div>
    </div>
  );
}
