import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign } from 'lucide-react';
import styles from './AddTransactionModal.module.css';

export default function DepositGoalModal({ goal, isOpen, onClose, onSave }) {
  const [amount, setAmount] = useState('');

  if (!isOpen || !goal) return null;

  const target = Number(goal.target_amount) || 0;
  const saved = Number(goal.saved_amount) || 0;
  const remaining = target - saved;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      onSave(amount);
      setAmount('');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.modalOverlay}
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={styles.modalContent}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Tambah Tabungan</h3>
            <motion.button 
              className={styles.closeBtn}
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} strokeWidth={1.5} />
            </motion.button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '16px', 
            background: 'rgba(5, 150, 105, 0.1)', 
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <Target size={20} strokeWidth={1.5} color="#059669" />
            <div>
              <p style={{ margin: 0, color: '#0f172a', fontWeight: 600, letterSpacing: '-0.02em' }}>{goal.name}</p>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                Sisa Rp {remaining.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <DollarSign size={18} strokeWidth={1.5} color="#059669" />
                Nominal yang ditambahkan
              </label>
              <input 
                type="number" 
                className={styles.input}
                placeholder="Contoh: 500000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.buttonGroup}>
              <motion.button 
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Batal
              </motion.button>
              <motion.button 
                type="submit"
                className={styles.saveBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tambahkan
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
