import { useState } from 'react';
import styles from './Auth.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    try {
      setLoading(true);
      if (isLogin) await signIn(email, password);
      else await signUp(email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h2 className={styles.logo}>ArthaPlan</h2>
            <p className={styles.tagline}>Kelola keuanganmu dengan cerdas</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formHeader}>
              <h3>{isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}</h3>
              <p>{isLogin ? 'Kelola keuangan dengan mudah' : 'Mulai perjalanan finansial Anda'}</p>
            </div>

            <FormInput
              label="Email"
              type="email"
              placeholder="nama@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
            />

            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              icon={
                <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              }
              onIconClick={() => setShowPassword(!showPassword)}
            />

            {!isLogin && (
              <FormInput
                label="Ulangi Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                name="confirmPassword"
                icon={
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: 'pointer' }}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                }
                onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}

            {isLogin && (
              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Ingat saya</label>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
            </Button>
          </form>

          <div className={styles.authFooter}>
            <p>
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button
                type="button"
                className={styles.toggleButton}
                onClick={toggleMode}
              >
                {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>

        <div className={styles.authIllustration}>
          <div className={styles.illustrationCard}>
            <div className={styles.illustrationContent}>
              <div className={styles.icon}>💳</div>
              <h4>Transaksi Aman</h4>
              <p>Keamanan tingkat bank untuk setiap transaksi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
