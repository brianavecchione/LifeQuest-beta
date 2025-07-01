
import React from 'react';
import CharacterStats from '@/components/CharacterStats';
import QuestTimer from '@/components/QuestTimer';
import QuestTracker from '@/components/QuestTracker';
import QuestCategories from '@/components/QuestCategories';
import Minigames from '@/components/Minigames';
import BadgeSystem from '@/components/BadgeSystem';
import Soundtrack from '@/components/Soundtrack';
import AISidekick from '@/components/AISidekick';
import NarrativeJournal from '@/components/NarrativeJournal';
import AchievementsSection from '@/components/AchievementsSection';
import InventorySystem from '@/components/InventorySystem';
import CustomizationPanel from '@/components/CustomizationPanel';

const Index = () => {
  const character = {
    name: 'Adventurer',
    level: 2,
    xp: 75,
    xpToNext: 100,
    totalXp: 333,
    gold: 35
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Fantasy background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            ⚔️ Quest Master Dashboard ⚔️
          </h1>
          <p className="text-xl text-slate-300">
            Embark on your daily adventures and level up your life!
          </p>
        </div>

        {/* Character Stats */}
        <div className="mb-12">
          <CharacterStats character={character} />
        </div>

        {/* Quest Tracker */}
        <div className="mb-12">
          <QuestTracker />
        </div>

        {/* Quest Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-amber-400 mb-8">🗺️ Quest Categories</h2>
          <QuestCategories />
        </div>

        {/* Narrative Journal */}
        <div className="mb-12">
          <NarrativeJournal />
        </div>

        {/* Achievements and Streaks */}
        <div className="mb-12">
          <AchievementsSection />
        </div>

        {/* Inventory & Gear */}
        <div className="mb-12">
          <InventorySystem />
        </div>

        {/* Minigames */}
        <div className="mb-12">
          <Minigames />
        </div>

        {/* Badge System */}
        <div className="mb-12">
          <BadgeSystem />
        </div>

        {/* Customization Panel */}
        <div className="mb-12">
          <CustomizationPanel />
        </div>

        {/* Soundtrack */}
        <div className="mb-12">
          <Soundtrack />
        </div>

        {/* Quest Timer - moved to bottom */}
        <div className="mb-12">
          <QuestTimer />
        </div>
      </div>

      {/* AI Sidekick */}
      <AISidekick />
    </div>
  );
};

export default Index;
