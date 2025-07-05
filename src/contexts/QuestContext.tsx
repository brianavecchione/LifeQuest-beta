import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Quest {
  id: string;
  name: string;
  status: 'Not started' | 'In Progress' | 'Completed';
  xp: number;
  type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
  tags?: string[];
}

interface QuestContextType {
  quests: Quest[];
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  toggleQuestStatus: (questId: string) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

const initialQuests: Quest[] = [
  // Dailies
  {
    id: 'd1',
    name: 'Morning Stretch',
    status: 'Completed',
    xp: 20,
    type: 'Daily',
    priority: 'Low',
    tags: ['health', 'routine']
  },
  {
    id: 'd2',
    name: 'Review Daily Goals',
    status: 'In Progress',
    xp: 25,
    type: 'Daily',
    priority: 'High',
    tags: ['planning', 'productivity']
  },
  {
    id: 'd3',
    name: 'Drink 8 glasses of water',
    status: 'In Progress',
    xp: 25,
    type: 'Daily',
    priority: 'Medium',
    tags: ['health', 'hydration']
  },
  {
    id: 'd4',
    name: 'Write in journal',
    status: 'Not started',
    xp: 20,
    type: 'Daily',
    priority: 'Low',
    tags: ['reflection', 'writing']
  },
  // Main Quests
  {
    id: 'm1',
    name: 'Submit Project Proposal',
    status: 'In Progress',
    xp: 150,
    type: 'Main',
    priority: 'High',
    tags: ['work', 'career']
  },
  {
    id: 'm2',
    name: 'Schedule Doctor Appointment',
    status: 'Not started',
    xp: 100,
    type: 'Main',
    priority: 'Medium',
    tags: ['health', 'admin']
  },
  {
    id: 'm3',
    name: 'Finish quarterly report',
    status: 'Not started',
    xp: 200,
    type: 'Main',
    priority: 'High',
    tags: ['work', 'deadline']
  },
  // Side Quests
  {
    id: 's1',
    name: 'Read 30 Pages',
    status: 'Not started',
    xp: 50,
    type: 'Side',
    priority: 'Medium',
    tags: ['learning', 'books']
  },
  {
    id: 's2',
    name: 'Declutter Desk',
    status: 'Not started',
    xp: 60,
    type: 'Side',
    priority: 'Low',
    tags: ['organization', 'space']
  },
  {
    id: 's3',
    name: 'Learn new recipe',
    status: 'Not started',
    xp: 40,
    type: 'Side',
    priority: 'Low',
    tags: ['cooking', 'skill']
  },
  {
    id: 's4',
    name: 'Call old friend',
    status: 'Not started',
    xp: 30,
    type: 'Side',
    priority: 'Medium',
    tags: ['social', 'relationships']
  },
  // Legendary Quests
  {
    id: 'l1',
    name: 'Launch Website',
    status: 'In Progress',
    xp: 500,
    type: 'Legendary',
    priority: 'High',
    tags: ['project', 'milestone', 'career']
  },
  {
    id: 'l2',
    name: 'Complete Marathon Training',
    status: 'Not started',
    xp: 800,
    type: 'Legendary',
    priority: 'Medium',
    tags: ['fitness', 'endurance', 'goal']
  }
];

export const QuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);

  const addQuest = (quest: Quest) => {
    setQuests(prev => [...prev, quest]);
  };

  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, ...updates } : quest
    ));
  };

  const toggleQuestStatus = (questId: string) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId) {
        const statusOrder: Quest['status'][] = ['Not started', 'In Progress', 'Completed'];
        const currentIndex = statusOrder.indexOf(quest.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...quest, status: statusOrder[nextIndex] };
      }
      return quest;
    }));
  };

  return (
    <QuestContext.Provider value={{ 
      quests, 
      setQuests, 
      addQuest, 
      updateQuest, 
      toggleQuestStatus 
    }}>
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};