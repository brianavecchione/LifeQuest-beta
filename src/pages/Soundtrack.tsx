
import React from 'react';
import SoundtrackComponent from '@/components/Soundtrack';
import CustomizationPanel from '@/components/CustomizationPanel';
import { useTheme } from '@/contexts/ThemeContext';

const Soundtrack = () => {
  const { isClassicFantasy } = useTheme();
  
  return (
    <div className={`min-h-screen text-white ${
      isClassicFantasy 
        ? 'fantasy-bg fantasy-text-primary' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      {/* Fantasy background pattern */}
      {!isClassicFantasy && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${
            isClassicFantasy 
              ? 'fantasy-accent' 
              : 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent'
          }`}>
            🎵 Soundtrack & Atmosphere
          </h1>
          <p className={`text-xl ${
            isClassicFantasy ? 'fantasy-text-secondary' : 'text-slate-300'
          }`}>
            Create your perfect questing environment
          </p>
        </div>

        {/* Soundtrack */}
        <div className="mb-12">
          <SoundtrackComponent />
        </div>

        {/* Customization Panel */}
        <div className="mb-12">
          <CustomizationPanel />
        </div>
      </div>
    </div>
  );
};

export default Soundtrack;
