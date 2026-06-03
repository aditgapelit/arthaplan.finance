import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import styles from './AddTransactionModal.module.css';

export default function AddGoalModal({ isOpen, onClose, onSave }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    target_amount: '', 
    deadline: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount) {
      alert("Nama dan Nominal target wajib diisi!");
      return;
    }

    setLoading(true);
    
    const { error } = await supabase
      .from('goals')
      .insert([
        {
          name: formData.name,
          target_amount: Number(formData.target_amount),
          saved_amount: 0,
          deadline: formData.deadline,
          user_id: user.id
        }
      ]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      onSave();
      setFormData({ name: '', target_amount: '', deadline: '' });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.modalOverlay}
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
            <h3 className={styles.modalTitle}>Target Baru</h3>
            <motion.button 
              className={styles.closeBtn}
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} strokeWidth={1.5} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Target size={18} strokeWidth={1.5} color="#059669" />
                Nama Target
              </label>
              <input 
                type="text" 
                className={styles.input}
                placeholder="Contoh: Liburan ke Bali" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <DollarSign size={18} strokeWidth={1.5} color="#059669" />
                Nominal Target (Rp)
              </label>
              <input 
                type="number" 
                className={styles.input}
                placeholder="Contoh: 5000000" 
                value={formData.target_amount}
                onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Calendar size={18} strokeWidth={1.5} color="#059669" />
                Deadline
              </label>
              <input 
                type="date" 
                className={styles.input}
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})} 
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
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Menyimpan...' : 'Simpan Target'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
