import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Sparkles, Wallet, Target, PiggyBank } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import PageHeader from '../components/PageHeader';
import styles from './ArthaReport.module.css';

export default function ArthaReport() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({ 
    income: 0, 
    expense: 0, 
    categories: [], 
    incomePercent: 0,
    expensePercent: 0,
    netBalance: 0,
    savingsRate: 0,
    topCategory: 'Belum ada data',
    transactionCount: 0
  });

  useEffect(() => {
    async function fetchReportData() {
      if (!user) return;

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        return;
      }

      const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
      
      const total = income + expense;
      const incomePercent = total > 0 ? (income / total) * 100 : 0;
      const expensePercent = total > 0 ? (expense / total) * 100 : 0;
      const netBalance = income - expense;
      const savingsRate = income > 0 ? ((netBalance > 0 ? netBalance : 0) / income) * 100 : 0;

      const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
          return acc;
        }, {});

      const categories = Object.keys(categoryTotals).map(key => ({
        name: key,
        value: categoryTotals[key]
      }));

      const topCategory = categories.length > 0
        ? categories.sort((a, b) => b.value - a.value)[0].name
        : 'Belum ada data';

      setReportData({
        income,
        expense,
        categories,
        incomePercent,
        expensePercent,
        netBalance,
        savingsRate,
        topCategory,
        transactionCount: transactions.length,
      });
    }

    fetchReportData();
  }, [user]);

  const COLORS = ['#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b', '#8b5cf6', '#f43f5e', '#ec4899', '#6366f1'];

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      y: -4, 
      borderColor: "rgba(16, 185, 129, 0.3)", 
      boxShadow: "0 8px 12px -1px rgba(5, 150, 105, 0.1)" 
    }
  };

  const insights = [
    {
      label: 'Net Balance',
      value: reportData.netBalance >= 0 ? `Rp ${reportData.netBalance.toLocaleString('id-ID')}` : `-Rp ${Math.abs(reportData.netBalance).toLocaleString('id-ID')}`,
      description: reportData.netBalance >= 0 ? 'Surplus bulan ini' : 'Defisit bulan ini',
      icon: Wallet,
      tone: reportData.netBalance >= 0 ? 'blue' : 'red',
    },
    {
      label: 'Savings Rate',
      value: `${reportData.savingsRate.toFixed(1)}%`,
      description: reportData.savingsRate >= 20 ? 'Sehat untuk target keuangan' : 'Perlu kontrol pengeluaran',
      icon: PiggyBank,
      tone: reportData.savingsRate >= 20 ? 'emerald' : 'amber',
    },
    {
      label: 'Top Category',
      value: reportData.topCategory,
      description: 'Kategori pengeluaran terbesar',
      icon: Target,
      tone: 'purple',
    },
    {
      label: 'Transaction Count',
      value: reportData.transactionCount,
      description: 'Total transaksi bulan ini',
      icon: BarChart3,
      tone: 'cyan',
    },
  ];

  const aiInsights = [
    reportData.expense > reportData.income
      ? 'Pengeluaran kamu saat ini lebih tinggi daripada pemasukan. Ini tanda perlu rem anggaran.'
      : 'Pemasukan kamu masih lebih besar dari pengeluaran. Kondisi ini relatif aman.',
    reportData.savingsRate >= 20
      ? `Tingkat menabungmu sehat di ${reportData.savingsRate.toFixed(1)}%.`
      : `Tingkat menabungmu masih rendah di ${reportData.savingsRate.toFixed(1)}%.`,
    reportData.topCategory !== 'Belum ada data'
      ? `Kategori pengeluaran terbesar adalah ${reportData.topCategory}.`
      : 'Belum ada kategori pengeluaran yang bisa dianalisis.',
    reportData.netBalance >= 0
      ? 'Target keuangan bulanan masih aman jika pola ini dipertahankan.'
      : 'Target keuangan berisiko tertunda jika pola pengeluaran tidak diubah.',
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={styles.reportContainer}
    >
      <PageHeader
        label="ARTHAREPORT"
        title="ArthaReport"
        subtitle="Analisis kondisi keuanganmu"
      />

      <motion.div 
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2 }}
        className={styles.statsSection}
      >
        <div className={styles.sectionHeader}>
          <BarChart3 size={20} strokeWidth={1.5} color="#059669" />
          <h3>Pemasukan vs Pengeluaran</h3>
        </div>
        <div className={styles.row}>
          <div className={styles.labelRow}>
            <span className={styles.labelWithIcon}>
              <TrendingUp size={18} strokeWidth={1.5} color="#10b981" />
              Pemasukan
            </span>
            <span className={styles.incomeAmount}>Rp {reportData.income.toLocaleString('id-ID')}</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFillIncome} 
              initial={{ width: 0 }}
              animate={{ width: `${reportData.incomePercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.labelRow}>
            <span className={styles.labelWithIcon}>
              <TrendingDown size={18} strokeWidth={1.5} color="#ef4444" />
              Pengeluaran
            </span>
            <span className={styles.expenseAmount}>Rp {reportData.expense.toLocaleString('id-ID')}</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFillExpense} 
              initial={{ width: 0 }}
              animate={{ width: `${reportData.expensePercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      <div className={styles.summaryGrid}>
        {insights.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ duration: 0.2, delay: 0.05 * index }}
              className={`${styles.summaryCard} ${styles[`tone_${item.tone}`]}`}
            >
              <div className={styles.summaryTop}>
                <div className={styles.summaryIcon}>
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <span className={styles.summaryLabel}>{item.label}</span>
              </div>
              <div className={styles.summaryValue}>{item.value}</div>
              <p className={styles.summaryDescription}>{item.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, delay: 0.1 }}
        className={styles.insightPanel}
      >
        <div className={styles.insightHeader}>
          <Sparkles size={20} strokeWidth={1.5} color="#059669" />
          <h3>AI Insight</h3>
        </div>
        <ul className={styles.insightList}>
          {aiInsights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </motion.div>

      <div className={styles.chartsGrid}>
        <motion.div 
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.2, delay: 0.1 }}
          className={styles.chartBox}
        >
          <h3 className={styles.chartTitle}>Distribusi Pemasukan vs Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: 'Bulan Ini', Pemasukan: reportData.income, Pengeluaran: reportData.expense }]}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(30, 41, 59, 0.95)', 
                  border: '1px solid rgba(236, 72, 153, 0.2)', 
                  borderRadius: '12px',
                  color: '#ffffff'
                }} 
              />
              <Bar dataKey="Pemasukan" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.2, delay: 0.2 }}
          className={styles.chartBox}
        >
          <h3 className={styles.chartTitle}>Kategori Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={reportData.categories} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80}
                strokeWidth={0}
              >
                {reportData.categories.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(30, 41, 59, 0.95)', 
                  border: '1px solid rgba(236, 72, 153, 0.2)', 
                  borderRadius: '12px',
                  color: '#ffffff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          {reportData.categories.length > 0 && (
            <div className={styles.legend}>
              {reportData.categories.map((cat, index) => (
                <div key={cat.name} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className={styles.legendLabel}>{cat.name}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
