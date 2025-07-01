
import React from 'react';
import { Badge } from '@/components/ui/badge';

const BadgeSystem = () => {
  const earnedBadges = [
    {
      name: 'Everlasting Bond',
      rarity: 'Main',
      icon: '💕',
      description: 'Completed your first relationship quest'
    },
    {
      name: 'Castle Keeper',
      rarity: 'Legendary',
      icon: '🏰',
      description: 'Maintained your home for 30 days'
    },
    {
      name: 'Animal Caretaker',
      rarity: 'Legendary',
      icon: '🐾',
      description: 'Cared for pets consistently'
    }
  ];

  const unearnedBadges = [
    {
      name: 'Muscle Master',
      rarity: 'Side',
      icon: '💪',
      description: 'Complete 50 workout quests',
      progress: '23/50'
    },
    {
      name: 'Lean Legionnaire',
      rarity: 'Side',
      icon: '⚔️',
      description: 'Maintain healthy eating for 21 days',
      progress: '12/21'
    },
    {
      name: 'Admin Achiever',
      rarity: 'Main',
      icon: '✅',
      description: 'Complete 100 administrative tasks',
      progress: '67/100'
    },
    {
      name: 'Quest Master',
      rarity: 'Legendary',
      icon: '👑',
      description: 'Complete 1000 total quests',
      progress: '342/1000'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Main': return 'bg-blue-600';
      case 'Side': return 'bg-green-600';
      case 'Legendary': return 'bg-purple-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Earned Badges */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-green-600/30 shadow-2xl">
        <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
          🏆 Earned Badges
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {earnedBadges.map((badge, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-green-500/50 transition-all">
              <div className="text-center">
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="text-white font-bold mb-2">{badge.name}</h3>
                <Badge className={`${getRarityColor(badge.rarity)} text-white mb-2`}>
                  {badge.rarity}
                </Badge>
                <p className="text-slate-300 text-sm">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-slate-400 text-center mt-6 italic">
          There's nothing here! Keep progressing through your quests to earn badges.
        </p>
      </div>

      {/* Unearned Badges */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-amber-600/30 shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
          🔒 Unearned Badges
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unearnedBadges.map((badge, index) => (
            <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 opacity-75">
              <div className="flex items-center gap-4">
                <div className="text-3xl opacity-50">{badge.icon}</div>
                <div className="flex-1">
                  <h3 className="text-slate-300 font-bold mb-1">{badge.name}</h3>
                  <Badge className={`${getRarityColor(badge.rarity)} text-white mb-2 opacity-75`}>
                    {badge.rarity}
                  </Badge>
                  <p className="text-slate-400 text-sm mb-2">{badge.description}</p>
                  <div className="bg-slate-600 rounded-full h-2 mb-1">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(parseInt(badge.progress.split('/')[0]) / parseInt(badge.progress.split('/')[1])) * 100}%` }}
                    />
                  </div>
                  <span className="text-amber-400 text-xs font-medium">{badge.progress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;
