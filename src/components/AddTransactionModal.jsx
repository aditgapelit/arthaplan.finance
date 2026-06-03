import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, DollarSign, Tag, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import styles from './AddTransactionModal.module.css';

export default function AddTransactionModal({ isOpen, onClose, onSave }) {
  const { user } = useAuth();
  
  const categoryOptions = {
    expense: ['Makanan', 'Transportasi', 'Belanja', 'Hiburan', 'Pendidikan', 'Tagihan', 'Lainnya'],
    income: ['Gaji', 'Bonus', 'Freelance', 'Investasi', 'Lainnya']
  };

  const [formData, setFormData] = useState({ 
    description: '', amount: '', type: 'expense', category: 'Makanan' 
  });

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({ 
      ...formData, 
      type: newType, 
      category: categoryOptions[newType][0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login diperlukan!");

    const { error } = await supabase.from('transactions').insert([{ 
      user_id: user.id,
      description: formData.description,
      amount: formData.amount,
      category: formData.category,
      type: formData.type
    }]);

    if (error) alert("Gagal: " + error.message);
    else onSave();
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
            <h3 className={styles.modalTitle}>Tambah Transaksi</h3>
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
                <FileText size={18} strokeWidth={1.5} color="#94a3b8" />
                Deskripsi
              </label>
              <input 
                className={styles.input}
                placeholder="Contoh: Makan siang" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <DollarSign size={18} strokeWidth={1.5} color="#94a3b8" />
                Nominal (Rp)
              </label>
              <input 
                type="number" 
                className={styles.input}
                placeholder="Contoh: 50000" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <ArrowRightLeft size={18} strokeWidth={1.5} color="#94a3b8" />
                Tipe
              </label>
              <select 
                className={styles.select}
                value={formData.type} 
                onChange={handleTypeChange}
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Tag size={18} strokeWidth={1.5} color="#94a3b8" />
                Kategori
              </label>
              <select 
                className={styles.select}
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categoryOptions[formData.type].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
                Simpan
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
