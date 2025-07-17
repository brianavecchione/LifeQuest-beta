import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import CharacterStats from '@/components/CharacterStats';
import QuestTracker from '@/components/QuestTracker';
import NewQuestModal from '@/components/NewQuestModal';
import GuestModeIndicator from '@/components/GuestModeIndicator';
import PageContentWrapper from '@/components/PageContentWrapper';
import { useUser } from '@/contexts/UserContext';

const Home = () => {
  const { user } = useUser();
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);

  // Format current date
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <PageContentWrapper>
      {/* Guest Mode Indicator */}
      <GuestModeIndicator />
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
          🔥 Today's Quests
        </h1>
        <p className="text-xl text-slate-300">
          Focus on what matters most today
        </p>
        
        {/* Current Date */}
        <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
          <Calendar className="w-4 h-4" />
          <span className="text-base font-medium">{getCurrentDate()}</span>
        </div>
      </div>

      {/* Character Stats */}
      <div className="mb-12">
        <CharacterStats />
      </div>

      {/* Quest Tracker */}
      <div className="mb-12">
        <QuestTracker />
      </div>

      {/* New Quest Modal */}
      <NewQuestModal
        isOpen={isNewQuestModalOpen}
        onClose={() => setIsNewQuestModalOpen(false)}
      />
    </PageContentWrapper>
  );
};

export default Home;