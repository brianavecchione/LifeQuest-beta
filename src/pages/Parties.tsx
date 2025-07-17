import React from 'react';
import PartyDashboard from '@/components/PartyDashboard';
import PartyQuests from '@/components/PartyQuests';
import PartyLeaderboard from '@/components/PartyLeaderboard';
import PartyChat from '@/components/PartyChat';
import PartyManagement from '@/components/PartyManagement';
import PageContentWrapper from '@/components/PageContentWrapper';
import { Users, Clock } from 'lucide-react';

const Parties = () => {
  return (
    <PageContentWrapper>
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
    </PageContentWrapper>
  );
};

export default Parties;