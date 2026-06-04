import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import styles from './ArthaTrack.module.css';
import AddTransactionModal from '../components/AddTransactionModal';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

export default function ArthaTrack() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState(["Menganalisis pola pengeluaran..."]);

  const expenseStats = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
  }, [transactions]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') acc.income += amount;
      else if (t.type === 'expense') acc.expense += amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const buildFallbackInsights = (expenseStatsMap) => {
    const insights = [];
    const categories = Object.keys(expenseStatsMap);

    if (categories.length > 0) {
      const top = categories.reduce((a, b) => expenseStatsMap[a] > expenseStatsMap[b] ? a : b);
      const topAmount = expenseStatsMap[top];

      insights.push(`${top} menjadi pengeluaran terbesar (Rp ${topAmount.toLocaleString('id-ID')}).`);

      if (topAmount > 0) {
        insights.push(`Tren pengeluaran pada ${top} saat ini relatif stabil.`);
      }
    } else {
      insights.push("Mulai catat pengeluaran agar AI Learning bisa menganalisis pola belanjamu.");
    }

    setAiInsights(insights);
  };

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setTransactions(data || []);
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    async function runAiAnalysis() {
      const categories = Object.keys(expenseStats);
      
      if (categories.length > 0) {
        const top = categories.reduce((a, b) => expenseStats[a] > expenseStats[b] ? a : b);
        const topAmount = expenseStats[top];

        try {
          const response = await fetch(`${AI_API_BASE_URL}/api/ai/track`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category_name: top,
              category_history: [topAmount * 0.7, topAmount * 0.85, topAmount],
            }),
          });

          if (!response.ok) throw new Error('AI API failed');

          const data = await response.json();
          setAiInsights([
            `${top} menjadi pengeluaran terbesar (Rp ${topAmount.toLocaleString('id-ID')}).`,
            data.message || `Tren pengeluaran pada ${top} saat ini relatif stabil.`,
          ]);
        } catch {
          buildFallbackInsights(expenseStats);
        }
      } else {
        buildFallbackInsights(expenseStats);
      }
    }
    runAiAnalysis();
  }, [expenseStats]);

  const maxExpense = Math.max(...Object.values(expenseStats), 1);

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
      className={styles.trackContainer}
    >
      <PageHeader
        label="ARTHATRACK"
        title="ArthaTrack"
        subtitle="Lacak dan kelola transaksi keuanganmu"
      />

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
          <strong>ArthaAI Learning</strong>
        </div>
        <ul className={styles.insightList}>
          {aiInsights.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </motion.div>

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.1 }}
        className={styles.statsCard}
      >
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statHeader}>
              <TrendingUp size={20} strokeWidth={1.5} color="#10b981" />
              <p>Total Pemasukan</p>
            </div>
            <h3 className={styles.incomeValue}>Rp {totals.income.toLocaleString('id-ID')}</h3>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statHeader}>
              <TrendingDown size={20} strokeWidth={1.5} color="#ef4444" />
              <p>Total Pengeluaran</p>
            </div>
            <h3 className={styles.expenseValue}>Rp {totals.expense.toLocaleString('id-ID')}</h3>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.2 }}
        className={styles.statsCard}
      >
        <div className={styles.sectionHeader}>
          <BarChart3 size={20} strokeWidth={1.5} color="#059669" />
          <h3>Pengeluaran per Kategori</h3>
        </div>
        {Object.entries(expenseStats).length > 0 ? (
          Object.entries(expenseStats).map(([cat, total]) => (
            <div key={cat} className={styles.categoryItem}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{cat}</span>
                <span className={styles.categoryAmount}>Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div className={styles.categoryBar}>
                <motion.div 
                  className={styles.progressFill} 
                  initial={{ width: 0 }}
                  animate={{ width: `${(total / maxExpense) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>Belum ada data pengeluaran.</p>
        )}
      </motion.div>

      <motion.button 
        className={styles.addBtn} 
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={18} strokeWidth={2} />
        Tambah Transaksi
      </motion.button>

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.3 }}
        className={styles.statsCard}
      >
        <h3 className={styles.sectionTitle}>10 Transaksi Terakhir</h3>
        {transactions.slice(0, 10).map((t) => (
          <div key={t.id} className={styles.transactionItem}>
            <div>
              <strong className={styles.transactionDesc}>{t.description}</strong>
              <small className={styles.transactionCategory}>{t.category}</small>
            </div>
            <span className={t.type === 'expense' ? styles.expenseAmount : styles.incomeAmount}>
              {t.type === 'expense' ? '-' : '+'}Rp {Number(t.amount || 0).toLocaleString('id-ID')}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className={styles.emptyText}>Belum ada transaksi.</p>
        )}
      </motion.div>

      {isModalOpen && (
        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => { fetchTransactions(); setIsModalOpen(false); }} 
        />
      )}
    </motion.div>
  );
}
