import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Wallet, Plus, Calendar } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import PageHeader from '../components/PageHeader';
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
      alert("Gagal mencatat transaksi: " + transError.message);
    } else {
      setIsDepositOpen(false);
      fetchGoals();
      window.location.reload(); 
    }
  };

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
      className={styles.goalContainer}
    >
      <PageHeader
        label="ARTHAGOAL"
        title="ArthaGoal"
        subtitle={
          <span className={styles.headerSubtitle}>
            <Wallet size={18} strokeWidth={1.5} color="#ffffff" />
            Saldo Tersedia: <strong>Rp {totalSaldo.toLocaleString('id-ID')}</strong>
          </span>
        }
      />

      <div className={styles.summaryGrid}>
        <motion.div 
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.2 }}
          className={styles.summaryCard}
        >
          <div className={styles.summaryHeader}>
            <Target size={20} strokeWidth={1.5} color="#ec4899" />
            <p>Total Target</p>
          </div>
          <h2>Rp {goals.reduce((acc, g) => acc + Number(g.target_amount), 0).toLocaleString('id-ID')}</h2>
        </motion.div>
        <motion.div 
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.2, delay: 0.1 }}
          className={styles.summaryCard}
        >
          <div className={styles.summaryHeader}>
            <Wallet size={20} strokeWidth={1.5} color="#06b6d4" />
            <p>Total Terkumpul</p>
          </div>
          <h2>Rp {goals.reduce((acc, g) => acc + Number(g.saved_amount), 0).toLocaleString('id-ID')}</h2>
        </motion.div>
      </div>

      <motion.button 
        className={styles.addButton} 
        onClick={() => setIsAddOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={18} strokeWidth={2} />
        Buat Target Baru
      </motion.button>

      <div className={styles.goalList}>
        {loading ? (
          <p className={styles.loadingText}>Memuat data...</p>
        ) : goals.length > 0 ? (
          goals.map((goal, index) => {
            const target = Number(goal.target_amount) || 0;
            const saved = Number(goal.saved_amount) || 0;
            const progress = target > 0 ? (saved / target) * 100 : 0;
            const isCompleted = saved >= target;
            const diffDays = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <motion.div 
                key={goal.id} 
                className={styles.goalCard}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <div className={styles.goalHeader}>
                  <h3 className={styles.goalName}>
                    <Target size={20} strokeWidth={1.5} color="#ec4899" />
                    {goal.name}
                  </h3>
                  {diffDays !== null && (
                    <span className={styles.daysLeftBadge}>
                      <Calendar size={14} strokeWidth={1.5} />
                      {diffDays >= 0 ? `${diffDays} hari lagi` : "Selesai"}
                    </span>
                  )}
                </div>
                <div className={styles.progressBarContainer}>
                  <motion.div 
                    className={styles.progressBarFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className={styles.goalFooter}>
                  <span className={styles.progressText}>{progress.toFixed(0)}% tercapai</span>
                  <span className={styles.remainingText}>
                    {isCompleted ? "Tercapai!" : `Sisa Rp ${(target - saved).toLocaleString('id-ID')}`}
                  </span>
                </div>
                <motion.button 
                  className={styles.depositBtn} 
                  onClick={() => { setSelectedGoal(goal); setIsDepositOpen(true); }}
                  disabled={isCompleted}
                  whileHover={!isCompleted ? { scale: 1.02 } : {}}
                  whileTap={!isCompleted ? { scale: 0.98 } : {}}
                  style={{ opacity: isCompleted ? 0.6 : 1, cursor: isCompleted ? 'not-allowed' : 'pointer' }}
                >
                  {isCompleted ? "Selesai" : (
                    <>
                      <Plus size={18} strokeWidth={2} />
                      Tambah Saldo
                    </>
                  )}
                </motion.button>
              </motion.div>
            );
          })
        ) : (
          <p className={styles.emptyText}>Belum ada target.</p>
        )}
      </div>

      <AddGoalModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={() => { fetchGoals(); setIsAddOpen(false); }} />
      {selectedGoal && (
        <DepositGoalModal goal={selectedGoal} isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} onSave={handleDeposit} />
      )}
    </motion.div>
  );
}
