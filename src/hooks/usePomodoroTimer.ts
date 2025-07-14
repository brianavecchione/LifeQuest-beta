import { useState, useEffect, useCallback } from 'react';
import { Quest } from '@/hooks/useQuests';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface ActiveTimer {
  questId: string;
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
}

interface ActiveBreakTimer {
  timeRemaining: number;
  isRunning: boolean;
}

export const usePomodoroTimer = (updateQuestStatus: (id: string, status: string) => Promise<boolean>) => {
  const { toast } = useToast();
  const { addXP, addGold } = useUser();

  const [isPomodoroModalOpen, setIsPomodoroModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [isTimerCompleteModalOpen, setIsTimerCompleteModalOpen] = useState(false);
  const [completedTimerQuest, setCompletedTimerQuest] = useState<Quest | null>(null);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [activeBreakTimer, setActiveBreakTimer] = useState<ActiveBreakTimer | null>(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const calculateRewards = (quest: Quest) => {
    const bonusXp = Math.floor(quest.xp_reward * 0.5);
    const bonusGold = Math.floor(quest.xp_reward / 10) + 25;
    return { bonusXp, bonusGold };
  };

  const transformQuestForPomodoro = (quest: Quest) => ({
    id: quest.id,
    name: quest.quest_name,
    xp: quest.xp_reward,
    type: quest.quest_type
  });

  const handleBeginQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setIsPomodoroModalOpen(true);
  };

  const handleTimerStart = useCallback((questId: string, duration: number) => {
    const totalSeconds = duration * 60;
    setActiveTimer({
      questId,
      timeRemaining: totalSeconds,
      totalTime: totalSeconds,
      isRunning: true
    });
    setIsPomodoroModalOpen(false);
  }, []);

  const handleTimerPause = useCallback(() => {
    setActiveTimer(prev => prev ? { ...prev, isRunning: false } : null);
  }, []);

  const handleTimerResume = useCallback(() => {
    setActiveTimer(prev => prev ? { ...prev, isRunning: true } : null);
  }, []);

  const handleTimerCancel = useCallback(() => {
    setActiveTimer(null);
    toast({
      title: "Timer Cancelled",
      description: "Your focus session has been cancelled.",
    });
  }, [toast]);

  const handleTimerComplete = useCallback((quests: Quest[]) => {
    if (activeTimer) {
      const quest = quests.find(q => q.id === activeTimer.questId);
      if (quest) {
        setCompletedTimerQuest(quest);
        setIsTimerCompleteModalOpen(true);
        setPomodoroCount(prev => prev + 1);
        
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {
            console.log('Timer complete notification');
          });
        } catch (error) {
          console.log('Audio notification not available');
        }
      }
    }
    setActiveTimer(null);
  }, [activeTimer]);

  const handleQuestComplete = useCallback(async () => {
    if (completedTimerQuest) {
      const { bonusXp, bonusGold } = calculateRewards(completedTimerQuest);
      
      // First update the quest's rewards to include the Pomodoro bonus
      // before marking it complete so the database trigger awards the correct amount
      const updatedXp = completedTimerQuest.xp_reward + bonusXp;
      const updatedGold = completedTimerQuest.gold_reward + bonusGold;
      
      // Update quest rewards and status in one transaction
      await supabase
        .from('quests')
        .update({ 
          xp_reward: updatedXp,
          gold_reward: updatedGold,
          status: 'Completed'
        })
        .eq('id', completedTimerQuest.id);

      toast({
        title: "Pomodoro Bonus! 🍅",
        description: `Bonus: +${bonusXp} XP and +${bonusGold} Gold for focused work!`,
      });

      setIsTimerCompleteModalOpen(false);
      setCompletedTimerQuest(null);
      setIsBreakModalOpen(true);
    }
  }, [completedTimerQuest, toast]);

  const handleBreakAccept = useCallback(() => {
    setActiveBreakTimer({
      timeRemaining: 300,
      isRunning: true
    });
    setIsBreakModalOpen(false);
  }, []);

  const handleBreakDecline = useCallback(() => {
    setIsBreakModalOpen(false);
  }, []);

  const handleBreakComplete = useCallback(() => {
    setActiveBreakTimer(null);
    toast({
      title: "Break Complete!",
      description: "Time to get back to your quests!",
    });
  }, [toast]);

  const handleBreakCancel = useCallback(() => {
    setActiveBreakTimer(null);
  }, []);

  // Timer countdown effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer?.isRunning && activeTimer.timeRemaining > 0) {
      interval = setInterval(() => {
        setActiveTimer(prev => {
          if (prev && prev.timeRemaining > 1) {
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          }
          return prev;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer?.isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeBreakTimer?.isRunning && activeBreakTimer.timeRemaining > 0) {
      interval = setInterval(() => {
        setActiveBreakTimer(prev => {
          if (prev && prev.timeRemaining > 1) {
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          }
          return prev;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeBreakTimer?.isRunning]);

  return {
    // State
    isPomodoroModalOpen,
    selectedQuest,
    activeTimer,
    isTimerCompleteModalOpen,
    completedTimerQuest,
    isBreakModalOpen,
    activeBreakTimer,
    pomodoroCount,
    
    // Actions
    handleBeginQuest,
    handleTimerStart,
    handleTimerPause,
    handleTimerResume,
    handleTimerCancel,
    handleTimerComplete,
    handleQuestComplete,
    handleBreakAccept,
    handleBreakDecline,
    handleBreakComplete,
    handleBreakCancel,
    
    // Setters
    setIsPomodoroModalOpen,
    setIsTimerCompleteModalOpen,
    setCompletedTimerQuest,
    
    // Utils
    transformQuestForPomodoro,
    calculateRewards
  };
};