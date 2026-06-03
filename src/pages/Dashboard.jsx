import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Target, Sparkles } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import PageHeader from '../components/PageHeader';
import styles from './Dashboard.module.css';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const { user } = useAuth();
  const balance = useBalance();
  const [stats, setStats] = useState({ income: 0, expense: 0, activeGoals: 0, userName: '' });
  const [aiMessages, setAiMessages] = useState(["Menganalisis keuangan Anda..."]);

  const generateFallbackInsight = (inc, exp, activeGoals, totalGoals, prediction) => {
    const messages = [];
    const ratio = inc > 0 ? exp / inc : 0;

    if (prediction && prediction > inc) {
      messages.push(`AI memprediksi pengeluaran bulan depan tinggi: Rp ${Math.round(prediction).toLocaleString('id-ID')}.`);
    }

    if (totalGoals === 0) {
      messages.push("Kamu belum punya target keuangan. Mulai buat satu!");
    } else if (activeGoals === 0) {
      messages.push("Semua target keuanganmu sudah tercapai!");
    } else {
      messages.push(`Kamu sedang mengejar ${activeGoals} target keuangan.`);
    }

    if (inc > 0) {
      if (ratio > 0.8) {
        messages.push("Pengeluaranmu cukup tinggi (Boros).");
      } else if (ratio < 0.4) {
        messages.push("Pengeluaranmu sangat hemat!");
      } else {
        messages.push("Pengeluaranmu dalam kondisi stabil.");
      }
    }

    setAiMessages(messages);
  };

  const fetchAiInsights = async (inc, exp, activeGoalsCount, totalGoalsCount) => {
    const expenseHistory = [exp * 0.8, exp * 0.9, exp];

    try {
      const response = await fetch(`${AI_API_BASE_URL}/api/ai/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income: inc,
          expense: exp,
          active_goals: activeGoalsCount,
          total_goals: totalGoalsCount,
          expense_history: expenseHistory,
        }),
      });

      if (!response.ok) throw new Error('AI API failed');

      const data = await response.json();
      setAiMessages(Array.isArray(data.insights) && data.insights.length > 0 ? data.insights : ["Menganalisis keuangan Anda..."]);
      return;
    } catch (error) {
      const fallbackPrediction = expenseHistory.length >= 3 ? expenseHistory[expenseHistory.length - 1] : null;
      generateFallbackInsight(inc, exp, activeGoalsCount, totalGoalsCount, fallbackPrediction);
    }
  };

  useEffect(() => {
    let active = true;

    async function fetchDashboardData() {
      if (!user?.id) return;

      const nameFromEmail = user.email.split('@')[0];
      const rawName = user.user_metadata?.full_name || nameFromEmail;
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      const [{ data: transData, error: transError }, { data: goalsData, error: goalsError }] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id),
      ]);

      if (!active || transError || goalsError) return;

      const trans = transData || [];
      const goals = goalsData || [];

      const inc = trans.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0) || 0;
      const exp = trans.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0) || 0;
      const totalGoalsCount = goals.length;
      const activeGoalsCount = goals.filter(g => Number(g.saved_amount) < Number(g.target_amount)).length;

      setStats({ income: inc, expense: exp, activeGoals: activeGoalsCount, userName: formattedName });
      await fetchAiInsights(inc, exp, activeGoalsCount, totalGoalsCount);
    }
    fetchDashboardData();
    return () => {
      active = false;
    };
  }, [user]);

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
      className={styles.container}
    >
      <PageHeader
        label="DASHBOARD"
        title={`Selamat datang, ${stats.userName || 'Pengguna'}!`}
        avatar={(stats.userName || 'P').charAt(0).toUpperCase()}
      >
        <div className={styles.statItem}>
          <span className={styles.statLabel}>SALDO</span>
          <span className={styles.statValue}>Rp {balance.toLocaleString('id-ID')}</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statLabel}>PEMASUKAN</span>
          <span className={`${styles.statValue} ${styles.statIncome}`}>Rp {stats.income.toLocaleString('id-ID')}</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statLabel}>PENGELUARAN</span>
          <span className={`${styles.statValue} ${styles.statExpense}`}>Rp {stats.expense.toLocaleString('id-ID')}</span>
        </div>
      </PageHeader>
      
      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2 }}
        className={styles.insightCard}
      >
        <div className={styles.insightHeader}>
          <Sparkles size={20} strokeWidth={1.5} color="#059669" />
          <strong>ArthaAI Insight</strong>
        </div>
        <ul className={styles.insightList}>
          {aiMessages.map((msg, index) => <li key={index}>{msg}</li>)}
        </ul>
      </motion.div>

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.1 }}
        className={styles.balanceCard}
      >
        <div className={styles.balanceHeader}>
          <Wallet size={20} strokeWidth={1.5} color="#059669" />
          <p>Total Saldo</p>
        </div>
        <h2 className={styles.balanceAmount}>Rp {balance.toLocaleString('id-ID')}</h2>
        <div className={styles.subStats}>
          <span className={styles.incomeText}>
            <TrendingUp size={18} strokeWidth={1.5} color="#10b981" />
            Pemasukan: Rp {stats.income.toLocaleString('id-ID')}
          </span>
          <span className={styles.expenseText}>
            <TrendingDown size={18} strokeWidth={1.5} color="#ef4444" />
            Pengeluaran: Rp {stats.expense.toLocaleString('id-ID')}
          </span>
        </div>
      </motion.div>

      <div className={styles.grid}>
        {[
          { title: "Pemasukan Total", val: stats.income, icon: TrendingUp, iconColor: "#10b981" },
          { title: "Pengeluaran Total", val: stats.expense, icon: TrendingDown, iconColor: "#ef4444" },
          { title: "Target Aktif", val: stats.activeGoals, isCount: true, icon: Target, iconColor: "#059669" }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={i} 
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ duration: 0.2, delay: 0.2 + i * 0.1 }}
              className={styles.smallCard}
            >
              <div className={styles.smallCardHeader}>
                <Icon size={20} strokeWidth={1.5} color={item.iconColor} />
                <span className={styles.smallCardTitle}>{item.title}</span>
              </div>
              <h3 className={styles.smallCardValue}>
                {item.isCount ? item.val : `Rp ${item.val.toLocaleString('id-ID')}`}
              </h3>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
