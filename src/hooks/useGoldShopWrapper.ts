import { useGuest } from '@/contexts/GuestContext';
import { useGoldShop as useRealGoldShop } from '@/hooks/useGoldShop';

const createGuestShopItems = () => [
  {
    shop_item_id: 'guest-shop-1',
    name: 'Premium Focus Timer',
    description: 'Enhanced Pomodoro timer with custom sounds and analytics',
    category: 'LifeQuest' as const,
    gold_cost: 150,
    effect_description: 'Unlocks advanced timer features and productivity insights',
    duration_days: null,
    is_limited_edition: false,
    availability_status: 'Available' as const,
    user_id: null,
  },
  {
    shop_item_id: 'guest-shop-2',
    name: 'Motivational Quotes Pack',
    description: 'Daily inspirational quotes to boost your motivation',
    category: 'LifeQuest' as const,
    gold_cost: 75,
    effect_description: 'Receive daily motivational quotes in your dashboard',
    duration_days: 30,
    is_limited_edition: false,
    availability_status: 'Available' as const,
    user_id: null,
  },
  {
    shop_item_id: 'guest-shop-3',
    name: 'Achievement Booster',
    description: 'Temporarily increases XP gain from completed quests',
    category: 'LifeQuest' as const,
    gold_cost: 200,
    effect_description: '+25% XP bonus for all completed quests',
    duration_days: 7,
    is_limited_edition: true,
    availability_status: 'Available' as const,
    user_id: null,
  },
  {
    shop_item_id: 'guest-shop-4',
    name: 'Custom Theme Package',
    description: 'Unlock exclusive dashboard themes and customization options',
    category: 'LifeQuest' as const,
    gold_cost: 300,
    effect_description: 'Access to premium themes and visual customizations',
    duration_days: null,
    is_limited_edition: false,
    availability_status: 'Available' as const,
    user_id: null,
  },
];

export const useGoldShop = () => {
  const { isGuestMode } = useGuest();
  const realGoldShop = useRealGoldShop();

  if (isGuestMode) {
    return {
      items: createGuestShopItems(),
      loading: false,
      purchaseItem: () => Promise.resolve({ success: true, error: undefined }),
      refetch: () => Promise.resolve(),
    };
  }

  return realGoldShop;
};