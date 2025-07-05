
import React, { useState } from 'react';
import { Palette, User, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

const CustomizationPanel = () => {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState<'themes' | 'avatar'>('themes');

  const themes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Modern dark adventure theme',
      colors: ['from-slate-900', 'to-slate-800'],
      accent: 'blue',
      preview: '⚔️'
    },
    {
      id: 'classic-fantasy',
      name: 'Classic Fantasy',
      description: 'Medieval parchment with enchanted forest elements',
      colors: ['from-amber-900', 'to-orange-900'],
      accent: 'amber',
      preview: '🏰'
    }
  ];

  const avatarStyles = [
    {
      id: 'knight',
      name: 'Noble Knight',
      icon: '⚔️',
      description: 'Classic warrior archetype'
    },
    {
      id: 'mage',
      name: 'Wise Mage',
      icon: '🧙‍♂️',
      description: 'Master of arcane arts'
    },
    {
      id: 'rogue',
      name: 'Shadow Rogue',
      icon: '🥷',
      description: 'Stealthy and cunning'
    },
    {
      id: 'ranger',
      name: 'Forest Ranger',
      icon: '🏹',
      description: 'Nature\'s guardian'
    },
    {
      id: 'paladin',
      name: 'Holy Paladin',
      icon: '🛡️',
      description: 'Divine protector'
    },
    {
      id: 'custom',
      name: 'Custom Avatar',
      icon: '📷',
      description: 'Upload your own image'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-pink-600/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-bold text-pink-400">Customization</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('themes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'themes' 
                ? 'bg-pink-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Eye className="w-4 h-4 mr-1 inline" />
            Themes
          </button>
          <button
            onClick={() => setCurrentTab('avatar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'avatar' 
                ? 'bg-pink-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <User className="w-4 h-4 mr-1 inline" />
            Avatar
          </button>
        </div>
      </div>

      {currentTab === 'themes' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-pink-300 mb-2">Choose Your Realm</h4>
            <p className="text-slate-400 text-sm">Transform your dashboard with different fantasy themes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as 'default' | 'classic-fantasy')}
                className={`cursor-pointer rounded-lg p-4 border-2 transition-all hover:scale-105 ${
                  theme === themeOption.id 
                    ? 'border-pink-500 bg-pink-900/20' 
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{themeOption.preview}</div>
                  <h5 className="text-white font-bold mb-1">{themeOption.name}</h5>
                  <p className="text-slate-300 text-sm mb-3">{themeOption.description}</p>
                  
                  {/* Theme Preview */}
                  <div className={`h-8 rounded-lg bg-gradient-to-r ${themeOption.colors[0]} ${themeOption.colors[1]} mb-3`} />
                  
                  {theme === themeOption.id && (
                    <Badge className="bg-pink-600 text-white">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-slate-400 text-sm text-center">
              Theme applied automatically - changes are saved across sessions
            </p>
          </div>
        </div>
      )}

      {currentTab === 'avatar' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-pink-300 mb-2">Character Avatar</h4>
            <p className="text-slate-400 text-sm">Choose your character's appearance and style</p>
          </div>

          {/* Current Avatar Preview */}
          <div className="bg-slate-700/50 rounded-lg p-6 text-center border border-slate-600/50 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-slate-900 shadow-lg mx-auto mb-3">
              A
            </div>
            <h5 className="text-white font-bold">Current Avatar</h5>
            <p className="text-slate-400 text-sm">Adventurer</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {avatarStyles.map((style) => (
              <div
                key={style.id}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-pink-500/50 transition-all cursor-pointer hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <h6 className="text-white font-medium text-sm mb-1">{style.name}</h6>
                  <p className="text-slate-400 text-xs">{style.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
            <User className="w-4 h-4 mr-2" />
            Save Avatar
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;
