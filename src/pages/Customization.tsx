import React from 'react';
import AISidekick from '@/components/AISidekick';
import Soundtrack from '@/components/Soundtrack';
import CustomizationPanel from '@/components/CustomizationPanel';
import { Palette } from 'lucide-react';

const Customization = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fantasy background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            <Palette className="inline-block w-12 h-12 mr-4 text-purple-400" />
            Customization
          </h1>
          <p className="text-xl text-muted-foreground">
            Personalize your adventure experience
          </p>
        </div>

        {/* Soundtrack & Atmosphere Settings */}
        <div className="mb-12">
          <Soundtrack />
        </div>

        {/* Customization Settings */}
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