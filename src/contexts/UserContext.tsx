import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalXp: number;
  gold: number;
  pomodoroCount: number;
  dailyXp: Record<string, number>; // Track XP by date (YYYY-MM-DD format)
}

interface UserContextType {
  user: UserData;
  updateUser: (updates: Partial<UserData>) => void;
  addXP: (amount: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  incrementPomodoro: () => void;
  getDailyXpData: () => Array<{ date: string; xp: number; day: string }>;
}

const defaultUser: UserData = {
  name: 'Adventurer',
  level: 2,
  xp: 75,
  xpToNext: 100,
  totalXp: 333,
  gold: 1250,
  pomodoroCount: 0,
  dailyXp: {},
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData>(() => {
    // Load from localStorage if available
    const savedUser = localStorage.getItem('lifequest-user');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });

  // Save to localStorage whenever user data changes
  useEffect(() => {
    localStorage.setItem('lifequest-user', JSON.stringify(user));
  }, [user]);

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
      const updatedDailyXp = {
        ...prev.dailyXp,
        [today]: (prev.dailyXp[today] || 0) + amount
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
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      last7Days.push({
        date: dayName,
        xp: user.dailyXp[dateStr] || 0,
        day: fullDayName
      });
    }
    
    return last7Days;
  };

  const value: UserContextType = {
    user,
    updateUser,
    addXP,
    addGold,
    spendGold,
    incrementPomodoro,
    getDailyXpData,
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