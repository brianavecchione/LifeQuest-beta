import { useGuest } from '@/contexts/GuestContext';
import { useQuests as useRealQuests, Quest } from '@/hooks/useQuests';

export type { Quest };

// Wrapper hook that provides quests from either real database or guest context
export const useQuests = () => {
  const { isGuestMode, guestQuests, toggleGuestQuest, addGuestQuest } = useGuest();
  const realQuests = useRealQuests();

  if (isGuestMode) {
    // Transform guest quests to match the expected Quest interface
    const transformedQuests: Quest[] = guestQuests.map(quest => ({
      id: quest.id,
      quest_name: quest.quest_name,
      description: quest.description,
      quest_type: quest.quest_type,
      priority: quest.priority,
      xp_reward: quest.xp_reward,
      gold_reward: quest.gold_reward,
      tags: quest.tags,
      status: quest.status === 'completed' ? 'Completed' as const : quest.status === 'pending' ? 'Not started' as const : 'In Progress' as const,
      created_at: quest.created_at,
      updated_at: quest.updated_at,
      completed_at: quest.completed_at,
      due_date: undefined,
      user_id: 'guest',
      pomodoro_enabled: false, // Default to false for guest quests
    }));

    return {
      quests: transformedQuests,
      loading: false,
      error: null,
      refetchQuests: () => Promise.resolve(),
      createQuest: (questData: any) => {
        const newQuest: Quest = {
          id: `guest-${Date.now()}`,
          quest_name: questData.quest_name,
          description: questData.description,
          quest_type: questData.quest_type,
          priority: questData.priority,
          xp_reward: questData.xp_reward,
          gold_reward: questData.gold_reward,
          tags: questData.tags,
          status: 'Not started',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'guest',
          pomodoro_enabled: questData.pomodoro_enabled || false,
        };
        
        addGuestQuest({
          quest_name: questData.quest_name,
          quest_type: questData.quest_type,
          priority: questData.priority,
          xp_reward: questData.xp_reward,
          gold_reward: questData.gold_reward,
          description: questData.description,
          tags: questData.tags,
          status: 'pending',
        });
        
        return Promise.resolve(newQuest);
      },
      updateQuestStatus: (questId: string) => {
        toggleGuestQuest(questId);
        return Promise.resolve(true);
      },
      updateQuest: () => Promise.resolve(),
      deleteQuest: () => Promise.resolve(true),
      completeQuest: (questId: string) => {
        toggleGuestQuest(questId);
        return Promise.resolve();
      },
      archiveOldQuests: () => Promise.resolve(),
      resetDailyQuests: () => Promise.resolve(),
      getQuestsByType: (type: string) => transformedQuests.filter(q => q.quest_type === type),
      getQuestsByStatus: (status: string) => transformedQuests.filter(q => q.status === status),
      getCompletedQuestsToday: () => transformedQuests.filter(q => q.status === 'Completed'),
      getCompletedQuestsThisWeek: () => transformedQuests.filter(q => q.status === 'Completed'),
      getTotalQuestsCompleted: () => transformedQuests.filter(q => q.status === 'Completed').length,
    };
  }

  return realQuests;
};