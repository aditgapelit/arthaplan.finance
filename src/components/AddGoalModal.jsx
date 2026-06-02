import { useState } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import styles from './AddTransactionModal.module.css';

export default function AddGoalModal({ isOpen, onClose, onSave }) {
  const { user } = useAuth();
  // State sesuai dengan field di image_0ca4a8.png
  const [formData, setFormData] = useState({ 
    name: '', 
    target_amount: '', 
    deadline: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.target_amount) {
      alert("Nama dan Nominal target wajib diisi!");
      return;
    }

    setLoading(true);
    
    // Query untuk menyimpan data ke tabel goals
    const { error } = await supabase
      .from('goals')
      .insert([
        {
          name: formData.name,
          target_amount: Number(formData.target_amount),
          saved_amount: 0, // Inisialisasi awal
          deadline: formData.deadline,
          user_id: user.id
        }
      ]);

    if (error) {
      console.error("Gagal simpan:", error);
      alert("Gagal simpan: " + error.message);
    } else {
      onSave(); // Refresh tampilan setelah sukses
      setFormData({ name: '', target_amount: '', deadline: '' });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Target Baru</h3>
        
        {/* Field Nama Target */}
        <input 
          type="text" 
          placeholder="Nama target" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        
        {/* Field Nominal Target */}
        <input 
          type="number" 
          placeholder="Nominal target (Rp)" 
          value={formData.target_amount}
          onChange={(e) => setFormData({...formData, target_amount: e.target.value})} 
        />
        
        {/* Field Deadline (dd/mm/yyyy) */}
        <input 
          type="date" 
          value={formData.deadline}
          onChange={(e) => setFormData({...formData, deadline: e.target.value})} 
        />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          <button onClick={onClose}>Batal</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Target'}
          </button>
        </div>
      </div>
    </div>
  );
}