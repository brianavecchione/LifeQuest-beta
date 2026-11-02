import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface InventoryItem {
  item_id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: 'Gear' | 'Companion';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  effect_description: string | null;
  duration_days: number | null;
  equipped: boolean;
  date_acquired: string;
  date_expiration: string | null;
}

export const useInventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .order('date_acquired', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const equipItem = async (itemId: string, equip: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({ equipped: equip })
        .eq('item_id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchInventory();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const addToInventory = async (itemData: Omit<InventoryItem, 'item_id' | 'user_id' | 'date_acquired'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          ...itemData,
          user_id: user.id,
        });

      if (error) throw error;
      await fetchInventory();
    } catch (error) {
      console.error('Error adding item to inventory:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`inventory-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    items,
    loading,
    equipItem,
    addToInventory,
    refetch: fetchInventory
  };
};