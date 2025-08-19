import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDailyXp } from '@/hooks/useDailyXpWrapper';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export interface UserData {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalXp: number;
  pomodoroCount: number;
  dailyXp: Record<string, number>;
  reduceAnimations: boolean;
  characterName?: string;
  avatarUrl?: string;
  avatarFrame?: string;
}

export interface UserContextType {
  user: UserData;
  isLoading: boolean;
  updateUser: (userData: Partial<UserData>) => Promise<void>;
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
  forceGoldRefresh: () => Promise<void>;
}

const emptyUser: UserData = {
  name: '',
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalXp: 0,
  pomodoroCount: 0,
  dailyXp: {},
  reduceAnimations: false,
  characterName: 'Adventurer',
  avatarUrl: undefined,
  avatarFrame: 'none'
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserData>(emptyUser);
  const [isLoading, setIsLoading] = useState(true);
  const { dailyXpData, weeklyXpData, refetch: refetchDailyXp } = useDailyXp();
  const { toast } = useToast();

  // Load user profile data from Supabase
  const loadUserProfile = async () => {
    if (!authUser) {
      setUser(emptyUser);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch user profile data - no longer includes gold_balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_level, xp_balance, display_name, avatar_url, avatar_frame')
        .eq('user_id', authUser.id)
        .single();

      // Fetch user settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
      }

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching user settings:', settingsError);
      }

      // Get pomodoro count from localStorage
      const localData = localStorage.getItem('lifequest-user-settings');
      const localSettings = localData ? JSON.parse(localData) : {};
      const pomodoroCount = localSettings.pomodoroCount || 0;

      if (profile) {
        // Calculate level progress
        const currentLevelThreshold = profile.user_level === 1 ? 0 : 100 * ((profile.user_level - 1) * profile.user_level) / 2;
        const nextLevelThreshold = 100 * (profile.user_level * (profile.user_level + 1)) / 2;
        
        const xpForCurrentLevel = profile.xp_balance - currentLevelThreshold;
        const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
        
        setUser({
          ...emptyUser,
          name: profile.display_name || settings?.character_name || 'Adventurer',
          characterName: settings?.character_name || profile.display_name || 'Adventurer',
          level: profile.user_level,
          xp: xpForCurrentLevel,
          xpToNext: xpNeededForNextLevel,
          totalXp: profile.xp_balance,
          pomodoroCount,
          reduceAnimations: settings?.reduce_animations_enabled || false,
          avatarUrl: settings?.avatar_image_url || profile.avatar_url,
          avatarFrame: profile.avatar_frame || 'none'
        });
      } else {
        setUser({
          ...emptyUser,
          name: authUser.user_metadata?.display_name || 'Adventurer'
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

  // Placeholder functions for gold - now handled by useUserBalance hook
  const forceGoldRefresh = async () => {
    console.log('🔄 Gold refresh called - now handled by useUserBalance hook');
  };

  const addGold = async (amount: number) => {
    console.log(`🎁 Adding bonus Gold: ${amount} - now handled by useUserBalance hook`);
  };

  const subtractGold = (amount: number) => {
    console.log(`💸 Subtract Gold: ${amount} - now handled by useUserBalance hook`);
  };

  const spendGold = (amount: number): boolean => {
    console.log(`💰 Spend Gold: ${amount} - now handled by useUserBalance hook`);
    return false;
  };

  // Load user profile data from Supabase when auth user changes
  useEffect(() => {
    if (!authUser) {
      setIsLoading(false);
      return;
    }

    console.log('🔄 Loading user profile data...');
    loadUserProfile();

    if (!authUser) return;
    
    // Set up real-time subscription to profile changes
    console.log('🔗 Setting up real-time subscriptions for user:', authUser.id);
    
    const channel = supabase
      .channel('user-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${authUser.id}`
        },
        (payload) => {
          console.log('🔄 Profile updated via real-time:', payload);
          const newData = payload.new as any;
          if (newData) {
            React.startTransition(() => {
              setUser(prev => {
                if (newData.xp_balance !== undefined && newData.xp_balance !== prev.totalXp) {
                  console.log(`🎯 XP updated: ${prev.totalXp} → ${newData.xp_balance}`);
                  
                  // Calculate new level and progress
                  const totalXp = newData.xp_balance;
                  let currentLevel = 1;
                  while (true) {
                    const xpForLevel = 100 * (currentLevel * (currentLevel + 1)) / 2;
                    if (totalXp < xpForLevel) break;
                    currentLevel++;
                  }
                  
                  const currentLevelThreshold = currentLevel === 1 ? 0 : 100 * ((currentLevel - 1) * currentLevel) / 2;
                  const nextLevelThreshold = 100 * (currentLevel * (currentLevel + 1)) / 2;
                  const xpForCurrentLevel = totalXp - currentLevelThreshold;
                  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
                  
                  // Check for level up
                  if (currentLevel > prev.level) {
                    setTimeout(() => triggerLevelUpCelebration(currentLevel), 100);
                  }
                  
                  return {
                    ...prev,
                    level: currentLevel,
                    xp: xpForCurrentLevel,
                    xpToNext: xpNeededForNextLevel,
                    totalXp: totalXp,
                    name: newData.display_name || prev.name,
                    avatarUrl: newData.avatar_url || prev.avatarUrl,
                    avatarFrame: newData.avatar_frame || prev.avatarFrame,
                  };
                }
                
                return {
                  ...prev,
                  name: newData.display_name || prev.name,
                  avatarUrl: newData.avatar_url || prev.avatarUrl,
                  avatarFrame: newData.avatar_frame || prev.avatarFrame,
                };
              });
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [authUser]);

  const updateUser = async (updates: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...updates }));
    
    if (authUser && (updates.name || updates.avatarUrl || updates.avatarFrame)) {
      try {
        const profileUpdates: any = {};
        if (updates.name) profileUpdates.display_name = updates.name;
        if (updates.avatarUrl) profileUpdates.avatar_url = updates.avatarUrl;
        if (updates.avatarFrame) profileUpdates.avatar_frame = updates.avatarFrame;
        
        if (Object.keys(profileUpdates).length > 0) {
          const { error } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('user_id', authUser.id);
            
          if (error) {
            console.error('Error updating profile in database:', error);
          }
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const triggerLevelUpCelebration = (newLevel: number) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#92400e']
    });

    toast({
      title: "🎉 Level Up!",
      description: `Congratulations! You've reached Level ${newLevel}!`,
      duration: 5000,
    });
  };

  const addXP = async (amount: number) => {
    console.log(`🎁 Adding bonus XP: ${amount} (LOCAL STATE ONLY)`);
    
    setUser(prev => {
      const newTotalXp = prev.totalXp + amount;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;
      const originalLevel = prev.level;

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel++;
        const currentLevelThreshold = 100 * ((newLevel - 1) * newLevel) / 2;
        const nextLevelThreshold = 100 * (newLevel * (newLevel + 1)) / 2;
        newXpToNext = nextLevelThreshold - currentLevelThreshold;
      }

      if (newLevel > originalLevel) {
        setTimeout(() => triggerLevelUpCelebration(newLevel), 100);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNext: newXpToNext,
        totalXp: newTotalXp,
        dailyXp: {},
      };
    });
  };

  const subtractXP = async (amount: number) => {
    console.log(`📉 Subtracting XP: ${amount} (LOCAL STATE ONLY)`);
    
    setUser(prev => {
      const newTotalXp = Math.max(0, prev.totalXp - amount);
      let newXp = Math.max(0, prev.xp - amount);
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;

      while (newXp < 0 && newLevel > 1) {
        newLevel--;
        const currentLevelThreshold = newLevel === 1 ? 0 : 100 * ((newLevel - 1) * newLevel) / 2;
        const nextLevelThreshold = 100 * (newLevel * (newLevel + 1)) / 2;
        newXpToNext = nextLevelThreshold - currentLevelThreshold;
        newXp += newXpToNext;
      }

      return {
        ...prev,
        xp: Math.max(0, newXp),
        level: newLevel,
        xpToNext: newXpToNext,
        totalXp: newTotalXp,
        dailyXp: {},
      };
    });
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
    console.log('🔄 Force refreshing user profile data...');
    setUser(emptyUser);
    setIsLoading(true);
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
    forceGoldRefresh,
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