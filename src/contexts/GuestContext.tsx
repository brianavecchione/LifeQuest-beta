import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestUserData {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalXp: number;
  gold: number;
  pomodoroCount: number;
  dailyXp: Record<string, number>;
  reduceAnimations: boolean;
  avatar: string;
}

interface GuestQuest {
  id: string;
  quest_name: string;
  status: string;
  xp_reward: number;
  gold_reward: number;
  quest_type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
  description?: string;
  tags?: string[];
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface GuestContextType {
  isGuestMode: boolean;
  guestUser: GuestUserData;
  guestQuests: GuestQuest[];
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  updateGuestUser: (updates: Partial<GuestUserData>) => void;
  addGuestXP: (amount: number) => void;
  addGuestGold: (amount: number) => void;
  toggleGuestQuest: (questId: string) => void;
  addGuestQuest: (quest: Omit<GuestQuest, 'id' | 'created_at' | 'updated_at'>) => void;
}

const createDummyQuests = (): GuestQuest[] => [
  {
    id: 'guest-1',
    quest_name: 'Morning Meditation',
    status: 'pending',
    xp_reward: 15,
    gold_reward: 5,
    quest_type: 'Daily',
    priority: 'Medium',
    description: 'Take 10 minutes for mindful meditation',
    tags: ['wellness', 'mindfulness'],
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'guest-2',
    quest_name: 'Complete Project Proposal',
    status: 'pending',
    xp_reward: 50,
    gold_reward: 25,
    quest_type: 'Main',
    priority: 'High',
    description: 'Finish the quarterly project proposal for review',
    tags: ['work', 'deadline'],
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'guest-3',
    quest_name: 'Read 20 Pages',
    status: 'completed',
    xp_reward: 20,
    gold_reward: 10,
    quest_type: 'Side',
    priority: 'Low',
    description: 'Continue reading "The Fellowship of the Ring"',
    tags: ['reading', 'personal'],
    completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'guest-4',
    quest_name: 'Drink 8 Glasses of Water',
    status: 'pending',
    xp_reward: 10,
    gold_reward: 3,
    quest_type: 'Daily',
    priority: 'Medium',
    description: 'Stay hydrated throughout the day',
    tags: ['health', 'hydration'],
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'guest-5',
    quest_name: 'Learn Quantum Computing',
    status: 'pending',
    xp_reward: 200,
    gold_reward: 100,
    quest_type: 'Legendary',
    priority: 'High',
    description: 'Master the fundamentals of quantum computing',
    tags: ['learning', 'technology', 'epic'],
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'guest-6',
    quest_name: 'Weekly Grocery Shopping',
    status: 'completed',
    xp_reward: 15,
    gold_reward: 8,
    quest_type: 'Side',
    priority: 'Medium',
    description: 'Get groceries for the week',
    tags: ['errands', 'life'],
    completed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const createDummyUser = (): GuestUserData => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return {
    name: 'Guest Adventurer',
    level: 5,
    xp: 45, // 45% progress to next level
    xpToNext: 100,
    totalXp: 1280,
    gold: 185,
    pomodoroCount: 12,
    dailyXp: {
      [today]: 35,
      [yesterday]: 60,
    },
    reduceAnimations: false,
    avatar: 'G',
  };
};

const GuestContext = createContext<GuestContextType | null>(null);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestUser, setGuestUser] = useState<GuestUserData>(createDummyUser());
  const [guestQuests, setGuestQuests] = useState<GuestQuest[]>(createDummyQuests());

  const enableGuestMode = () => {
    setIsGuestMode(true);
    // Reset to fresh dummy data when entering guest mode
    setGuestUser(createDummyUser());
    setGuestQuests(createDummyQuests());
  };

  const disableGuestMode = () => {
    setIsGuestMode(false);
    // Reset data when leaving guest mode
    setGuestUser(createDummyUser());
    setGuestQuests(createDummyQuests());
  };

  const updateGuestUser = (updates: Partial<GuestUserData>) => {
    setGuestUser(prev => ({ ...prev, ...updates }));
  };

  const addGuestXP = (amount: number) => {
    setGuestUser(prev => {
      const newTotalXp = prev.totalXp + amount;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;

      // Level up logic
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel++;
        newXpToNext = 100; // Keep it simple for guest mode
      }

      // Track daily XP
      const today = new Date().toISOString().split('T')[0];
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

  const addGuestGold = (amount: number) => {
    setGuestUser(prev => ({ ...prev, gold: prev.gold + amount }));
  };

  const toggleGuestQuest = (questId: string) => {
    setGuestQuests(prev => prev.map(quest => {
      if (quest.id === questId) {
        const isCompleting = quest.status === 'pending';
        
        if (isCompleting) {
          // Add XP and gold when completing
          addGuestXP(quest.xp_reward);
          addGuestGold(quest.gold_reward);
          
          return {
            ...quest,
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        } else {
          // Remove XP and gold when uncompleting
          addGuestXP(-quest.xp_reward);
          addGuestGold(-quest.gold_reward);
          
          return {
            ...quest,
            status: 'pending',
            completed_at: null,
            updated_at: new Date().toISOString(),
          };
        }
      }
      return quest;
    }));
  };

  const addGuestQuest = (questData: Omit<GuestQuest, 'id' | 'created_at' | 'updated_at'>) => {
    const newQuest: GuestQuest = {
      ...questData,
      id: `guest-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGuestQuests(prev => [...prev, newQuest]);
  };

  const value: GuestContextType = {
    isGuestMode,
    guestUser,
    guestQuests,
    enableGuestMode,
    disableGuestMode,
    updateGuestUser,
    addGuestXP,
    addGuestGold,
    toggleGuestQuest,
    addGuestQuest,
  };

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};