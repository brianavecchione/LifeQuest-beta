import React from 'react';

const Challenges = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Fantasy background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            🏆 LifeQuest Challenges
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            (Coming Soon)
          </p>
        </div>

        {/* Coming Soon Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-amber-500/30 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚀</span>
              </div>
              
              <h2 className="text-2xl font-bold text-amber-400 mb-4">
                Weekly Quests from HQ
              </h2>
              
              <div className="space-y-4 text-lg leading-relaxed text-slate-300">
                <p>
                  Weekly quests from HQ to help you build real-life habits and rituals—narrative-driven, science-backed, and deeply immersive.
                </p>
                <p>
                  Track your progress, earn XP and badges, and become the hero of your own life. Stay tuned for the first challenge drop!
                </p>
              </div>
              
              <div className="pt-6">
                <div className="bg-gradient-to-r from-amber-900/30 via-yellow-900/30 to-amber-900/30 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-amber-400 font-medium text-sm">
                    💡 Tip: Complete your daily quests and achievements to prepare for the challenge system!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;