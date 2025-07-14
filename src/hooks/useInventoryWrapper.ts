import { useGuest } from '@/contexts/GuestContext';
import { useInventory as useRealInventory } from '@/hooks/useInventory';

const createGuestInventory = () => [
  {
    item_id: 'guest-item-1',
    user_id: 'guest',
    name: 'Focus Headband',
    description: 'Increases concentration during work sessions',
    category: 'Gear' as const,
    rarity: 'Rare' as const,
    effect_description: '+15% XP from completed quests',
    duration_days: null,
    equipped: true,
    date_acquired: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    date_expiration: null,
  },
  {
    item_id: 'guest-item-2',
    user_id: 'guest',
    name: 'Productivity Dragon',
    description: 'A faithful companion that helps with daily tasks',
    category: 'Companion' as const,
    rarity: 'Epic' as const,
    effect_description: 'Daily quests give +5 bonus gold',
    duration_days: null,
    equipped: false,
    date_acquired: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    date_expiration: null,
  },
  {
    item_id: 'guest-item-3',
    user_id: 'guest',
    name: 'Coffee of Motivation',
    description: 'Temporary boost for morning productivity',
    category: 'Gear' as const,
    rarity: 'Common' as const,
    effect_description: '+20% XP for the next 4 hours',
    duration_days: 1,
    equipped: false,
    date_acquired: new Date().toISOString(),
    date_expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useInventory = () => {
  const { isGuestMode } = useGuest();
  const realInventory = useRealInventory();

  if (isGuestMode) {
    return {
      items: createGuestInventory(),
      loading: false,
      equipItem: () => Promise.resolve(),
      addToInventory: () => Promise.resolve(),
      refetch: () => Promise.resolve(),
    };
  }

  return realInventory;
};