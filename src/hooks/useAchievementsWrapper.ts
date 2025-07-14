import { useGuest } from '@/contexts/GuestContext';
import { useAchievements as useRealAchievements } from '@/hooks/useAchievements';

const createGuestAchievements = () => [
  {
    id: 'guest-achievement-1',
    achievement_name: 'First Steps',
    description: 'Complete your first quest',
    achievement_progress_current: 3,
    achievement_progress_goal: 1,
    is_completed: true,
    is_unlockable: true,
    quest_value: 'Bronze' as const,
    xp_reward: 25,
    gold_reward: 10,
    earned_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    claimed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['starter', 'milestone'],
  },
  {
    id: 'guest-achievement-2',
    achievement_name: 'Daily Warrior',
    description: 'Complete 7 daily quests',
    achievement_progress_current: 4,
    achievement_progress_goal: 7,
    is_completed: false,
    is_unlockable: true,
    quest_value: 'Silver' as const,
    xp_reward: 50,
    gold_reward: 25,
    earned_at: null,
    claimed_at: null,
    tags: ['daily', 'consistency'],
  },
  {
    id: 'guest-achievement-3',
    achievement_name: 'Legendary Explorer',
    description: 'Complete a legendary quest',
    achievement_progress_current: 0,
    achievement_progress_goal: 1,
    is_completed: false,
    is_unlockable: false,
    quest_value: 'Legendary' as const,
    xp_reward: 200,
    gold_reward: 100,
    earned_at: null,
    claimed_at: null,
    tags: ['legendary', 'challenge'],
  },
];

export const useAchievements = () => {
  const { isGuestMode } = useGuest();
  const realAchievements = useRealAchievements();

  if (isGuestMode) {
    return {
      achievements: createGuestAchievements(),
      loading: false,
      updateAchievementProgress: () => Promise.resolve(),
      createUserAchievement: () => Promise.resolve(),
      claimAchievement: () => Promise.resolve({ success: true, achievement: null }),
      refetch: () => Promise.resolve(),
    };
  }

  return realAchievements;
};