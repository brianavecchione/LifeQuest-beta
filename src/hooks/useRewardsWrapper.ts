import { useGuest } from '@/contexts/GuestContext';
import { useRewards as useRealRewards } from '@/hooks/useRewards';

const createGuestRewards = () => [
  {
    reward_id: 'guest-reward-1',
    user_id: 'guest',
    name: 'Coffee Break',
    description: 'Treat yourself to a premium coffee at your favorite café',
    reward_type: 'Personal' as const,
    gold_cost: 50,
    status: 'Unlocked' as const,
    date_unlocked: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reward_id: 'guest-reward-2',
    user_id: 'guest',
    name: 'Movie Night',
    description: 'Watch that movie you\'ve been wanting to see',
    reward_type: 'Personal' as const,
    gold_cost: 120,
    status: 'Locked' as const,
    date_unlocked: null,
  },
  {
    reward_id: 'guest-reward-3',
    user_id: 'guest',
    name: 'New Book Purchase',
    description: 'Buy a book from your reading wishlist',
    reward_type: 'Personal' as const,
    gold_cost: 80,
    status: 'Redeemed' as const,
    date_unlocked: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    reward_id: 'guest-reward-4',
    user_id: 'guest',
    name: 'Flexible Work Day',
    description: 'Choose your own schedule for a workday',
    reward_type: 'Company' as const,
    gold_cost: 200,
    status: 'Locked' as const,
    date_unlocked: null,
  },
  {
    reward_id: 'guest-reward-5',
    user_id: 'guest',
    name: 'Team Lunch Sponsorship',
    description: 'Sponsor lunch for your team',
    reward_type: 'Company' as const,
    gold_cost: 150,
    status: 'Unlocked' as const,
    date_unlocked: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const useRewards = () => {
  const { isGuestMode } = useGuest();
  const realRewards = useRealRewards();

  if (isGuestMode) {
    return {
      rewards: createGuestRewards(),
      loading: false,
      unlockReward: () => Promise.resolve({ success: true, error: undefined }),
      redeemReward: () => Promise.resolve({ success: true, error: undefined }),
      createReward: () => Promise.resolve(),
      refetch: () => Promise.resolve(),
    };
  }

  return realRewards;
};