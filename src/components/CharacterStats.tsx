
import React from 'react';
import CharacterCard from '@/components/CharacterCard';
import XPProgressChart from '@/components/XPProgressChart';

const CharacterStats = React.memo(() => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Character Card - 40% width on large screens */}
      <div className="lg:w-[40%]">
        <CharacterCard />
      </div>
      
      {/* XP Progress Chart - 60% width on large screens */}
      <div className="lg:w-[60%]">
        <XPProgressChart />
      </div>
    </div>
  );
});

export default CharacterStats;
