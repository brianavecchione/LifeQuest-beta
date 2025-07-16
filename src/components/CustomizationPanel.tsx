
import React, { useState } from 'react';
import { Palette, User, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const CustomizationPanel = () => {
  const { theme, applyTheme } = useTheme();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState<'themes' | 'avatar'>('themes');
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const themes = [
    {
      id: 'dark-mode',
      name: 'Dark Mode',
      description: 'Classic LifeQuest theme with a dark interface',
      colors: ['from-slate-900', 'to-slate-800'],
      accent: 'primary',
      preview: '🌙'
    },
    {
      id: 'light-mode',
      name: 'Light Mode',
      description: 'A clean, minimal interface for those who prefer a brighter look',
      colors: ['from-slate-50', 'to-slate-100'],
      accent: 'primary',
      preview: '☀️'
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

  const handleApplyTheme = () => {
    applyTheme(selectedTheme as 'dark-mode' | 'light-mode');
    toast({
      title: "Theme Applied!",
      description: `Switched to ${themes.find(t => t.id === selectedTheme)?.name}`,
    });
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-2xl">
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
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
            <h4 className="text-lg font-semibold text-pink-300 mb-2">Choose Your Theme</h4>
            <p className="text-muted-foreground text-sm">Customize your LifeQuest experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                onClick={() => setSelectedTheme(themeOption.id as 'dark-mode' | 'light-mode')}
                className={`cursor-pointer rounded-lg p-4 border-2 transition-all hover:scale-105 ${
                  selectedTheme === themeOption.id 
                    ? 'border-pink-500 bg-pink-900/20' 
                    : 'border-border bg-muted/50 hover:border-muted-foreground/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{themeOption.preview}</div>
                  <h5 className="text-foreground font-bold mb-1">{themeOption.name}</h5>
                  <p className="text-muted-foreground text-sm mb-3">{themeOption.description}</p>
                  
                  {/* Theme Preview */}
                  <div className={`h-8 rounded-lg bg-gradient-to-r ${themeOption.colors[0]} ${themeOption.colors[1]} mb-3`} />
                  
                  {theme === themeOption.id && (
                    <Badge className="bg-green-600 text-white">
                      Active
                    </Badge>
                  )}
                  {selectedTheme === themeOption.id && theme !== themeOption.id && (
                    <Badge className="bg-pink-600 text-white">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleApplyTheme}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Apply Theme
          </Button>
        </div>
      )}

      {currentTab === 'avatar' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-pink-300 mb-2">Character Avatar</h4>
            <p className="text-muted-foreground text-sm">Choose your character's appearance and style</p>
          </div>

          {/* Current Avatar Preview */}
          <div className="bg-muted/50 rounded-lg p-6 text-center border mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-slate-900 shadow-lg mx-auto mb-3">
              A
            </div>
            <h5 className="text-foreground font-bold">Current Avatar</h5>
            <p className="text-muted-foreground text-sm">Adventurer</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {avatarStyles.map((style) => (
              <div
                key={style.id}
                className="bg-muted/50 rounded-lg p-4 border hover:border-pink-500/50 transition-all cursor-pointer hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <h6 className="text-foreground font-medium text-sm mb-1">{style.name}</h6>
                  <p className="text-muted-foreground text-xs">{style.description}</p>
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
