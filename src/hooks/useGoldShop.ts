import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GoldShopItem {
  shop_item_id: string;
  name: string;
  description: string | null;
  category: 'Personal' | 'LifeQuest';
  gold_cost: number;
  effect_description: string | null;
  duration_days: number | null;
  is_limited_edition: boolean;
  availability_status: 'Available' | 'SoldOut' | 'Unavailable';
  user_id: string | null;
}

export const useGoldShop = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<GoldShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShopItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gold_shop_items')
        .select('*')
        .order('category', { ascending: true })
        .order('gold_cost', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching shop items:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (itemId: string, goldCost: number) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Check user's gold balance first
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

      // Deduct gold and update balances
      const { error: updateError } = await supabase
        .from('user_balances')
        .update({
          current_gold_balance: balance.current_gold_balance - goldCost,
          total_gold_spent: balance.total_gold_spent + goldCost
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error('Error purchasing item:', error);
      return { success: false, error: 'Purchase failed' };
    }
  };

  useEffect(() => {
    fetchShopItems();
  }, []);

  return {
    items,
    loading,
    purchaseItem,
    refetch: fetchShopItems
  };
};