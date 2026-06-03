import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Zap,
  CreditCard,
  Smartphone,
  Bell,
  BarChart3,
  Target,
  Lock,
  Wallet,
  Sparkles,
  ArrowRight,
  Code2,
  MessageCircle,
  Share2,
} from 'lucide-react';
import styles from './Landing.module.css';
import Navbar from '../components/Navbar';

export default function Landing() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: CreditCard,
      title: 'Multi-Account Support',
      description: 'Kelola berbagai akun bank dari satu dashboard terpadu',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Akses keuangan Anda kapan saja, di mana saja dengan mudah',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Notifikasi real-time untuk transaksi penting dan anomali',
    },
    {
      icon: BarChart3,
      title: 'Investment Tracking',
      description: 'Monitor portfolio investasi Anda secara real-time dan akurat',
    },
    {
      icon: Target,
      title: 'Budget Planning',
      description: 'Buat dan kelola budget untuk setiap kategori pengeluaran',
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'Privasi data Anda adalah prioritas utama kami setiap waktu',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 60px rgba(5, 150, 105, 0.2)',
    },
  };

  return (
    <div className={styles.landingContainer}>
      {/* Background Decorations */}
      <div className={styles.bgGlowPink}></div>
      <div className={styles.bgGlowCyan}></div>
      <div className={styles.bgGrid}></div>

      <Navbar />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Announcement Pill */}
          <motion.div className={styles.announcementPill} variants={itemVariants}>
            <Sparkles size={16} className={styles.sparkleIcon} />
            <span>Memperkenalkan ArthaPlan 2.0</span>
          </motion.div>

          {/* H1 Title */}
          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            Manage Your Finances with
            <span className={styles.gradientText}> Confidence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p className={styles.heroSubtitle} variants={itemVariants}>
            Platform manajemen keuangan pribadi yang cerdas, aman, dan mudah digunakan untuk mencapai
            tujuan finansial Anda dengan strategi yang tepat.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className={styles.heroButtons} variants={itemVariants}>
            <motion.button
              className={styles.primaryBtn}
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <ArrowRight size={18} />
            </motion.button>
            <motion.button
              className={styles.secondaryBtn}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Card - Right Side */}
        <motion.div
          className={styles.heroImage}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className={styles.floatingCard}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className={styles.cardGradient}></div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <Wallet size={24} className={styles.walletIcon} />
                <span className={styles.cardLabel}>Total Balance</span>
              </div>
              <h2 className={styles.cardAmount}>$24,580.50</h2>
              <div className={styles.cardFooter}>
                <TrendingUp size={16} className={styles.trendingIcon} />
                <p className={styles.cardInfo}>+5.2% from last month</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Logo Marquee Section */}
      <section className={styles.marqueeSection}>
        <div className={styles.marqueeContent}>
          <span className={styles.marqueeText}>Dipercaya oleh lebih dari 10.000+ pengguna</span>
          <div className={styles.logoContainer}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.logoItem}>
                <TrendingUp size={24} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Powerful Features</h2>
          <p className={styles.sectionSubtitle}>
            Semua yang Anda butuhkan untuk mengelola keuangan dengan efisien
          </p>
        </motion.div>

        <motion.div
          className={styles.featuresGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                className={styles.featureCard}
                variants={cardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`${styles.iconWrapper} ${hoveredCard === idx ? styles.hovered : ''}`}>
                  <Icon size={32} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.cardGlowBorder}></div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        className={styles.ctaSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.ctaGlow}></div>
        <motion.div
          className={styles.ctaContent}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.ctaTitle}>Ready to Take Control of Your Finances?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of users who are already managing their finances smarter and achieving their goals
          </p>
          <motion.button
            className={styles.ctaBtn}
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Free Account
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>ArthaPlan</h4>
            <p>Platform manajemen keuangan pribadi yang cerdas</p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="GitHub">
                <Code2 size={20} />
              </a>
              <a href="#" aria-label="Twitter">
                <MessageCircle size={20} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Share2 size={20} />
              </a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#security">Security</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <a href="#features">About Us</a>
            <a href="#features">Blog</a>
            <a href="#features">Contact</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
        <div className={styles.footerDivider}></div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 ArthaPlan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
