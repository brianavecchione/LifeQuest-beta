
import React from 'react';
import CharacterCard from '@/components/CharacterCard';
import XPProgressChart from '@/components/XPProgressChart';

const CharacterStats = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Character Card - 30% width on large screens */}
      <div className="lg:w-[30%]">
        <CharacterCard />
      </div>
      
      {/* XP Progress Chart - 70% width on large screens */}
      <div className="lg:w-[70%]">
        <XPProgressChart />
      </div>
    </div>
  );
};

export default CharacterStats;
