
import React from 'react';
import CharacterStats from '@/components/CharacterStats';
import QuestTimer from '@/components/QuestTimer';
import QuestTracker from '@/components/QuestTracker';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
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
            🔥 Today's Quest
          </h1>
          <p className="text-xl text-slate-300">
            Focus on what matters most today
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

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Quest
              </Button>
              <Button variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white">
                Quick Daily Setup
              </Button>
            </div>
          </div>
        </div>

        {/* Quest Timer */}
        <div className="mb-12">
          <QuestTimer />
        </div>
      </div>
    </div>
  );
};

export default Home;
