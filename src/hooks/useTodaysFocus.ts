import { useState, useEffect } from 'react';
import { Quest } from '@/hooks/useQuests';
import { useGuest } from '@/contexts/GuestContext';

export const useTodaysFocus = (quests: Quest[]) => {
  const { isGuestMode, guestTodaysFocus, updateGuestTodaysFocus } = useGuest();
  
  const [todaysFocus, setTodaysFocus] = useState<string[]>(() => {
    if (isGuestMode) return guestTodaysFocus;
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

  // Clean up todaysFocus to remove quest IDs that no longer exist
  useEffect(() => {
    if (todaysFocus.length > 0 && quests.length > 0) {
      const validFocusIds = todaysFocus.filter(id => 
        quests.some(quest => quest.id === id)
      );
      
      if (validFocusIds.length !== todaysFocus.length) {
        console.log(`Cleaning up focus list - removing ${todaysFocus.length - validFocusIds.length} invalid quest IDs`);
        setTodaysFocus(validFocusIds);
        localStorage.setItem('lifequest-todays-focus', JSON.stringify(validFocusIds));
        window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
      }
    }
  }, [quests, todaysFocus]);

  // Save todaysFocus to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lifequest-todays-focus', JSON.stringify(todaysFocus));
  }, [todaysFocus]);

  const handleDailySetup = (selectedQuestIds: string[]) => {
    const newFocus = [...todaysFocus, ...selectedQuestIds];
    setTodaysFocus(newFocus);
    localStorage.setItem('lifequest-todays-focus', JSON.stringify(newFocus));
    window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
  };

  const handleRemoveFromFocus = (questId: string) => {
    const newFocus = todaysFocus.filter(id => id !== questId);
    setTodaysFocus(newFocus);
    localStorage.setItem('lifequest-todays-focus', JSON.stringify(newFocus));
    window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
  };

  return {
    todaysFocus,
    setTodaysFocus,
    handleDailySetup,
    handleRemoveFromFocus
  };
};