import { useState } from 'react';
import styles from './AddTransactionModal.module.css';

export default function DepositGoalModal({ goal, isOpen, onClose, onSave }) {
  const [amount, setAmount] = useState('');

  // 1. Tambahkan pengecekan isOpen dan goal agar tidak crash saat data belum siap
  if (!isOpen || !goal) return null;

  // 2. Hitung sisa (remaining) secara aman di sini
  const target = Number(goal.target_amount) || 0;
  const saved = Number(goal.saved_amount) || 0;
  const remaining = target - saved;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Tambah Tabungan</h3>
        
        {/* 3. Gunakan nilai remaining yang sudah dihitung di atas */}
        <p>{goal.name} · Sisa Rp {remaining.toLocaleString('id-ID')}</p>
        
        <input 
          type="number" 
          placeholder="Nominal yang ditambahkan" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)} 
        />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          <button onClick={onClose}>Batal</button>
          <button onClick={() => onSave(amount)}>Tambahkan</button>
        </div>
      </div>
    </div>
  );
}