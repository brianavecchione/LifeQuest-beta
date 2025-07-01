
import React from 'react';
import { Star, Trophy, Flag, Crown } from 'lucide-react';

const QuestCategories = () => {
  const categories = [
    {
      name: 'Dailies',
      icon: Star,
      count: 5,
      color: 'from-yellow-600 to-amber-600',
      borderColor: 'border-yellow-500/50',
      description: 'Daily recurring tasks'
    },
    {
      name: 'Main Quests',
      icon: Trophy,
      count: 3,
      color: 'from-red-600 to-rose-600',
      borderColor: 'border-red-500/50',
      description: 'Primary objectives'
    },
    {
      name: 'Side Quests',
      icon: Flag,
      count: 8,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/50',
      description: 'Optional activities'
    },
    {
      name: 'Legendary Quests',
      icon: Crown,
      count: 1,
      color: 'from-purple-600 to-violet-600',
      borderColor: 'border-purple-500/50',
      description: 'Epic challenges'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${category.color} rounded-xl p-6 border ${category.borderColor} shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group`}
        >
          <div className="flex items-center justify-between mb-4">
            <category.icon className="w-8 h-8 text-white" />
            <span className="bg-white/20 text-white text-sm font-bold px-2 py-1 rounded-full">
              {category.count}
            </span>
          </div>
          
          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-200 transition-colors">
            {category.name}
          </h3>
          
          <p className="text-white/80 text-sm">
            {category.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuestCategories;
