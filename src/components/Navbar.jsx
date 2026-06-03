import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import Button from './Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          ArthaPlan
        </Link>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <a href="#features" className={styles.link}>
            Features
          </a>
          <a href="#features" className={styles.link}>
            Benefits
          </a>
          <a href="#features" className={styles.link}>
            Contact
          </a>
        </div>

        <div className={styles.authButtons}>
          <Link to="/login">
            <Button variant="secondary" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
