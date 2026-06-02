import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      if (!user) return;
      
      // Ambil data transaksi khusus milik user yang sedang login
      const { data } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id); 

      if (data) {
        const total = data.reduce((acc, t) => {
          return t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount);
        }, 0);
        setBalance(total);
      }
    }
    fetchBalance();
  }, [user]);

  return balance;
}