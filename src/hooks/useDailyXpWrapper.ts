import { useGuest } from '@/contexts/GuestContext';
import { useDailyXp as useRealDailyXp } from '@/hooks/useDailyXp';

const createGuestDailyXpData = () => {
  // Generate realistic looking XP data for the last 7 days
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Vary XP between 0-80 to simulate realistic usage
    const xp = i === 0 ? 35 : // Today
              i === 1 ? 60 : // Yesterday  
              i === 2 ? 0 :  // Day before (missed day)
              i === 3 ? 45 : // 3 days ago
              i === 4 ? 25 : // 4 days ago
              i === 5 ? 50 : // 5 days ago
              30; // 6 days ago
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      xp: xp,
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: date.toISOString().split('T')[0]
    });
  }
  
  return data;
};

const createGuestWeeklyXpData = () => {
  return [
    { date: 'Week 1', xp: 180, period: 'Week of Dec 16' },
    { date: 'Week 2', xp: 245, period: 'Week of Dec 23' },
    { date: 'Week 3', xp: 320, period: 'Week of Dec 30' },
    { date: 'Week 4', xp: 215, period: 'Week of Jan 6' },
  ];
};

export const useDailyXp = () => {
  const { isGuestMode } = useGuest();
  const realDailyXp = useRealDailyXp();

  if (isGuestMode) {
    return {
      dailyXpData: createGuestDailyXpData(),
      weeklyXpData: createGuestWeeklyXpData(),
      loading: false,
      refetch: () => Promise.resolve(),
    };
  }

  return realDailyXp;
};