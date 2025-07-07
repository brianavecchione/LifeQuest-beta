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

const initialQuests: Quest[] = [];

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