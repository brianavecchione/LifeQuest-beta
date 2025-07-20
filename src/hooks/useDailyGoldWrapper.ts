import { useGuest } from '@/contexts/GuestContext';
import { useDailyGold as useRealDailyGold } from '@/hooks/useDailyGold';

const createGuestDailyGoldData = () => {
  // Generate mock gold data for the last 7 days
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Mock gold earnings (0 for dailies, random for other quest types)
    const mockGold = Math.floor(Math.random() * 80) + 20; // Random gold between 20-100
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      gold: mockGold,
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: date.toISOString().split('T')[0]
    });
  }
  
  return data;
};

const createGuestWeeklyGoldData = () => {
  return [
    { date: 'This Week', gold: 280, period: 'Week of Dec 16' },
    { date: 'Last Week', gold: 345, period: 'Week of Dec 9' },
    { date: '2 weeks ago', gold: 220, period: 'Week of Dec 2' },
    { date: '3 weeks ago', gold: 315, period: 'Week of Nov 25' },
  ];
};

export const useDailyGold = () => {
  const { isGuestMode } = useGuest();
  const realDailyGold = useRealDailyGold();

  console.log('🏆 useDailyGoldWrapper Debug:', {
    isGuestMode,
    realDailyGoldData: realDailyGold.dailyGoldData,
    realDailyGoldLoading: realDailyGold.loading
  });

  if (isGuestMode) {
    return {
      dailyGoldData: createGuestDailyGoldData(),
      weeklyGoldData: createGuestWeeklyGoldData(),
      loading: false,
      refetch: () => Promise.resolve(),
    };
  }

  return realDailyGold;
};