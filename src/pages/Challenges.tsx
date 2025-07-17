import React from 'react';
import AISidekick from '@/components/AISidekick';
import PageContentWrapper from '@/components/PageContentWrapper';
import { Zap, Clock, Star, Trophy } from 'lucide-react';

const Challenges = () => {
  return (
    <PageContentWrapper>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))',
              textShadow: '0 0 20px rgba(251, 191, 36, 0.3)'
            }}>
          ⚡ Challenges
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
          Epic adventures await those brave enough to accept the call
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Coming Soon Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-orange-600/30 shadow-2xl text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-orange-400 mb-3">
              Challenges Coming Soon!
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Complete immersive, science-backed quests designed by LifeQuest.
              These narrative-based challenges will level up your focus, habits, and emotional resilience — one week at a time.
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Weekly Challenges</h3>
              <p className="text-slate-400 text-sm">
                7-day immersive experiences with daily check-ins and progress tracking
              </p>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Science-Backed</h3>
              <p className="text-slate-400 text-sm">
                Evidence-based techniques for building lasting habits and mental resilience
              </p>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Epic Rewards</h3>
              <p className="text-slate-400 text-sm">
                Unlock exclusive badges, titles, and bonus XP for completing challenges
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg border border-orange-500/30">
            <h3 className="text-xl font-bold text-orange-300 mb-2">
              Ready to Level Up?
            </h3>
            <p className="text-slate-300 mb-4">
              Stay tuned for epic challenges that will transform your daily routine into an adventure.
            </p>
            <div className="text-sm text-slate-400">
              🚀 Coming in the next major update
            </div>
          </div>
        </div>
      </div>

      {/* AI Sidekick */}
      <AISidekick />
    </PageContentWrapper>
  );
};

export default Challenges;