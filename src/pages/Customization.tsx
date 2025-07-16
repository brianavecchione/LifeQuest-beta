import React from 'react';
import CustomizationPanel from '@/components/CustomizationPanel';
import AISidekick from '@/components/AISidekick';
import { useBackground } from '@/contexts/BackgroundContext';

const Customization = () => {
  const { backgroundImage } = useBackground();
  
  return (
    <div className={`min-h-screen text-white relative z-10 ${!backgroundImage ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}`}>
      {/* Fantasy background pattern - only show if no custom background */}
      {!backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-4">
            🎨 Customization
          </h1>
          <p className="text-xl text-slate-300">
            Personalize your adventure experience
          </p>
        </div>

        {/* Customization Panel */}
        <div className="mb-12">
          <CustomizationPanel />
        </div>
      </div>

      {/* AI Sidekick */}
      <AISidekick />
    </div>
  );
};

export default Customization;