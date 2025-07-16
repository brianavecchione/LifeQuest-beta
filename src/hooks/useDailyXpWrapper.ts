import { useGuest } from '@/contexts/GuestContext';
import { useDailyXp as useRealDailyXp } from '@/hooks/useDailyXp';

const createGuestDailyXpData = (guestDailyXp: Record<string, number>) => {
  // Generate XP data for the last 7 days based on actual guest XP tracking
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Use actual guest XP data or 0 if no data for that day
    const xp = guestDailyXp[dateStr] || 0;
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      xp: xp,
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: dateStr
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
  const { isGuestMode, guestUser } = useGuest();
  const realDailyXp = useRealDailyXp();

  if (isGuestMode) {
    return {
      dailyXpData: createGuestDailyXpData(guestUser.dailyXp),
      weeklyXpData: createGuestWeeklyXpData(),
      loading: false,
      refetch: () => Promise.resolve(),
    };
  }

  return realDailyXp;
};