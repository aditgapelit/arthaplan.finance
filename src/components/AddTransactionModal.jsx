import { useState } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import styles from './AddTransactionModal.module.css';

export default function AddTransactionModal({ isOpen, onClose, onSave }) {
  const { user } = useAuth();
  
  // 1. Definisikan kategori untuk masing-masing tipe
  const categoryOptions = {
    expense: ['Makanan', 'Transportasi', 'Belanja', 'Hiburan', 'Pendidikan', 'Tagihan', 'Lainnya'],
    income: ['Gaji', 'Bonus', 'Freelance', 'Investasi', 'Lainnya']
  };

  const [formData, setFormData] = useState({ 
    description: '', amount: '', type: 'expense', category: 'Makanan' 
  });

  // 2. Fungsi untuk menangani perubahan tipe agar kategori otomatis update
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({ 
      ...formData, 
      type: newType, 
      category: categoryOptions[newType][0] // Set kategori default sesuai tipe
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Tambah Transaksi</h3>
        <input placeholder="Deskripsi" onChange={(e) => setFormData({...formData, description: e.target.value})} />
        <input type="number" placeholder="Nominal (Rp)" onChange={(e) => setFormData({...formData, amount: e.target.value})} />
        
        {/* Dropdown Tipe */}
        <select value={formData.type} onChange={handleTypeChange}>
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>

        {/* Dropdown Kategori Dinamis */}
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
          {categoryOptions[formData.type].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        
        <button onClick={handleSubmit} className={styles.saveBtn}>Simpan</button>
        <button onClick={onClose}>Batal</button>
      </div>
    </div>
  );
}