
import React from 'react';
import CharacterCard from '@/components/CharacterCard';
import XPProgressChart from '@/components/XPProgressChart';

const CharacterStats = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Character Card - Left Panel */}
      <CharacterCard />
      
      {/* XP Progress Chart - Right Panel */}
      <XPProgressChart />
    </div>
  );
};

export default CharacterStats;
