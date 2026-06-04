import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, Target, Sparkles, PlusCircle, FileBarChart, ArrowRightLeft, CircleDollarSign } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import PageHeader from '../components/PageHeader';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || '/.netlify/functions';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const balance = useBalance();
  const [stats, setStats] = useState({ income: 0, expense: 0, activeGoals: 0, totalGoals: 0, userName: '', topCategory: 'Belum ada data' });
  const [aiMessages, setAiMessages] = useState(["Menganalisis keuangan Anda..."]);

  const generateFallbackInsight = (inc, exp, activeGoals, totalGoals, prediction, topCategory) => {
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

    if (topCategory && topCategory !== 'Belum ada data') {
      messages.push(`Kategori terbesar kamu saat ini: ${topCategory}.`);
    }

    setAiMessages(messages);
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
      const topCategory = trans
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
          return acc;
        }, {});

      const sortedTopCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Belum ada data';

      setStats({
        income: inc,
        expense: exp,
        activeGoals: activeGoalsCount,
        totalGoals: totalGoalsCount,
        userName: formattedName,
        topCategory: sortedTopCategory,
      });

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
      } catch {
        const fallbackPrediction = expenseHistory[expenseHistory.length - 1] || null;
        generateFallbackInsight(inc, exp, activeGoalsCount, totalGoalsCount, fallbackPrediction, sortedTopCategory);
      }
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

  const goalProgress = stats.totalGoals > 0 ? (stats.activeGoals / stats.totalGoals) * 100 : 0;
  const goalChartData = [
    { name: 'Completed', value: stats.totalGoals > 0 ? stats.totalGoals - stats.activeGoals : 0, fill: '#10b981' },
    { name: 'Active', value: stats.activeGoals, fill: '#f59e0b' },
  ].filter(item => item.value > 0);

  const quickActions = [
    { label: 'Tambah Transaksi', icon: PlusCircle, action: () => navigate('/track'), color: '#0ea5e9' },
    { label: 'Tambah Goal', icon: Target, action: () => navigate('/goal'), color: '#8b5cf6' },
    { label: 'Lihat Report', icon: FileBarChart, action: () => navigate('/report'), color: '#f59e0b' },
    { label: 'Kelola Track', icon: ArrowRightLeft, action: () => navigate('/track'), color: '#14b8a6' },
  ];

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

      <div className={styles.dashboardGrid}>
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.2, delay: 0.05 }}
          className={styles.goalProgressCard}
        >
          <div className={styles.sectionHeading}>
            <Target size={20} strokeWidth={1.5} color="#059669" />
            <h3>Progress to Goal</h3>
          </div>
          <div className={styles.goalChartWrap}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={goalChartData.length > 0 ? goalChartData : [{ name: 'Empty', value: 1, fill: '#e2e8f0' }]}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={95}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {(goalChartData.length > 0 ? goalChartData : [{ fill: '#e2e8f0' }]).map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.goalChartCenter}>
              <span className={styles.goalChartValue}>{Math.round(goalProgress)}%</span>
              <span className={styles.goalChartLabel}>goal progress</span>
            </div>
          </div>
          <p className={styles.goalProgressText}>
            {stats.totalGoals > 0
              ? `${stats.activeGoals} dari ${stats.totalGoals} target masih aktif.`
              : 'Belum ada target keuangan yang dibuat.'}
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.2, delay: 0.1 }}
          className={styles.quickActionsCard}
        >
          <div className={styles.sectionHeading}>
            <CircleDollarSign size={20} strokeWidth={1.5} color="#059669" />
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className={styles.quickActionButton}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    '--action-color': item.color,
                    background: `linear-gradient(135deg, ${item.color}14, rgba(255,255,255,0.94))`,
                  }}
                >
                  <span className={styles.quickActionIcon}>
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
          <div className={styles.topCategoryBadge}>
            <span>Kategori terbesar:</span>
            <strong>{stats.topCategory}</strong>
          </div>
        </motion.div>
      </div>

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
