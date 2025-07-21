import React from 'react';
import StreaksSection from '@/components/StreaksSection';
import StatsSection from '@/components/StatsSection';
import BadgesSection from '@/components/BadgesSection';
import PageContentWrapper from '@/components/PageContentWrapper';

const Achievements = () => {
  return (
    <PageContentWrapper>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-3"
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))',
                textShadow: '0 0 20px rgba(251, 191, 36, 0.3)'
              }}>
            🏅 Achievements
          </h1>
          <p className="text-lg text-slate-300" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
            Celebrate your victories and progress
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Streaks + Stats */}
        <div className="space-y-6">
          {/* Streaks Section */}
          <StreaksSection />
          
          {/* Stats Section */}
          <StatsSection />
        </div>

        {/* Right Column: Badges */}
        <div>
          <BadgesSection />
        </div>
      </div>
    </PageContentWrapper>
  );
};

export default Achievements;