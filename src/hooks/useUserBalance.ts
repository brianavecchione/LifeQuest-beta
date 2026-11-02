import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserBalance {
  user_id: string;
  current_gold_balance: number;
  total_gold_earned: number;
  total_gold_spent: number;
  inventory_slots_used: number;
  inventory_capacity: number;
}

const useUserBalanceState = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setBalance(data);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInventorySlots = async (slotsUsed: number) => {
    if (!user || !balance) return;

    try {
      const { error } = await supabase
        .from('user_balances')
        .update({ inventory_slots_used: slotsUsed })
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchBalance();
    } catch (error) {
      console.error('Error updating inventory slots:', error);
    }
  };

  const addGold = async (amount: number) => {
    if (!user || !balance) return;

    try {
      const { error } = await supabase
        .from('user_balances')
        .update({
          current_gold_balance: balance.current_gold_balance + amount,
          total_gold_earned: balance.total_gold_earned + amount
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchBalance();
    } catch (error) {
      console.error('Error adding gold:', error);
    }
  };

  const spendGold = async (amount: number): Promise<boolean> => {
    if (!user || !balance || balance.current_gold_balance < amount) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_balances')
        .update({
          current_gold_balance: balance.current_gold_balance - amount,
          total_gold_spent: balance.total_gold_spent + amount
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchBalance();
      return true;
    } catch (error) {
      console.error('Error spending gold:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`balance-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_balances',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchBalance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    balance,
    loading,
    updateInventorySlots,
    addGold,
    spendGold,
    refetch: fetchBalance
  };
};
type UserBalanceContextValue = ReturnType<typeof useUserBalanceState>;
const UserBalanceContext = createContext<UserBalanceContextValue | null>(null);

export const UserBalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useUserBalanceState();
  return React.createElement(UserBalanceContext.Provider, { value }, children);
};

export const useUserBalance = () => {
  const ctx = useContext(UserBalanceContext);
  if (!ctx) throw new Error('useUserBalance must be used within UserBalanceProvider');
  return ctx;
};
