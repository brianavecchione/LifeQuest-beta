import React from 'react';
import AchievementsSection from '@/components/AchievementsSection';
import PageContentWrapper from '@/components/PageContentWrapper';

const Achievements = () => {
  return (
    <PageContentWrapper>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
          🏅 Achievements & Badges
        </h1>
        <p className="text-xl text-slate-300">
          Celebrate your victories and progress
        </p>
      </div>

      {/* Achievements and Streaks with Integrated Badges */}
      <div className="mb-12">
        <AchievementsSection />
      </div>
    </PageContentWrapper>
  );
};

export default Achievements;