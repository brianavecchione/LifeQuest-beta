/**
 * Comprehensive timezone utilities for accurate XP tracking and streak calculations
 * 
 * Key principles:
 * - All database timestamps stored in UTC
 * - All user-facing calculations use local timezone
 * - Calendar day boundaries based on user's local timezone
 */

/**
 * Get user's local timezone
 */
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Could not detect timezone, falling back to UTC');
    return 'UTC';
  }
};

/**
 * Get today's date in user's local timezone (YYYY-MM-DD format)
 */
export const getLocalToday = (): string => {
  const timezone = getUserTimezone();
  const now = new Date();
  
  // Use toLocaleDateString with explicit timezone to get correct local date
  const localDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  return localDate.toISOString().split('T')[0];
};

/**
 * Get a local date string for a given UTC timestamp
 */
export const getLocalDateFromUTC = (utcTimestamp: string): string => {
  const timezone = getUserTimezone();
  const utcDate = new Date(utcTimestamp);
  
  // Convert to local timezone and extract date
  const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: timezone }));
  return localDate.toISOString().split('T')[0];
};

/**
 * Get start and end of local day in UTC for database queries
 */
export const getLocalDayBoundariesUTC = (localDateStr: string) => {
  const timezone = getUserTimezone();
  
  // Create start of day in local timezone
  const startOfDay = new Date(localDateStr + 'T00:00:00');
  const endOfDay = new Date(localDateStr + 'T23:59:59.999');
  
  // Convert to UTC for database queries
  const startUTC = new Date(startOfDay.toLocaleString('en-US', { timeZone: 'UTC' }));
  const endUTC = new Date(endOfDay.toLocaleString('en-US', { timeZone: 'UTC' }));
  
  return {
    start: startUTC.toISOString(),
    end: endUTC.toISOString()
  };
};

/**
 * Get last N days in user's local timezone
 */
export const getLastNLocalDays = (n: number): string[] => {
  const timezone = getUserTimezone();
  const days: string[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Convert to local timezone and get date string
    const localDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    days.push(localDate.toISOString().split('T')[0]);
  }
  
  return days;
};

/**
 * Check if two UTC timestamps fall on the same local calendar day
 */
export const isSameLocalDay = (utcTimestamp1: string, utcTimestamp2: string): boolean => {
  const localDate1 = getLocalDateFromUTC(utcTimestamp1);
  const localDate2 = getLocalDateFromUTC(utcTimestamp2);
  return localDate1 === localDate2;
};

/**
 * Calculate days between two local dates
 */
export const daysBetweenLocalDates = (dateStr1: string, dateStr2: string): number => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Generate daily XP data with proper timezone handling
 */
export const generateDailyXpData = (xpHistory: Array<{ date: string; xp_earned: number }>) => {
  const last7LocalDays = getLastNLocalDays(7);
  
  // Create lookup map from database data
  const xpLookup: Record<string, number> = {};
  xpHistory.forEach(entry => {
    xpLookup[entry.date] = entry.xp_earned;
  });
  
  return last7LocalDays.map((dateStr, index) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    return {
      date: dayName,
      xp: xpLookup[dateStr] || 0,
      day: fullDayName,
      fullDate: dateStr // Add full date for debugging
    };
  });
};

/**
 * Calculate streaks with proper timezone handling
 */
export const calculateLocalStreaks = (completedTimestamps: string[]) => {
  // Convert all UTC timestamps to local dates
  const localDates = completedTimestamps
    .map(timestamp => getLocalDateFromUTC(timestamp))
    .filter((date, index, array) => array.indexOf(date) === index) // Remove duplicates
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Sort descending

  const todayLocal = getLocalToday();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (consecutive days from today backwards)
  for (let i = 0; ; i++) {
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = checkDate.toISOString().split('T')[0];
    
    if (localDates.includes(checkDateStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak ever
  for (let i = 0; i < localDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const currentDate = new Date(localDates[i]);
      const prevDate = new Date(localDates[i - 1]);
      const daysDiff = Math.abs((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays: localDates.length,
    completedDates: localDates
  };
};

/**
 * Debug timezone information
 */
export const debugTimezone = () => {
  const timezone = getUserTimezone();
  const now = new Date();
  const utcNow = now.toISOString();
  const localToday = getLocalToday();
  
  console.log('🕐 Timezone Debug Info:', {
    timezone,
    utcNow,
    localToday,
    utcOffset: now.getTimezoneOffset(),
    localeDateString: now.toLocaleDateString(),
    localeTimeString: now.toLocaleTimeString()
  });
  
  return { timezone, utcNow, localToday };
};