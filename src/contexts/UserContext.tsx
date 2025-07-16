import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDailyXp } from '@/hooks/useDailyXpWrapper';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

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
  refetchDailyXp: () => Promise<void>;
  forceProfileRefresh: () => Promise<void>;
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
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const { dailyXpData, weeklyXpData, refetch: refetchDailyXp } = useDailyXp();
  const { toast } = useToast();

  // Load user profile data from Supabase
  const loadUserProfile = async () => {
    if (!authUser) {
      // Clear user data and localStorage when logged out
      setUser(emptyUser);
      setPreviousLevel(null);
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
        // Calculate level and XP progress using progressive formula
        const totalXp = profile.xp_balance;
        
        // Progressive XP formula: cumulative XP to reach level n = baseXP * (n * (n + 1)) / 2
        const baseXP = 100;
        
        // Calculate current level based on total XP
        let currentLevel = 1;
        while (true) {
          const xpForLevel = baseXP * (currentLevel * (currentLevel + 1)) / 2;
          if (totalXp < xpForLevel) break;
          currentLevel++;
        }
        
        // Calculate XP progress within current level
        const currentLevelXpThreshold = currentLevel > 1 ? baseXP * ((currentLevel - 1) * currentLevel) / 2 : 0;
        const nextLevelXpThreshold = baseXP * (currentLevel * (currentLevel + 1)) / 2;
        const xpInCurrentLevel = totalXp - currentLevelXpThreshold;
        const xpRequiredForNextLevel = nextLevelXpThreshold - currentLevelXpThreshold;
        const progressPercentage = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;
        
        // Map Supabase profile to UserData format
        const userData: UserData = {
          name: profile.display_name || 'Adventurer',
          level: currentLevel,
          xp: Math.max(0, progressPercentage), // Progress percentage toward next level
          xpToNext: 100, // Always 100% for display purposes
          totalXp: totalXp, // Use database as source of truth
          gold: profile.gold_balance, // Use database as source of truth
          pomodoroCount: settings.pomodoroCount || 0,
          dailyXp: {}, // No longer used, keep for compatibility
          reduceAnimations: settings.reduceAnimations || false,
          avatar: profile.avatar_url || (profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'A'),
        };
        
        // Update state with database values as source of truth
        setUser(prev => {
          const newUserData = {
            ...userData,
            // Only preserve local-only settings, use database for XP/gold
            pomodoroCount: prev.pomodoroCount || userData.pomodoroCount,
            reduceAnimations: prev.reduceAnimations || userData.reduceAnimations,
            // Keep empty dailyXp since we're using database now
            dailyXp: {},
          };
          
          // Check for level up and trigger celebration
          if (previousLevel !== null && currentLevel > previousLevel && !prev.reduceAnimations) {
            // Delay celebration to allow state update and avoid multiple triggers
            setTimeout(() => triggerLevelUpCelebration(currentLevel), 200);
          }
          
          // Update previous level tracking
          if (previousLevel === null) {
            setPreviousLevel(currentLevel);
          } else if (currentLevel !== previousLevel) {
            setPreviousLevel(currentLevel);
          }
          
          return newUserData;
        });
      } else {
        // Use default user data if no profile found
        setUser({
          ...emptyUser,
          name: authUser.user_metadata?.display_name || 'Adventurer',
          pomodoroCount: settings.pomodoroCount || 0,
          dailyXp: {},
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
    console.log('🔄 Loading user profile data after stat correction...');
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
        reduceAnimations: user.reduceAnimations,
      };
      localStorage.setItem('lifequest-user-settings', JSON.stringify(localSettings));
    }
  }, [user.pomodoroCount, user.reduceAnimations, isLoading, authUser]);

  const updateUser = async (updates: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...updates }));
    
    // If avatar is being updated and user is authenticated, save to database
    if (updates.avatar && authUser) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: updates.avatar })
          .eq('user_id', authUser.id);
          
        if (error) {
          console.error('Error updating avatar in database:', error);
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
      }
    }
  };

  const triggerLevelUpCelebration = (newLevel: number) => {
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#92400e']
    });

    // Toast notification
    toast({
      title: "🎉 Level Up!",
      description: `Congratulations! You've reached Level ${newLevel}!`,
      duration: 5000,
    });
  };

  // ONLY for bonus rewards (like Pomodoro bonuses) - LOCAL STATE ONLY
  // Database trigger handles ALL regular quest rewards
  const addXP = async (amount: number) => {
    console.log(`🎁 Adding bonus XP: ${amount} (LOCAL STATE ONLY - not calling database)`);
    
    // Update ONLY local state for immediate UI feedback
    setUser(prev => {
      const newTotalXp = prev.totalXp + amount;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;
      const originalLevel = prev.level;

      // Level up logic
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel++;
        newXpToNext = newLevel * 100; // Simple formula: each level needs level * 100 XP
      }

      // Trigger celebration if level increased
      if (newLevel > originalLevel) {
        // Delay celebration to allow state update
        setTimeout(() => triggerLevelUpCelebration(newLevel), 100);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNext: newXpToNext,
        totalXp: newTotalXp,
        dailyXp: {}, // Keep empty since we use database
      };
    });

    // NO DATABASE CALLS - the database trigger handles quest rewards
    // This function should only be used for immediate UI feedback for bonus rewards
    // The database sync will happen through profile refresh
  };

  const addGold = async (amount: number) => {
    console.log(`🎁 Adding bonus Gold: ${amount} (LOCAL STATE ONLY - not calling database)`);
    
    // Update ONLY local state immediately
    setUser(prev => ({ ...prev, gold: prev.gold + amount }));
    
    // NO DATABASE CALLS - the database trigger handles quest rewards
    // This function should only be used for immediate UI feedback for bonus rewards
    // The database sync will happen through profile refresh
  };

  const subtractXP = async (amount: number) => {
    console.log(`📉 Subtracting XP: ${amount} (LOCAL STATE ONLY - not calling database)`);
    
    // Update ONLY local state immediately
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

      return {
        ...prev,
        xp: Math.max(0, newXp),
        level: newLevel,
        xpToNext: newXpToNext,
        totalXp: newTotalXp,
        dailyXp: {}, // Keep empty since we use database
      };
    });

    // NO DATABASE CALLS - the database trigger handles quest rewards
    // This function should only be used for immediate UI feedback
    // The database sync will happen through profile refresh
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
    return dailyXpData;
  };

  const getWeeklyXpData = () => {
    return weeklyXpData;
  };

  const forceProfileRefresh = async () => {
    console.log('🔄 Force refreshing user profile data after stat correction...');
    
    // Clear any cached values
    setUser(emptyUser);
    setPreviousLevel(null);
    setIsLoading(true);
    
    // Force reload from database
    await loadUserProfile();
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
    refetchDailyXp,
    forceProfileRefresh,
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