
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Flag, Crown, Plus, Target, CheckCircle2, Calendar, Play, Coins, X } from 'lucide-react';
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
import { useQuests, Quest } from '@/hooks/useQuests';
import { useUser } from '@/contexts/UserContext';

const QuestTracker = () => {
  const { toast } = useToast();
  const { quests, updateQuestStatus } = useQuests();
  const { addXP, subtractXP, addGold, subtractGold } = useUser();

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [todaysFocus, setTodaysFocus] = useState<string[]>(() => {
    // Load from localStorage if available
    const savedFocus = localStorage.getItem('lifequest-todays-focus');
    return savedFocus ? JSON.parse(savedFocus) : [];
  });

  // Listen for localStorage changes to sync Today's Focus across pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lifequest-todays-focus' && e.newValue) {
        setTodaysFocus(JSON.parse(e.newValue));
      }
    };

    // Listen for manual localStorage updates from same window
    const handleLocalUpdate = () => {
      const savedFocus = localStorage.getItem('lifequest-todays-focus');
      if (savedFocus) {
        const newFocus = JSON.parse(savedFocus);
        setTodaysFocus(newFocus);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('todaysFocusUpdated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('todaysFocusUpdated', handleLocalUpdate);
    };
  }, []);
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

  // Save todaysFocus to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lifequest-todays-focus', JSON.stringify(todaysFocus));
  }, [todaysFocus]);

  // Track quest completions and award XP - removed since handled by database triggers
  useEffect(() => {
    // Update previous quests for next comparison
    setPreviousQuests([...quests]);
  }, [quests]);

  // Separate quests by type - show all dailies automatically and focused quests
  const allDailies = quests.filter(quest => quest.quest_type === 'Daily');
  const sortedDailies = [...allDailies].sort((a, b) => {
    // Completed dailies go to bottom
    if (a.status === 'Completed' && b.status !== 'Completed') return 1;
    if (a.status !== 'Completed' && b.status === 'Completed') return -1;
    return 0;
  });
  
  const focusQuests = quests.filter(quest => 
    todaysFocus.includes(quest.id) && quest.quest_type !== 'Daily'
  ).sort((a, b) => {
    // Completed focused quests go to bottom
    if (a.status === 'Completed' && b.status !== 'Completed') return 1;
    if (a.status !== 'Completed' && b.status === 'Completed') return -1;
    return 0;
  });

  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-600 hover:bg-green-700';
      case 'In Progress': return 'bg-blue-600 hover:bg-blue-700';
      case 'Not started': return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getTypeIcon = (type: Quest['quest_type']) => {
    switch (type) {
      case 'Daily': return <Star className="w-4 h-4" />;
      case 'Main': return <Trophy className="w-4 h-4" />;
      case 'Side': return <Flag className="w-4 h-4" />;
      case 'Legendary': return <Crown className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Quest['quest_type']) => {
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

  // Helper to transform new Quest to old interface for Pomodoro components
  const transformQuestForPomodoro = (quest: Quest) => ({
    id: quest.id,
    name: quest.quest_name,
    xp: quest.xp_reward,
    type: quest.quest_type
  });


  const handleDailySetup = (selectedQuestIds: string[]) => {
    console.log('Adding quests to focus:', selectedQuestIds, 'Current focus:', todaysFocus);
    // Add selected quests to current focus instead of replacing
    const newFocus = [...todaysFocus, ...selectedQuestIds];
    console.log('New focus after adding:', newFocus);
    setTodaysFocus(newFocus);
    
    // Save to localStorage immediately to ensure persistence
    localStorage.setItem('lifequest-todays-focus', JSON.stringify(newFocus));
    
    // Trigger localStorage update event for sync
    window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
    
    setIsSetupModalOpen(false);
  };

  // Remove quest from Today's Focus with minimum enforcement
  const handleRemoveFromFocus = (questId: string) => {
    console.log('Removing quest from focus:', questId, 'Current focus:', todaysFocus);
    const newFocus = todaysFocus.filter(id => id !== questId);
    console.log('New focus after removal:', newFocus);
    
    // Always remove the task first
    setTodaysFocus(newFocus);
    localStorage.setItem('lifequest-todays-focus', JSON.stringify(newFocus));
    window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
    
    // If removing drops below 3 tasks, show setup modal to add replacements
    if (newFocus.length < 3) {
      toast({
        title: "Minimum Focus Required",
        description: "Today's Focus needs at least 3 quests. Please select replacement quests.",
      });
      setIsSetupModalOpen(true);
    } else {
      toast({
        title: "Quest Removed",
        description: "Quest removed from Today's Focus.",
      });
    }
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
    const bonusXp = Math.floor(quest.xp_reward * 0.5); // 50% bonus
    const bonusGold = Math.floor(quest.xp_reward / 10) + 25; // Base gold calculation
    return { bonusXp, bonusGold };
  };

  const calculateBaseGold = (xp: number) => {
    return Math.floor(xp / 10) + 10; // Base gold calculation
  };

  const handleQuestComplete = useCallback(() => {
    if (completedTimerQuest) {
      const { bonusXp, bonusGold } = calculateRewards(completedTimerQuest);
      
      // Update quest status using new hook
      updateQuestStatus(completedTimerQuest.id, 'Completed');

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
  }, [completedTimerQuest, toast, updateQuestStatus, addXP, addGold]);

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

  const renderQuestCard = (quest: Quest, showCompleteIcon = false, showDeleteButton = false) => (
    <div key={quest.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showCompleteIcon && quest.status === 'Completed' && (
            <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
          )}
          <button
            onClick={() => updateQuestStatus(quest.id, quest.status === 'Completed' ? 'Not started' : 'Completed')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(quest.status)}`}
          >
            {quest.status}
          </button>
          
          <div className={`p-2 rounded-lg border ${getTypeColor(quest.quest_type)} bg-slate-800/50`}>
            {getTypeIcon(quest.quest_type)}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-medium ${quest.status === 'Completed' ? 'line-through text-slate-400' : 'text-white'}`}>{quest.quest_name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                {quest.xp_reward} XP
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                <Coins className="w-3 h-3 mr-1" />
                {quest.gold_reward} Gold
              </Badge>
              <Badge variant="outline" className={`${getTypeColor(quest.quest_type)} border-current`}>
                {quest.quest_type}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showDeleteButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRemoveFromFocus(quest.id)}
              className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white p-2"
              title="Remove from Today's Focus"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {quest.status !== 'Completed' && quest.quest_type !== 'Daily' && (
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
            quest={transformQuestForPomodoro(quests.find(q => q.id === activeTimer.questId)!)}
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
            <h4 className="text-lg font-semibold text-amber-400 mb-2">You haven't added any quests yet</h4>
            <p className="text-slate-300 mb-4">
              Use the 'New Quest' button to start your adventure!
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
               {(showAddMoreQuests || todaysFocus.length < 5) && (
                <Button 
                  size="sm" 
                  onClick={() => setIsSetupModalOpen(true)}
                  className={showAddMoreQuests ? "bg-green-600 hover:bg-green-700 animate-pulse" : "bg-amber-600 hover:bg-amber-700"}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {showAddMoreQuests ? 'Add More Quests' : 'Add Quest'}
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {focusQuests.map((quest) => renderQuestCard(quest, true, true))}
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

        {/* Daily Quests Section - Always Show All Dailies */}
        {sortedDailies.length > 0 ? (
          <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-600/30">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h4 className="text-lg font-bold text-yellow-400">Daily Habits</h4>
              <span className="text-yellow-300/70 text-sm">({sortedDailies.filter(q => q.status === 'Completed').length}/{sortedDailies.length})</span>
            </div>
            
            <div className="space-y-3">
              {sortedDailies.map((quest) => renderQuestCard(quest, true))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-600/30 text-center">
            <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2 opacity-50" />
            <p className="text-yellow-400 font-medium">No Daily Habits Created Yet</p>
            <p className="text-yellow-300/70 text-sm">Create some daily habits to build consistency!</p>
          </div>
        )}
      </div>

      {/* Pomodoro Setup Modal */}
      <PomodoroSetupModal
        isOpen={isPomodoroModalOpen}
        onClose={() => setIsPomodoroModalOpen(false)}
        quest={selectedQuest ? transformQuestForPomodoro(selectedQuest) : null}
        onTimerStart={handleTimerStart}
      />

      {/* Timer Complete Modal */}
      <TimerCompleteModal
        isOpen={isTimerCompleteModalOpen}
        quest={completedTimerQuest ? transformQuestForPomodoro(completedTimerQuest) : null}
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
        onSetupComplete={handleDailySetup}
        currentFocusQuests={todaysFocus}
      />

      {/* New Quest Modal */}
      <NewQuestModal
        isOpen={isNewQuestModalOpen}
        onClose={() => setIsNewQuestModalOpen(false)}
        currentQuestCount={quests.filter(q => q.quest_type !== 'Daily').length}
        maxQuests={15}
      />
    </div>
  );
};

export default QuestTracker;
