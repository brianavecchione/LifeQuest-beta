import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalXp: number;
  gold: number;
  pomodoroCount: number;
  dailyXp: Record<string, number>; // Track XP by date (YYYY-MM-DD format)
  reduceAnimations: boolean; // Accessibility setting to reduce animations
  avatar: string; // Avatar image URL or identifier
}

interface UserContextType {
  user: UserData;
  isLoading: boolean;
  updateUser: (updates: Partial<UserData>) => void;
  addXP: (amount: number) => void;
  subtractXP: (amount: number) => void;
  addGold: (amount: number) => void;
  subtractGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  incrementPomodoro: () => void;
  getDailyXpData: () => Array<{ date: string; xp: number; day: string }>;
  getWeeklyXpData: () => Array<{ date: string; xp: number; period: string }>;
  refetchUserProfile: () => Promise<void>;
}

const emptyUser: UserData = {
  name: '',
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalXp: 0,
  gold: 0,
  pomodoroCount: 0,
  dailyXp: {},
  reduceAnimations: false,
  avatar: '',
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserData>(emptyUser);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile data from Supabase
  const loadUserProfile = async () => {
    if (!authUser) {
      // Clear user data and localStorage when logged out
      setUser(emptyUser);
      localStorage.removeItem('lifequest-user');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch user profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
      }

      // Load local settings from localStorage
      const localSettings = localStorage.getItem('lifequest-user-settings');
      const settings = localSettings ? JSON.parse(localSettings) : {};

      if (profile) {
        // Calculate current level XP from total XP and level
        const currentLevelXp = profile.user_level * 100 + Math.max(profile.user_level - 1, 0) * 50;
        const previousLevelXp = profile.user_level > 1 
          ? (profile.user_level - 1) * 100 + Math.max(profile.user_level - 2, 0) * 50 
          : 0;
        const xpInCurrentLevel = profile.xp_balance - previousLevelXp;
        
        // Map Supabase profile to UserData format
        const userData: UserData = {
          name: profile.display_name || 'Adventurer',
          level: profile.user_level,
          xp: Math.max(0, xpInCurrentLevel), // XP progress within current level
          xpToNext: currentLevelXp - previousLevelXp, // XP needed for next level
          totalXp: profile.xp_balance, // Use database as source of truth
          gold: profile.gold_balance, // Use database as source of truth
          pomodoroCount: settings.pomodoroCount || 0,
          dailyXp: settings.dailyXp || {},
          reduceAnimations: settings.reduceAnimations || false,
          avatar: profile.avatar_url || (profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'A'),
        };
        
        // Update state with database values as source of truth
        setUser(prev => ({
          ...userData,
          // Only preserve local-only settings, use database for XP/gold
          pomodoroCount: prev.pomodoroCount || userData.pomodoroCount,
          reduceAnimations: prev.reduceAnimations || userData.reduceAnimations,
          // Preserve dailyXp for chart functionality
          dailyXp: prev.dailyXp || userData.dailyXp,
        }));
      } else {
        // Use default user data if no profile found
        setUser({
          ...emptyUser,
          name: authUser.user_metadata?.display_name || 'Adventurer',
          pomodoroCount: settings.pomodoroCount || 0,
          dailyXp: settings.dailyXp || {},
          reduceAnimations: settings.reduceAnimations || false,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser({
        ...emptyUser,
        name: authUser.user_metadata?.display_name || 'Adventurer'
      });
      setIsLoading(false);
    }
  };

  // Load user profile data from Supabase when auth user changes
  useEffect(() => {
    loadUserProfile();

    // Set up real-time subscription to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${authUser?.id}`
        },
        (payload) => {
          console.log('Profile updated:', payload);
          // When profile updates from database, reload to sync local state
          loadUserProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser]);

  // Save to localStorage whenever user data changes (but only local settings)
  useEffect(() => {
    if (!isLoading && authUser) {
      const localSettings = {
        pomodoroCount: user.pomodoroCount,
        dailyXp: user.dailyXp,
        reduceAnimations: user.reduceAnimations,
      };
      localStorage.setItem('lifequest-user-settings', JSON.stringify(localSettings));
    }
  }, [user.pomodoroCount, user.dailyXp, user.reduceAnimations, isLoading, authUser]);

  const updateUser = (updates: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      const newTotalXp = prev.totalXp + amount;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;

      // Level up logic
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel++;
        newXpToNext = newLevel * 100; // Simple formula: each level needs level * 100 XP
      }

      // Track daily XP
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const currentDailyXp = prev.dailyXp || {};
      const updatedDailyXp = {
        ...currentDailyXp,
        [today]: (currentDailyXp[today] || 0) + amount
      };

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNext: newXpToNext,
        totalXp: newTotalXp,
        dailyXp: updatedDailyXp,
      };
    });
  };

  const addGold = (amount: number) => {
    setUser(prev => ({ ...prev, gold: prev.gold + amount }));
  };

  const subtractXP = (amount: number) => {
    setUser(prev => {
      const newTotalXp = Math.max(0, prev.totalXp - amount);
      let newXp = Math.max(0, prev.xp - amount);
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;

      // Level down logic if necessary
      while (newXp < 0 && newLevel > 1) {
        newLevel--;
        newXpToNext = newLevel * 100;
        newXp += newXpToNext;
      }

      // Track daily XP subtraction
      const today = new Date().toISOString().split('T')[0];
      const currentDailyXp = prev.dailyXp || {};
      const updatedDailyXp = {
        ...currentDailyXp,
        [today]: Math.max(0, (currentDailyXp[today] || 0) - amount)
      };

      return {
        ...prev,
        xp: Math.max(0, newXp),
        level: newLevel,
        xpToNext: newXpToNext,
        totalXp: newTotalXp,
        dailyXp: updatedDailyXp,
      };
    });
  };

  const subtractGold = (amount: number) => {
    setUser(prev => ({ ...prev, gold: Math.max(0, prev.gold - amount) }));
  };

  const spendGold = (amount: number): boolean => {
    if (user.gold >= amount) {
      setUser(prev => ({ ...prev, gold: prev.gold - amount }));
      return true;
    }
    return false;
  };

  const incrementPomodoro = () => {
    setUser(prev => ({ ...prev, pomodoroCount: prev.pomodoroCount + 1 }));
  };

  const getDailyXpData = () => {
    const last7Days = [];
    const today = new Date();
    
    // Ensure dailyXp exists
    const dailyXpData = user.dailyXp || {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      last7Days.push({
        date: dayName,
        xp: dailyXpData[dateStr] || 0,
        day: fullDayName
      });
    }
    
    return last7Days;
  };

  const getWeeklyXpData = () => {
    const last4Weeks = [];
    const today = new Date();
    
    // Ensure dailyXp exists
    const dailyXpData = user.dailyXp || {};
    
    for (let weekOffset = 3; weekOffset >= 0; weekOffset--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (weekOffset * 7) - today.getDay());
      
      let weeklyXp = 0;
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        weeklyXp += dailyXpData[dateStr] || 0;
      }
      
      last4Weeks.push({
        date: `Week ${4 - weekOffset}`,
        xp: weeklyXp,
        period: `Week of ${weekStart.toLocaleDateString()}`
      });
    }
    
    return last4Weeks;
  };

  const value: UserContextType = {
    user,
    isLoading,
    updateUser,
    addXP,
    subtractXP,
    addGold,
    subtractGold,
    spendGold,
    incrementPomodoro,
    getDailyXpData,
    getWeeklyXpData,
    refetchUserProfile: loadUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};