import { useGuest } from '@/contexts/GuestContext';
import { useUserBalance as useRealUserBalance } from '@/hooks/useUserBalance';

const createGuestUserBalance = () => ({
  user_id: 'guest',
  current_gold_balance: 185,
  total_gold_earned: 420,
  total_gold_spent: 235,
  inventory_slots_used: 3,
  inventory_capacity: 15,
});

export const useUserBalance = () => {
  const { isGuestMode } = useGuest();
  const realUserBalance = useRealUserBalance();

  if (isGuestMode) {
    return {
      balance: createGuestUserBalance(),
      loading: false,
      updateInventorySlots: () => Promise.resolve(),
      addGold: () => Promise.resolve(),
      spendGold: () => Promise.resolve(true),
      refetch: () => Promise.resolve(),
    };
  }

  return realUserBalance;
};