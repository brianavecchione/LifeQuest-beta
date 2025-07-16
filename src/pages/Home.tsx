
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import CharacterStats from '@/components/CharacterStats';
import QuestTracker from '@/components/QuestTracker';
import NewQuestModal from '@/components/NewQuestModal';
import GuestModeIndicator from '@/components/GuestModeIndicator';
import { useUser } from '@/contexts/UserContext';
import { useBackground } from '@/contexts/BackgroundContext';

const Home = () => {
  const { user } = useUser();
  const { backgroundImage } = useBackground();
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
    <div className={`min-h-screen text-white relative z-10 ${!backgroundImage ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}`}>
      {/* Fantasy background pattern - only show if no custom background */}
      {!backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
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
      </div>
    </div>
  );
};

export default Home;
