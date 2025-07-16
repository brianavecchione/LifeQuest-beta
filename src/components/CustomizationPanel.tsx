
import React, { useState, useRef, useEffect } from 'react';
import { Palette, User, Eye, Settings, Image, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CustomizationPanel = () => {
  const [currentTab, setCurrentTab] = useState<'themes' | 'avatar' | 'background'>('themes');
  const [selectedTheme, setSelectedTheme] = useState('dark-forest');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Load existing background image on component mount
  useEffect(() => {
    if (user) {
      loadBackgroundImage();
    }
  }, [user]);

  const loadBackgroundImage = async () => {
    if (!user) return;
    
    try {
      const { data: files } = await supabase.storage
        .from('backgrounds')
        .list(`${user.id}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (files && files.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('backgrounds')
          .getPublicUrl(`${user.id}/${files[0].name}`);
        
        setBackgroundImage(publicUrl);
        
        // Apply background image to body
        document.body.style.backgroundImage = `url(${publicUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
      }
    } catch (error) {
      console.error('Error loading background image:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Remove existing background image first
      await removeExistingBackground();

      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `background-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath);

      setBackgroundImage(publicUrl);
      
      // Apply background image to body
      document.body.style.backgroundImage = `url(${publicUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';

      toast.success('Background image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error('Failed to upload background image');
    } finally {
      setUploading(false);
    }
  };

  const removeExistingBackground = async () => {
    if (!user) return;

    try {
      const { data: files } = await supabase.storage
        .from('backgrounds')
        .list(`${user.id}/`);

      if (files && files.length > 0) {
        const filePaths = files.map(file => `${user.id}/${file.name}`);
        await supabase.storage
          .from('backgrounds')
          .remove(filePaths);
      }
    } catch (error) {
      console.error('Error removing existing background:', error);
    }
  };

  const handleRemoveBackground = async () => {
    if (!user) return;

    setUploading(true);

    try {
      await removeExistingBackground();
      
      setBackgroundImage(null);
      
      // Reset body background to default
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';

      toast.success('Background image removed successfully!');
    } catch (error) {
      console.error('Error removing background image:', error);
      toast.error('Failed to remove background image');
    } finally {
      setUploading(false);
    }
  };

  const themes = [
    {
      id: 'dark-forest',
      name: 'Dark Forest',
      description: 'Mysterious woodland adventure',
      colors: ['from-green-900', 'to-slate-900'],
      accent: 'emerald',
      preview: '🌲'
    },
    {
      id: 'fiery-dungeon',
      name: 'Fiery Dungeon',
      description: 'Blazing underground realm',
      colors: ['from-red-900', 'to-orange-900'],
      accent: 'red-orange',
      preview: '🔥'
    },
    {
      id: 'icy-mountains',
      name: 'Icy Mountains',
      description: 'Frozen peaks and glaciers',
      colors: ['from-blue-900', 'to-cyan-900'],
      accent: 'blue-cyan',
      preview: '🏔️'
    },
    {
      id: 'mystical-void',
      name: 'Mystical Void',
      description: 'Cosmic magical realm',
      colors: ['from-purple-900', 'to-indigo-900'],
      accent: 'purple',
      preview: '✨'
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
          <button
            onClick={() => setCurrentTab('background')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'background' 
                ? 'bg-pink-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Image className="w-4 h-4 mr-1 inline" />
            Background
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
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`cursor-pointer rounded-lg p-4 border-2 transition-all hover:scale-105 ${
                  selectedTheme === theme.id 
                    ? 'border-pink-500 bg-pink-900/20' 
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{theme.preview}</div>
                  <h5 className="text-white font-bold mb-1">{theme.name}</h5>
                  <p className="text-slate-300 text-sm mb-3">{theme.description}</p>
                  
                  {/* Theme Preview */}
                  <div className={`h-8 rounded-lg bg-gradient-to-r ${theme.colors[0]} ${theme.colors[1]} mb-3`} />
                  
                  {selectedTheme === theme.id && (
                    <Badge className="bg-pink-600 text-white">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Apply Theme
          </Button>
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

      {currentTab === 'background' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-pink-300 mb-2">Custom Background</h4>
            <p className="text-slate-400 text-sm">Upload your own background image to personalize your experience</p>
          </div>

          {/* Current Background Preview */}
          <div className="bg-slate-700/50 rounded-lg p-6 text-center border border-slate-600/50 mb-6">
            {backgroundImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-600/50">
                  <img 
                    src={backgroundImage} 
                    alt="Custom background" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-white font-bold mb-1">Current Background</h5>
                  <p className="text-slate-400 text-sm">Your custom background image</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-600/50 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No custom background</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-white font-bold mb-1">Default Background</h5>
                  <p className="text-slate-400 text-sm">Using the default dark theme</p>
                </div>
              </div>
            )}
          </div>

          {/* Upload and Remove Controls */}
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Background Image'}
            </Button>

            {backgroundImage && (
              <Button 
                onClick={handleRemoveBackground}
                disabled={uploading}
                variant="outline"
                className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <X className="w-4 h-4 mr-2" />
                Remove Background Image
              </Button>
            )}
          </div>

          {/* Usage Notes */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
            <h6 className="text-pink-300 font-medium mb-2">📋 Usage Notes</h6>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Image will be applied as the background for all pages</li>
              <li>• Components and cards will maintain their dark styling</li>
              <li>• Supported formats: JPG, PNG, GIF, WebP</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Image will be automatically scaled to fit your screen</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;
