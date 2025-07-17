import { useState, useEffect } from 'react';
import { Quest } from '@/hooks/useQuests';
import { useGuest } from '@/contexts/GuestContext';

export const useTodaysFocus = (quests: Quest[]) => {
  const { isGuestMode, guestTodaysFocus, updateGuestTodaysFocus } = useGuest();
  
  const [todaysFocus, setTodaysFocus] = useState<string[]>(() => {
    if (isGuestMode) return guestTodaysFocus;
    const savedFocus = localStorage.getItem('lifequest-todays-focus');
    
    // TEMPORARY: Add a completed quest to test the UI
    const baseFocus = savedFocus ? JSON.parse(savedFocus) : [];
    const testWithCompleted = [...baseFocus, "e9df0754-4969-45e1-af6d-2c90be193c88"]; // "test" quest
    console.log('🧪 TEMPORARY: Adding completed quest to focus for testing:', testWithCompleted);
    
    return testWithCompleted;
  });

  // Update local state when guest mode changes
  useEffect(() => {
    if (isGuestMode) {
      setTodaysFocus(guestTodaysFocus);
    }
  }, [isGuestMode, guestTodaysFocus]);

  // Listen for localStorage changes to sync Today's Focus across pages (not in guest mode)
  useEffect(() => {
    if (isGuestMode) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lifequest-todays-focus' && e.newValue) {
        setTodaysFocus(JSON.parse(e.newValue));
      }
    };

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
  }, [isGuestMode]);

  // Clean up todaysFocus to remove quest IDs that no longer exist or completed non-recurring quests from previous days
  useEffect(() => {
    if (!isGuestMode && todaysFocus.length > 0 && quests.length > 0) {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      
      console.log('🧹 TodaysFocus Cleanup Debug:', {
        today,
        todaysFocusIds: todaysFocus,
        questsData: quests.map(q => ({ 
          id: q.id, 
          name: q.quest_name, 
          status: q.status, 
          type: q.quest_type, 
          completed_at: q.completed_at,
          is_recurring: q.is_recurring
        }))
      });
      
      const validFocusIds = todaysFocus.filter(id => {
        const quest = quests.find(q => q.id === id);
        if (!quest) {
          console.log(`❌ Quest ${id} no longer exists`);
          return false; // Quest no longer exists
        }
        
        // Keep incomplete quests (any type)
        if (quest.status !== 'Completed') {
          console.log(`✅ Keeping incomplete quest: ${quest.quest_name} (${quest.status})`);
          return true;
        }
        
        // Keep completed recurring Daily habits (they reset daily)
        if (quest.quest_type === 'Daily' && quest.is_recurring) {
          console.log(`✅ Keeping completed recurring daily: ${quest.quest_name}`);
          return true;
        }
        
        // Keep completed non-recurring quests if they were completed today
        if (quest.status === 'Completed' && quest.completed_at) {
          const completedDate = new Date(quest.completed_at).toISOString().split('T')[0];
          const keepQuest = completedDate === today;
          console.log(`${keepQuest ? '✅' : '❌'} Completed quest: ${quest.quest_name} (completed: ${completedDate}, today: ${today})`);
          return keepQuest;
        }
        
        // Remove completed non-recurring quests from previous days
        console.log(`❌ Removing completed quest without completed_at: ${quest.quest_name}`);
        return false;
      });
      
      if (validFocusIds.length !== todaysFocus.length) {
        console.log(`🧹 Cleaning up focus list - removing ${todaysFocus.length - validFocusIds.length} invalid quest IDs`);
        console.log('Before cleanup:', todaysFocus);
        console.log('After cleanup:', validFocusIds);
        setTodaysFocus(validFocusIds);
        localStorage.setItem('lifequest-todays-focus', JSON.stringify(validFocusIds));
        window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
      }
    }
  }, [quests, todaysFocus, isGuestMode]);

  // Save todaysFocus to localStorage whenever it changes (not in guest mode)
  useEffect(() => {
    if (!isGuestMode) {
      localStorage.setItem('lifequest-todays-focus', JSON.stringify(todaysFocus));
    }
  }, [todaysFocus, isGuestMode]);

  const handleDailySetup = (selectedQuestIds: string[]) => {
    if (isGuestMode) {
      const newFocus = [...guestTodaysFocus, ...selectedQuestIds];
      updateGuestTodaysFocus(newFocus);
      setTodaysFocus(newFocus); // Update local state immediately
    } else {
      const newFocus = [...todaysFocus, ...selectedQuestIds];
      setTodaysFocus(newFocus);
      localStorage.setItem('lifequest-todays-focus', JSON.stringify(newFocus));
      window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
    }
  };

  const handleRemoveFromFocus = (questId: string) => {
    if (isGuestMode) {
      const newFocus = guestTodaysFocus.filter(id => id !== questId);
      updateGuestTodaysFocus(newFocus);
      setTodaysFocus(newFocus); // Update local state immediately
    } else {
      const newFocus = todaysFocus.filter(id => id !== questId);
      setTodaysFocus(newFocus);
      localStorage.setItem('lifequest-todays-focus', JSON.stringify(newFocus));
      window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
    }
  };

  return {
    todaysFocus: isGuestMode ? guestTodaysFocus : todaysFocus,
    setTodaysFocus: isGuestMode ? updateGuestTodaysFocus : setTodaysFocus,
    handleDailySetup,
    handleRemoveFromFocus
  };
};