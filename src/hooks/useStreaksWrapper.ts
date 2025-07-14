import { useGuest } from '@/contexts/GuestContext';
import { useStreaks as useRealStreaks } from '@/hooks/useStreaks';

const createGuestStreaks = () => [
  {
    id: 'guest-streak-1',
    user_id: 'guest',
    streak_name: 'Daily Habits Streak',
    description: 'Consecutive days completing at least one daily habit',
    current_streak: 3,
    best_streak: 7,
    status: 'Active' as const,
    last_activity_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'guest-streak-2',
    user_id: 'guest',
    streak_name: 'Focus Completion Streak',
    description: 'Consecutive days completing all Today\'s Focus quests',
    current_streak: 1,
    best_streak: 5,
    status: 'Active' as const,
    last_activity_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'guest-streak-3',
    user_id: 'guest',
    streak_name: 'Weekly Goals Streak',
    description: 'Consecutive weeks hitting productivity targets',
    current_streak: 0,
    best_streak: 2,
    status: 'Inactive' as const,
    last_activity_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useStreaks = () => {
  const { isGuestMode } = useGuest();
  const realStreaks = useRealStreaks();

  if (isGuestMode) {
    return {
      streaks: createGuestStreaks(),
      loading: false,
      updateStreak: () => Promise.resolve(),
      createStreak: () => Promise.resolve(),
      deleteStreak: () => Promise.resolve(),
      refetch: () => Promise.resolve(),
    };
  }

  return realStreaks;
};