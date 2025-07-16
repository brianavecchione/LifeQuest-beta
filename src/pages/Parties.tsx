
import React from 'react';
import PartyDashboard from '@/components/PartyDashboard';
import PartyQuests from '@/components/PartyQuests';
import PartyLeaderboard from '@/components/PartyLeaderboard';
import PartyChat from '@/components/PartyChat';
import PartyManagement from '@/components/PartyManagement';
import { Users, Clock } from 'lucide-react';
import { useBackground } from '@/contexts/BackgroundContext';

const Parties = () => {
  const { backgroundImage } = useBackground();
  
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            👥 Parties & Social Questing
          </h1>
          <p className="text-xl text-slate-300">
            Team up with friends for epic adventures and friendly competition
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-400" />
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-blue-300 text-center mb-2">
              Parties Coming Soon!
            </h2>
            <p className="text-slate-300 text-center leading-relaxed">
              You'll soon be able to team up with others to complete social quests, track collective progress, and support each other's journeys.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Party Dashboard & Quests */}
          <div className="xl:col-span-2 space-y-8">
            <PartyDashboard />
            <PartyQuests />
            <PartyLeaderboard />
          </div>

          {/* Right Column - Chat & Management */}
          <div className="space-y-8">
            <PartyChat />
            <PartyManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parties;
