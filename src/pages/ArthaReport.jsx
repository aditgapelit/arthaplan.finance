import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import styles from './ArthaReport.module.css';

export default function ArthaReport() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({ 
    income: 0, 
    expense: 0, 
    categories: [], 
    incomePercent: 0,
    expensePercent: 0
  });

  useEffect(() => {
    if (user) fetchReportData();
  }, [user]);

  async function fetchReportData() {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error("Error fetching report:", error);
      return;
    }

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    
    const total = income + expense;
    const incomePercent = total > 0 ? (income / total) * 100 : 0;
    const expensePercent = total > 0 ? (expense / total) * 100 : 0;

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

    setReportData({ income, expense, categories, incomePercent, expensePercent });
  }

  const COLORS = ['#ef4444', '#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

  return (
    <div className={styles.reportContainer}>
      <h1>ArthaReport</h1>
      <p>Analisis kondisi keuanganmu</p>

      {/* Perbandingan Pemasukan vs Pengeluaran */}
      <div className={styles.statsSection}>
        <h3>Pemasukan vs Pengeluaran</h3>
        <div className={styles.row}>
          <div className={styles.labelRow}>
            <span>Pemasukan</span>
            <span>Rp {reportData.income.toLocaleString('id-ID')}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFillIncome} style={{ width: `${reportData.incomePercent}%` }}></div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.labelRow}>
            <span>Pengeluaran</span>
            <span>Rp {reportData.expense.toLocaleString('id-ID')}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFillExpense} style={{ width: `${reportData.expensePercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartBox}>
          <h3>Distribusi Pemasukan vs Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: 'Bulan Ini', Pemasukan: reportData.income, Pengeluaran: reportData.expense }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Pemasukan" fill="#10b981" />
              <Bar dataKey="Pengeluaran" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartBox}>
          <h3>Kategori Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={reportData.categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {reportData.categories.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}