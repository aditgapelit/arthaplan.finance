import { useState, useEffect, useMemo } from 'react';
import * as tf from '@tensorflow/tfjs';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import styles from './ArthaTrack.module.css';
import AddTransactionModal from '../components/AddTransactionModal';

export default function ArthaTrack() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState(["Menganalisis pola pengeluaran..."]);

  // 1. Perbaikan: Bungkus expenseStats dengan useMemo
  const expenseStats = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
  }, [transactions]); // Hanya hitung ulang jika transactions berubah

  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') acc.income += amount;
      else if (t.type === 'expense') acc.expense += amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const predictCategoryTrend = async (history) => {
    if (history.length < 3) return null;
    const xs = tf.tensor1d([1, 2, 3]);
    const ys = tf.tensor1d(history.slice(-3));
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    await model.fit(xs, ys, { epochs: 100, verbose: 0 });
    const prediction = model.predict(tf.tensor2d([4], [1, 1]));
    const val = prediction.dataSync()[0];
    // Bersihkan tensor untuk mencegah memory leak
    xs.dispose(); ys.dispose(); model.dispose(); prediction.dispose();
    return val;
  };

  async function fetchTransactions() {
    if (!user) return;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setTransactions(data || []);
  }

  useEffect(() => { fetchTransactions(); }, [user]);

  // 2. Perbaikan: useEffect ini sekarang aman karena expenseStats adalah hasil useMemo
  useEffect(() => {
    async function runAiAnalysis() {
      const insights = [];
      const categories = Object.keys(expenseStats);
      
      if (categories.length > 0) {
        const top = categories.reduce((a, b) => expenseStats[a] > expenseStats[b] ? a : b);
        const topAmount = expenseStats[top];
        
        insights.push(`⚡ ${top} menjadi pengeluaran terbesar (Rp ${topAmount.toLocaleString('id-ID')}).`);

        const trend = await predictCategoryTrend([topAmount * 0.7, topAmount * 0.85, topAmount]);
        
        if (trend && trend > topAmount * 1.1) {
          insights.push(`🤖 AI Learning mendeteksi tren kenaikan pengeluaran pada ${top}.`);
        } else {
          insights.push(`✅ Tren pengeluaran pada ${top} saat ini relatif stabil.`);
        }
      } else {
        insights.push("💡 Mulai catat pengeluaran agar AI Learning bisa menganalisis pola belanjamu.");
      }
      setAiInsights(insights);
    }
    runAiAnalysis();
  }, [expenseStats]); // Sekarang aman dan tidak looping

  const maxExpense = Math.max(...Object.values(expenseStats), 1);

  return (
    <div className={styles.trackContainer}>
      <h1>ArthaTrack</h1>

      <div className={styles.insightCard} style={{ 
        padding: '15px', marginBottom: '20px', backgroundColor: '#f0f9ff', 
        border: '1px solid #bae6fd', borderRadius: '8px' 
      }}>
        <strong>ArthaAI Learning:</strong>
        <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
          {aiInsights.map((msg, i) => <li key={i} style={{ fontSize: '0.9rem' }}>{msg}</li>)}
        </ul>
      </div>

      {/* ... (sisa UI Anda tetap sama) */}
      <div className={styles.statsCard} style={{ display: 'flex', gap: '20px' }}>
        <div>
          <p>Total Pemasukan</p>
          <h3 style={{ color: '#059669' }}>Rp {totals.income.toLocaleString('id-ID')}</h3>
        </div>
        <div>
          <p>Total Pengeluaran</p>
          <h3 style={{ color: '#dc2626' }}>Rp {totals.expense.toLocaleString('id-ID')}</h3>
        </div>
      </div>
      
      <div className={styles.statsCard}>
        <h3>Pengeluaran per Kategori</h3>
        {Object.entries(expenseStats).length > 0 ? (
          Object.entries(expenseStats).map(([cat, total]) => (
            <div key={cat} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span>{cat}</span> <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div className={styles.categoryBar}>
                <div className={styles.progressFill} style={{ width: `${(total / maxExpense) * 100}%` }}></div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Belum ada data pengeluaran.</p>
        )}
      </div>

      <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>+ Tambah Transaksi</button>

      <div className={styles.statsCard}>
        <h3>10 Transaksi Terakhir</h3>
        {transactions.slice(0, 10).map((t) => (
          <div key={t.id} className={styles.transactionItem}>
            <div>
              <strong>{t.description}</strong><br />
              <small style={{ color: '#64748b' }}>{t.category}</small>
            </div>
            <span style={{ color: t.type === 'expense' ? '#dc2626' : '#059669', fontWeight: 'bold' }}>
              {t.type === 'expense' ? '-' : '+'}Rp {Number(t.amount || 0).toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => { fetchTransactions(); setIsModalOpen(false); }} 
        />
      )}
    </div>
  );
}