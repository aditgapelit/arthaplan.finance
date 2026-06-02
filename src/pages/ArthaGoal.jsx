import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import AddGoalModal from '../components/AddGoalModal';
import DepositGoalModal from '../components/DepositGoalModal';
import styles from './ArthaGoal.module.css';

export default function ArthaGoal() {
  const { user } = useAuth();
  const totalSaldo = useBalance();
  const [goals, setGoals] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchGoals();
  }, [user]);

  async function fetchGoals() {
    setLoading(true);
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    if (!error) setGoals(data || []);
    setLoading(false);
  }

  const handleDeposit = async (amount) => {
    if (!selectedGoal || !amount) return;

    const depositAmount = Number(amount);

    const { error: goalError } = await supabase
      .from('goals')
      .update({ saved_amount: Number(selectedGoal.saved_amount) + depositAmount })
      .eq('id', selectedGoal.id);

    if (goalError) {
      console.error("Error update goal:", goalError);
      alert("Gagal memperbarui target.");
      return;
    }

    const { error: transError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          amount: depositAmount,
          type: 'expense',
          description: `Deposit ke goal: ${selectedGoal.name}`,
          category: 'Tabungan',
          transaction_date: new Date().toISOString().split('T')[0]
        }
      ]);

    if (transError) {
      console.error("Error Supabase:", transError);
      alert("Gagal mencatat transaksi: " + transError.message);
    } else {
      setIsDepositOpen(false);
      fetchGoals();
      window.location.reload(); 
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.goalContainer}>
      <header>
        <h1>ArthaGoal</h1>
        <p>Saldo Tersedia: <strong>Rp {totalSaldo.toLocaleString('id-ID')}</strong></p>
      </header>

      <div className={styles.summaryGrid}>
        <motion.div whileHover={{ scale: 1.02 }} className={styles.summaryCard}>
          <p>Total Target</p>
          <h2>Rp {goals.reduce((acc, g) => acc + Number(g.target_amount), 0).toLocaleString('id-ID')}</h2>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className={styles.summaryCard}>
          <p>Total Terkumpul</p>
          <h2>Rp {goals.reduce((acc, g) => acc + Number(g.saved_amount), 0).toLocaleString('id-ID')}</h2>
        </motion.div>
      </div>

      <button className={styles.addButton} onClick={() => setIsAddOpen(true)}>+ Buat Target Baru</button>

      <div className={styles.goalList}>
        {loading ? <p>Memuat data...</p> : goals.length > 0 ? (
          goals.map(goal => {
            const target = Number(goal.target_amount) || 0;
            const saved = Number(goal.saved_amount) || 0;
            const progress = target > 0 ? (saved / target) * 100 : 0;
            const isCompleted = saved >= target; // Logika status selesai
            const diffDays = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <motion.div key={goal.id} className={styles.goalCard} whileHover={{ y: -5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{goal.emoji || '🎯'} {goal.name}</h3>
                  {diffDays !== null && (
                    <span className={styles.daysLeftBadge}>{diffDays >= 0 ? `${diffDays} hari lagi` : "Selesai"}</span>
                  )}
                </div>
                <div className={styles.progressBarContainer}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} className={styles.progressBarFill} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.9rem', color: '#64748b' }}>
                  <span>{progress.toFixed(0)}% tercapai</span>
                  <span>{isCompleted ? "Tercapai!" : `Sisa Rp ${(target - saved).toLocaleString('id-ID')}`}</span>
                </div>
                <button 
                  className={styles.depositBtn} 
                  onClick={() => { setSelectedGoal(goal); setIsDepositOpen(true); }}
                  disabled={isCompleted}
                  style={{ opacity: isCompleted ? 0.6 : 1, cursor: isCompleted ? 'not-allowed' : 'pointer' }}
                >
                  {isCompleted ? "Selesai" : "+ Tambah Saldo"}
                </button>
              </motion.div>
            );
          })
        ) : <p>Belum ada target.</p>}
      </div>

      <AddGoalModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={() => { fetchGoals(); setIsAddOpen(false); }} />
      {selectedGoal && (
        <DepositGoalModal goal={selectedGoal} isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} onSave={handleDeposit} />
      )}
    </motion.div>
  );
}