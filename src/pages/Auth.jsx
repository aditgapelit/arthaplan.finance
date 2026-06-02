import { useState } from 'react';
import styles from './Auth.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State untuk show/hide
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }
    try {
      if (isLogin) await signIn(email, password);
      else await signUp(email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>ArthaPlan</h2>
        <p>Kelola keuanganmu dengan cerdas</p>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="contoh@mail.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Sembunyikan" : "Lihat"}
            </span>
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Ulangi Password</label>
              <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}

          <button type="submit" className={styles.authButton}>
            {isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
        </p>
      </div>
    </div>
  );
}