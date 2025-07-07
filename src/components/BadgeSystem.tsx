
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useAchievements } from '@/hooks/useAchievements';

const BadgeSystem = () => {
  const { achievements, loading } = useAchievements();
  
  if (loading) {
    return <div className="text-center text-muted-foreground">Loading achievements...</div>;
  }

  const earnedBadges = achievements.filter(achievement => achievement.is_completed);
  const unearnedBadges = achievements.filter(achievement => !achievement.is_completed);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Bronze': return 'bg-orange-600';
      case 'Silver': return 'bg-gray-500';
      case 'Gold': return 'bg-yellow-600';
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
          {earnedBadges.map((achievement) => (
            <div key={achievement.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-green-500/50 transition-all">
              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-white font-bold mb-2">{achievement.achievement_name}</h3>
                <Badge className={`${getRarityColor(achievement.quest_value)} text-white mb-2`}>
                  {achievement.quest_value}
                </Badge>
                <p className="text-slate-300 text-sm">{achievement.description}</p>
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
          {unearnedBadges.map((achievement) => (
            <div key={achievement.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 opacity-75">
              <div className="flex items-center gap-4">
                <div className="text-3xl opacity-50">🔒</div>
                <div className="flex-1">
                  <h3 className="text-slate-300 font-bold mb-1">{achievement.achievement_name}</h3>
                  <Badge className={`${getRarityColor(achievement.quest_value)} text-white mb-2 opacity-75`}>
                    {achievement.quest_value}
                  </Badge>
                  <p className="text-slate-400 text-sm mb-2">{achievement.description}</p>
                  <div className="bg-slate-600 rounded-full h-2 mb-1">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(achievement.achievement_progress_current / achievement.achievement_progress_goal) * 100}%` }}
                    />
                  </div>
                  <span className="text-amber-400 text-xs font-medium">
                    {achievement.achievement_progress_current}/{achievement.achievement_progress_goal}
                  </span>
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
