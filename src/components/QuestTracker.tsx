
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import QuickDailySetup from './QuickDailySetup';
import NewQuestModal from './NewQuestModal';
import EditQuestModal from './EditQuestModal';
import TodaysFocus from './TodaysFocus';
import DailyHabits from './DailyHabits';
import QuickActions from './QuickActions';
import FocusMasterModal from './FocusMasterModal';
import { 
  PomodoroSetupModal, 
  ActiveTimer, 
  TimerCompleteModal, 
  BreakTimerModal, 
  ActiveBreakTimer 
 } from './PomodoroTimer';
import { useToast } from '@/hooks/use-toast';
import { useQuests } from '@/hooks/useQuestsWrapper';
import { Quest } from '@/hooks/useQuests';
import { useTodaysFocus } from '@/hooks/useTodaysFocus';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { useUser } from '@/contexts/UserContext';

const QuestTracker = () => {
  const { toast } = useToast();
  const { quests, updateQuestStatus, deleteQuest, refetchQuests } = useQuests();
  const { addXP, addGold } = useUser();
  
  // Custom hooks
  const { todaysFocus, handleDailySetup, handleRemoveFromFocus } = useTodaysFocus(quests);
  const {
    isPomodoroModalOpen,
    selectedQuest,
    activeTimer,
    isTimerCompleteModalOpen,
    completedTimerQuest,
    isBreakModalOpen,
    activeBreakTimer,
    pomodoroCount,
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
    setIsPomodoroModalOpen,
    setIsTimerCompleteModalOpen,
    setCompletedTimerQuest,
    transformQuestForPomodoro,
    calculateRewards
  } = usePomodoroTimer(updateQuestStatus);

  // Local state
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [deletingQuest, setDeletingQuest] = useState<Quest | null>(null);
  const [showAddMoreQuests, setShowAddMoreQuests] = useState(false);
  const [isFocusMasterModalOpen, setIsFocusMasterModalOpen] = useState(false);

  // Check if all focused quests are completed OR if active quests drop below minimum
  useEffect(() => {
    const today = new Date().toDateString();
    const noMoreQuestsToday = localStorage.getItem('lifequest-no-more-quests-today');
    const userDeclinedToday = noMoreQuestsToday === today;

    if (todaysFocus.length > 0) {
      const focusedQuests = quests.filter(q => todaysFocus.includes(q.id));
      const activeQuests = focusedQuests.filter(q => q.status !== 'Completed');
      const allCompleted = focusedQuests.every(q => q.status === 'Completed');
      const belowMinimum = activeQuests.length < 3;
      
      console.log('QuestTracker focus check:', {
        totalFocusQuests: focusedQuests.length,
        activeQuests: activeQuests.length,
        allCompleted,
        belowMinimum,
        userDeclinedToday
      });
      
      setShowAddMoreQuests(allCompleted || belowMinimum);
      
      // Auto-open modal if active focus drops below minimum AND user hasn't declined today
      // Add a small delay to ensure quest status updates are fully processed
      if (belowMinimum && activeQuests.length > 0 && !userDeclinedToday) {
        setTimeout(() => {
          setIsSetupModalOpen(true);
        }, 100);
      }
    } else {
      setShowAddMoreQuests(false);
    }
  }, [quests, todaysFocus]);

  // AUTO-TRIGGER Focus Master Bonus when all Focus tasks are completed
  useEffect(() => {
    if (todaysFocus.length >= 3) {
      const focusedQuests = quests.filter(q => todaysFocus.includes(q.id));
      const allCompleted = focusedQuests.length >= 3 && focusedQuests.every(q => q.status === 'Completed');
      
      if (allCompleted) {
        const today = new Date().toDateString();
        const bonusKey = `lifequest-focus-bonus-${today}`;
        const bonusAlreadyClaimed = localStorage.getItem(bonusKey) === 'true';
        
        console.log('AUTO Focus Master Bonus Check:', {
          todaysFocus: todaysFocus.length,
          focusedQuests: focusedQuests.length,
          allCompleted,
          bonusAlreadyClaimed,
          questStatuses: focusedQuests.map(q => ({ name: q.quest_name, status: q.status }))
        });
        
        if (!bonusAlreadyClaimed) {
          const bonusXP = 25;
          const bonusGold = 10;
          
          // Award the bonus
          addXP(bonusXP);
          addGold(bonusGold);
          
          // Mark bonus as claimed for today
          localStorage.setItem(bonusKey, 'true');
          
          // Show celebratory modal
          setIsFocusMasterModalOpen(true);
          
          console.log('AUTO Focus Master Bonus Awarded:', { bonusXP, bonusGold });
        }
      }
    }
  }, [quests, todaysFocus, addXP, addGold]);

  const handleSetupComplete = (selectedQuestIds: string[]) => {
    handleDailySetup(selectedQuestIds);
    setIsSetupModalOpen(false);
  };

  const handleNoMoreQuests = () => {
    // Simply set flag to prevent auto-opening the modal today
    // Focus Master bonus is now handled automatically when tasks are completed
    const today = new Date().toDateString();
    localStorage.setItem('lifequest-no-more-quests-today', today);
    setIsSetupModalOpen(false);
  };

  const handleRemoveFromFocusWithToast = (questId: string) => {
    handleRemoveFromFocus(questId);
    
    const remainingQuests = todaysFocus.filter(id => id !== questId).length;
    const today = new Date().toDateString();
    const noMoreQuestsToday = localStorage.getItem('lifequest-no-more-quests-today');
    const userDeclinedToday = noMoreQuestsToday === today;

    if (remainingQuests < 3 && !userDeclinedToday) {
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

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
  };

  const handleDeleteQuest = async () => {
    if (!deletingQuest) return;
    
    const success = await deleteQuest(deletingQuest.id);
    if (success) {
      if (todaysFocus.includes(deletingQuest.id)) {
        handleRemoveFromFocus(deletingQuest.id);
      }
      setDeletingQuest(null);
    }
  };

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
            onComplete={() => handleTimerComplete(quests)}
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
        <QuickActions
          pomodoroCount={pomodoroCount}
          onSetupModalOpen={() => setIsSetupModalOpen(true)}
          onNewQuestModalOpen={() => setIsNewQuestModalOpen(true)}
        />

        <TodaysFocus
          todaysFocus={todaysFocus}
          quests={quests}
          showAddMoreQuests={showAddMoreQuests}
          onSetupModalOpen={() => setIsSetupModalOpen(true)}
          onStatusChange={updateQuestStatus}
          onRemoveFromFocus={handleRemoveFromFocusWithToast}
          onEditQuest={handleEditQuest}
          onDeleteQuest={setDeletingQuest}
          onBeginQuest={handleBeginQuest}
          activeTimerQuestId={activeTimer?.questId}
        />

        <DailyHabits
          quests={quests}
          onStatusChange={updateQuestStatus}
          onEditQuest={handleEditQuest}
          onDeleteQuest={setDeletingQuest}
        />
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
        onSetupComplete={handleSetupComplete}
        onNoMoreQuests={handleNoMoreQuests}
        currentFocusQuests={todaysFocus}
      />

      {/* New Quest Modal */}
      <NewQuestModal
        isOpen={isNewQuestModalOpen}
        onClose={() => setIsNewQuestModalOpen(false)}
        currentQuestCount={quests.filter(q => q.quest_type !== 'Daily').length}
        maxQuests={15}
      />

      {/* Edit Quest Modal */}
      <EditQuestModal
        isOpen={!!editingQuest}
        onClose={() => setEditingQuest(null)}
        quest={editingQuest}
        onQuestUpdated={refetchQuests}
      />

      {/* Focus Master Modal */}
      <FocusMasterModal
        isOpen={isFocusMasterModalOpen}
        onClose={() => setIsFocusMasterModalOpen(false)}
        xpEarned={25}
        goldEarned={10}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuest} onOpenChange={() => setDeletingQuest(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Quest</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to delete "{deletingQuest?.quest_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteQuest}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Quest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestTracker;
