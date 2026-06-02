import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as tf from '@tensorflow/tfjs'; 
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const balance = useBalance();
  const [stats, setStats] = useState({ income: 0, expense: 0, activeGoals: 0, userName: '' });
  const [aiMessages, setAiMessages] = useState(["Menganalisis keuangan Anda..."]);

  const getAiPrediction = async (expenses) => {
    if (expenses.length < 3) return null;
    const xs = tf.tensor1d([1, 2, 3]); 
    const ys = tf.tensor1d(expenses.slice(-3)); 
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    await model.fit(xs, ys, { epochs: 100, verbose: 0 });
    const prediction = model.predict(tf.tensor2d([4], [1, 1]));
    return prediction.dataSync()[0];
  };

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      const nameFromEmail = user.email.split('@')[0];
      const rawName = user.user_metadata?.full_name || nameFromEmail;
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      const { data: trans } = await supabase.from('transactions').select('amount, type').eq('user_id', user.id);
      const { data: goals } = await supabase.from('goals').select('saved_amount, target_amount').eq('user_id', user.id);

      const inc = trans?.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0) || 0;
      const exp = trans?.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0) || 0;
      const totalGoalsCount = goals ? goals.length : 0;
      const activeGoalsCount = goals ? goals.filter(g => Number(g.saved_amount) < Number(g.target_amount)).length : 0;

      setStats({ income: inc, expense: exp, activeGoals: activeGoalsCount, userName: formattedName });
      const prediction = await getAiPrediction([exp * 0.8, exp * 0.9, exp]); 
      
      generateInsight(inc, exp, activeGoalsCount, totalGoalsCount, prediction);
    }
    fetchDashboardData();
  }, [user]);

  const generateInsight = (inc, exp, activeGoals, totalGoals, prediction) => {
    let messages = [];
    const ratio = inc > 0 ? (exp / inc) : 0;

    // 1. Analisis AI Learning
    if (prediction && prediction > inc) {
      messages.push(`⚠️ AI memprediksi pengeluaran bulan depan tinggi: Rp ${Math.round(prediction).toLocaleString('id-ID')}.`);
    }

    // 2. Analisis Target
    if (totalGoals === 0) {
      messages.push("💡 Kamu belum punya target keuangan. Mulai buat satu!");
    } else if (activeGoals === 0 && totalGoals > 0) {
      messages.push("🎉 Semua target keuanganmu sudah tercapai!");
    } else {
      messages.push(`🎯 Kamu sedang mengejar ${activeGoals} target keuangan.`);
    }

    // 3. Analisis Klasifikasi Pengeluaran
    if (inc > 0) {
      if (ratio > 0.8) {
        messages.push("⚠️ Pengeluaranmu cukup tinggi (Boros).");
      } else if (ratio < 0.4) {
        messages.push("✨ Pengeluaranmu sangat hemat!");
      } else {
        messages.push("✅ Pengeluaranmu dalam kondisi stabil.");
      }
    }

    setAiMessages(messages);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={styles.container}>
      <header className={styles.header}>
        <motion.h1 initial={{ x: -20 }} animate={{ x: 0 }}>Dashboard</motion.h1>
        <p>Selamat datang kembali, {stats.userName}! 👋</p>
      </header>
      
      <motion.div whileHover={{ scale: 1.01 }} className={styles.insightCard}>
        💡 <strong>ArthaAI Insight:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          {aiMessages.map((msg, index) => <li key={index}>{msg}</li>)}
        </ul>
      </motion.div>

      <motion.div whileHover={{ scale: 1.01 }} className={styles.balanceCard}>
        <p>Total Saldo</p>
        <h2>Rp {balance.toLocaleString('id-ID')}</h2>
        <div className={styles.subStats}>
          <span>↑ Pemasukan: Rp {stats.income.toLocaleString('id-ID')}</span>
          <span>↓ Pengeluaran: Rp {stats.expense.toLocaleString('id-ID')}</span>
        </div>
      </motion.div>

      <div className={styles.grid}>
        {[
          { title: "Pemasukan Total", val: stats.income },
          { title: "Pengeluaran Total", val: stats.expense },
          { title: "Target Aktif", val: stats.activeGoals, isCount: true }
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className={styles.smallCard}>
            {item.title} <h3>{item.isCount ? item.val : `Rp ${item.val.toLocaleString('id-ID')}`}</h3>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}