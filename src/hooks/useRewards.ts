import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Reward {
  reward_id: string;
  user_id: string;
  name: string;
  description: string | null;
  reward_type: 'Personal' | 'Company';
  gold_cost: number;
  status: 'Locked' | 'Unlocked' | 'Redeemed';
  date_unlocked: string | null;
}

export const useRewards = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('reward_type', { ascending: true })
        .order('status', { ascending: true });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockReward = async (rewardId: string, goldCost: number) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Check user's gold balance
      const { data: balance, error: balanceError } = await supabase
        .from('user_balances')
        .select('current_gold_balance, total_gold_spent')
        .eq('user_id', user.id)
        .single();

      if (balanceError || !balance) {
        return { success: false, error: 'Could not retrieve balance' };
      }

      if (balance.current_gold_balance < goldCost) {
        return { success: false, error: 'Insufficient gold' };
      }

      // Update reward status and deduct gold
      const { error: rewardError } = await supabase
        .from('rewards')
        .update({
          status: 'Unlocked',
          date_unlocked: new Date().toISOString()
        })
        .eq('reward_id', rewardId)
        .eq('user_id', user.id);

      if (rewardError) throw rewardError;

      // Update user balance
      const { error: balanceUpdateError } = await supabase
        .from('user_balances')
        .update({
          current_gold_balance: balance.current_gold_balance - goldCost,
          total_gold_spent: balance.total_gold_spent + goldCost
        })
        .eq('user_id', user.id);

      if (balanceUpdateError) throw balanceUpdateError;

      await fetchRewards();
      return { success: true };
    } catch (error) {
      console.error('Error unlocking reward:', error);
      return { success: false, error: 'Failed to unlock reward' };
    }
  };

  const redeemReward = async (rewardId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('rewards')
        .update({ status: 'Redeemed' })
        .eq('reward_id', rewardId)
        .eq('user_id', user.id)
        .eq('status', 'Unlocked');

      if (error) throw error;
      
      await fetchRewards();
      return { success: true };
    } catch (error) {
      console.error('Error redeeming reward:', error);
      return { success: false, error: 'Failed to redeem reward' };
    }
  };

  const createReward = async (rewardData: Omit<Reward, 'reward_id' | 'user_id' | 'date_unlocked'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .insert({
          ...rewardData,
          user_id: user.id,
        });

      if (error) throw error;
      await fetchRewards();
    } catch (error) {
      console.error('Error creating reward:', error);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('rewards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rewards',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchRewards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    rewards,
    loading,
    unlockReward,
    redeemReward,
    createReward,
    refetch: fetchRewards
  };
};