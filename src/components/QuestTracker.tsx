
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Flag, Crown, Plus, Target, CheckCircle2, Calendar, Play, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QuickDailySetup from './QuickDailySetup';
import NewQuestModal from './NewQuestModal';
import { 
  PomodoroSetupModal, 
  ActiveTimer, 
  TimerCompleteModal, 
  BreakTimerModal, 
  ActiveBreakTimer 
} from './PomodoroTimer';
import { useToast } from '@/hooks/use-toast';
import { useQuests, Quest } from '@/contexts/QuestContext';
import { useUser } from '@/contexts/UserContext';

const QuestTracker = () => {
  const { toast } = useToast();
  const { quests, addQuest, toggleQuestStatus } = useQuests();
  const { addXP, addGold } = useUser();

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [todaysFocus, setTodaysFocus] = useState<string[]>([]);
  const [showAddMoreQuests, setShowAddMoreQuests] = useState(false);

  // Pomodoro Timer States
  const [isPomodoroModalOpen, setIsPomodoroModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeTimer, setActiveTimer] = useState<{
    questId: string;
    timeRemaining: number;
    totalTime: number;
    isRunning: boolean;
  } | null>(null);
  const [isTimerCompleteModalOpen, setIsTimerCompleteModalOpen] = useState(false);
  const [completedTimerQuest, setCompletedTimerQuest] = useState<Quest | null>(null);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [activeBreakTimer, setActiveBreakTimer] = useState<{
    timeRemaining: number;
    isRunning: boolean;
  } | null>(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [goldEarned, setGoldEarned] = useState(0);
  const [previousQuests, setPreviousQuests] = useState<Quest[]>([]);

  // Check if all focused quests are completed
  useEffect(() => {
    if (todaysFocus.length > 0) {
      const focusedQuests = quests.filter(q => todaysFocus.includes(q.id));
      const allCompleted = focusedQuests.every(q => q.status === 'Completed');
      setShowAddMoreQuests(allCompleted);
    }
  }, [quests, todaysFocus]);

  // Track quest completions and award XP
  useEffect(() => {
    if (previousQuests.length > 0) {
      quests.forEach(currentQuest => {
        const previousQuest = previousQuests.find(p => p.id === currentQuest.id);
        
        // If quest just changed to Completed, award XP and gold
        if (previousQuest && 
            previousQuest.status !== 'Completed' && 
            currentQuest.status === 'Completed') {
          
          const baseGold = Math.floor(currentQuest.xp / 10) + 10; // Base gold calculation
          
          addXP(currentQuest.xp);
          addGold(baseGold);
          
          toast({
            title: "Quest Complete! 🎉",
            description: `Earned ${currentQuest.xp} XP and ${baseGold} Gold!`,
          });
        }
      });
    }
    
    // Update previous quests for next comparison
    setPreviousQuests([...quests]);
  }, [quests, previousQuests, addXP, addGold, toast]);

  // Separate quests by type - only show dailies and focused quests
  const dailyQuests = quests.filter(quest => quest.type === 'Daily');
  const focusQuests = quests.filter(quest => 
    todaysFocus.includes(quest.id) && quest.type !== 'Daily'
  );
  // Don't show other quests on Today page - only focused quests and dailies

  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-600 hover:bg-green-700';
      case 'In Progress': return 'bg-blue-600 hover:bg-blue-700';
      case 'Not started': return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'Daily': return <Star className="w-4 h-4" />;
      case 'Main': return <Trophy className="w-4 h-4" />;
      case 'Side': return <Flag className="w-4 h-4" />;
      case 'Legendary': return <Crown className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'Daily': return 'border-yellow-500/50 text-yellow-400';
      case 'Main': return 'border-red-500/50 text-red-400';
      case 'Side': return 'border-blue-500/50 text-blue-400';
      case 'Legendary': return 'border-purple-500/50 text-purple-400';
    }
  };

  const getPriorityColor = (priority: Quest['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
    }
  };


  const handleDailySetup = (selectedQuestIds: string[]) => {
    setTodaysFocus(selectedQuestIds);
  };

  // Pomodoro Timer Functions
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

  const handleTimerComplete = useCallback(() => {
    if (activeTimer) {
      const quest = quests.find(q => q.id === activeTimer.questId);
      if (quest) {
        setCompletedTimerQuest(quest);
        setIsTimerCompleteModalOpen(true);
        setPomodoroCount(prev => prev + 1);
        
        // Play notification sound (if available)
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {
            // Fallback if audio fails
            console.log('Timer complete notification');
          });
        } catch (error) {
          console.log('Audio notification not available');
        }
      }
    }
    setActiveTimer(null);
  }, [activeTimer, quests]);

  const calculateRewards = (quest: Quest) => {
    const bonusXp = Math.floor(quest.xp * 0.5); // 50% bonus
    const bonusGold = Math.floor(quest.xp / 10) + 25; // Base gold calculation
    return { bonusXp, bonusGold };
  };

  const calculateBaseGold = (xp: number) => {
    return Math.floor(xp / 10) + 10; // Base gold calculation
  };

  const handleQuestComplete = useCallback(() => {
    if (completedTimerQuest) {
      const { bonusXp, bonusGold } = calculateRewards(completedTimerQuest);
      
      // Update quest status using context (regular XP/gold will be added by the useEffect)
      toggleQuestStatus(completedTimerQuest.id);
      if (quests.find(q => q.id === completedTimerQuest.id)?.status !== 'Completed') {
        toggleQuestStatus(completedTimerQuest.id); // Ensure it gets to Completed
      }

      // Add bonus rewards from timer completion
      addXP(bonusXp);
      addGold(bonusGold);

      toast({
        title: "Pomodoro Bonus! 🍅",
        description: `Bonus: +${bonusXp} XP and +${bonusGold} Gold for focused work!`,
      });

      setIsTimerCompleteModalOpen(false);
      setCompletedTimerQuest(null);
      setIsBreakModalOpen(true); // Offer break
    }
  }, [completedTimerQuest, toast, toggleQuestStatus, quests, addXP, addGold]);

  const handleBreakAccept = useCallback(() => {
    setActiveBreakTimer({
      timeRemaining: 300, // 5 minutes
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

  const renderQuestCard = (quest: Quest, showCompleteIcon = false) => (
    <div key={quest.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showCompleteIcon && quest.status === 'Completed' && (
            <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
          )}
          <button
            onClick={() => toggleQuestStatus(quest.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(quest.status)}`}
          >
            {quest.status}
          </button>
          
          <div className={`p-2 rounded-lg border ${getTypeColor(quest.type)} bg-slate-800/50`}>
            {getTypeIcon(quest.type)}
          </div>
          
          <div className="flex-1">
            <h4 className="text-white font-medium">{quest.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                {quest.xp} XP
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                <Coins className="w-3 h-3 mr-1" />
                {calculateBaseGold(quest.xp)} Gold
              </Badge>
              <Badge variant="outline" className={`${getTypeColor(quest.type)} border-current`}>
                {quest.type}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {quest.status !== 'Completed' && quest.type !== 'Daily' && (
            <Button
              size="sm"
              onClick={() => handleBeginQuest(quest)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={activeTimer?.questId === quest.id}
            >
              <Play className="w-4 h-4 mr-1" />
              Begin Quest
            </Button>
          )}
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(quest.priority)}`} title={`${quest.priority} Priority`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Active Timer Widget */}
      {activeTimer && (
        <div className="sticky top-20 z-30">
          <ActiveTimer
            quest={quests.find(q => q.id === activeTimer.questId)!}
            timeRemaining={activeTimer.timeRemaining}
            totalTime={activeTimer.totalTime}
            isRunning={activeTimer.isRunning}
            onPause={handleTimerPause}
            onResume={handleTimerResume}
            onCancel={handleTimerCancel}
            onComplete={handleTimerComplete}
          />
        </div>
      )}

      {/* Active Break Timer Widget */}
      {activeBreakTimer && (
        <div className="sticky top-20 z-30">
          <ActiveBreakTimer
            timeRemaining={activeBreakTimer.timeRemaining}
            onComplete={handleBreakComplete}
            onCancel={handleBreakCancel}
          />
        </div>
      )}

      {/* Main Quest Tracker */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-emerald-400">Tracked Quests</h3>
            {pomodoroCount > 0 && (
              <Badge className="bg-amber-600 text-white ml-2">
                <Coins className="w-3 h-3 mr-1" />
                {pomodoroCount} Pomodoros
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsSetupModalOpen(true)}
              className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
            >
              <Target className="w-4 h-4 mr-1" />
              Quick Daily Setup
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsNewQuestModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Quest
            </Button>
          </div>
        </div>

        {/* Show message when no focus quests are selected */}
        {todaysFocus.length === 0 && (
          <div className="bg-slate-700/30 rounded-lg p-6 border border-amber-600/30 text-center mb-6">
            <Target className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-semibold text-amber-400 mb-2">Set Your Daily Focus</h4>
            <p className="text-slate-300 mb-4">
              Choose 3-5 quests to focus on today using Quick Daily Setup
            </p>
            <Button 
              onClick={() => setIsSetupModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Quick Daily Setup
            </Button>
          </div>
        )}

        {/* Today's Focus Section */}
        {todaysFocus.length > 0 && (
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-lg p-6 border border-amber-600/50 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-amber-400" />
                <h4 className="text-lg font-bold text-amber-400">Today's Focus</h4>
              </div>
              {showAddMoreQuests && (
                <Button 
                  size="sm" 
                  onClick={() => setIsSetupModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 animate-pulse"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add More Quests
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {focusQuests.map((quest) => renderQuestCard(quest, true))}
            </div>
            
            {showAddMoreQuests && (
              <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-600/30 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-medium">🎉 Focus Complete!</p>
                <p className="text-green-300 text-sm">Great job finishing your daily focus. Ready for more?</p>
              </div>
            )}
          </div>
        )}

        {/* Daily Quests Sidebar */}
        {dailyQuests.length > 0 && (
          <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-600/30">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h4 className="text-lg font-semibold text-yellow-400">Daily Habits</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dailyQuests.map((quest) => renderQuestCard(quest))}
            </div>
          </div>
        )}
      </div>

      {/* Pomodoro Setup Modal */}
      <PomodoroSetupModal
        isOpen={isPomodoroModalOpen}
        onClose={() => setIsPomodoroModalOpen(false)}
        quest={selectedQuest}
        onTimerStart={handleTimerStart}
      />

      {/* Timer Complete Modal */}
      <TimerCompleteModal
        isOpen={isTimerCompleteModalOpen}
        quest={completedTimerQuest}
        onComplete={handleQuestComplete}
        onDismiss={() => {
          setIsTimerCompleteModalOpen(false);
          setCompletedTimerQuest(null);
        }}
        bonusXp={completedTimerQuest ? calculateRewards(completedTimerQuest).bonusXp : 0}
        bonusGold={completedTimerQuest ? calculateRewards(completedTimerQuest).bonusGold : 0}
      />

      {/* Break Timer Modal */}
      <BreakTimerModal
        isOpen={isBreakModalOpen}
        onAccept={handleBreakAccept}
        onDecline={handleBreakDecline}
      />

      {/* Quick Daily Setup Modal */}
      <QuickDailySetup
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        quests={quests}
        onSetupComplete={handleDailySetup}
      />

      {/* New Quest Modal */}
      <NewQuestModal
        isOpen={isNewQuestModalOpen}
        onClose={() => setIsNewQuestModalOpen(false)}
        onQuestCreated={(newQuest) => {
          addQuest(newQuest);
          toast({
            title: "Quest Added! 🎯",
            description: `${newQuest.name} has been added to your quest log.`,
          });
        }}
        currentQuestCount={quests.filter(q => q.type !== 'Daily').length}
        maxQuests={5}
      />
    </div>
  );
};

export default QuestTracker;
