import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';

export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchBalance() {
      if (!user?.id) {
        if (active) setBalance(0);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id);

      if (error || !active) return;

      const total = (data || []).reduce((acc, t) => {
        return t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount);
      }, 0);

      setBalance(total);
    }

    fetchBalance();

    return () => {
      active = false;
    };
  }, [user]);

  return balance;
}
