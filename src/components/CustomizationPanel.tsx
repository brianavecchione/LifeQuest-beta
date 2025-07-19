
import React, { useState, useRef, useEffect } from 'react';
import { Palette, User, Eye, Image, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useBackground } from '@/contexts/BackgroundContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CustomizationPanel = () => {
  const [currentTab, setCurrentTab] = useState<'themes' | 'avatar' | 'background'>('background');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { backgroundImage, backgroundOpacity, uploadBackgroundImage, removeBackgroundImage, setBackgroundOpacity, loading: backgroundLoading } = useBackground();
  const { user } = useAuth();

  // Avatar frame options
  const avatarFrames = [
    { id: 'none', name: 'No Frame', image: null },
    { id: 'cosmic', name: 'Cosmic Nebula', image: '/avatar-frames/cosmic-frame.png' },
    { id: 'candy', name: 'Candy Dreams', image: '/avatar-frames/candy-frame.png' },
    { id: 'ornate', name: 'Royal Ornate', image: '/avatar-frames/ornate-frame.png' },
    { id: 'water', name: 'Ocean Waves', image: '/avatar-frames/water-frame.png' },
    { id: 'steampunk', name: 'Steampunk Gears', image: '/avatar-frames/steampunk-frame.png' }
  ];

  // Fetch user profile and settings data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        console.log('No user found in auth context');
        return;
      }
      
      console.log('Fetching user data for:', user.id);
      
      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        console.log('Profile data:', profile, 'Error:', profileError);
        
        // Fetch settings data
        const { data: settings, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        console.log('Settings data:', settings, 'Error:', settingsError);
        
        setUserProfile(profile);
        setUserSettings(settings);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    try {
      await uploadBackgroundImage(file);
      toast.success('Background image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error('Failed to upload background image');
    }
  };

  const handleRemoveBackground = async () => {
    try {
      await removeBackgroundImage();
      toast.success('Background image removed successfully!');
    } catch (error) {
      console.error('Error removing background image:', error);
      toast.error('Failed to remove background image');
    }
  };



  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-pink-600/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-bold text-pink-400">Customization</h3>
        </div>
        <div className="flex gap-2">
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
          
          <div className="bg-slate-700/50 rounded-lg p-12 text-center border border-slate-600/50">
            <div className="text-6xl mb-4">🎨</div>
            <h5 className="text-white font-bold text-xl mb-2">Custom themes coming soon!</h5>
            <p className="text-slate-400 text-sm">We're working on bringing you amazing fantasy themes to personalize your adventure.</p>
          </div>
        </div>
      )}

      {currentTab === 'avatar' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-pink-300 mb-2">Character Avatar</h4>
            <p className="text-slate-400 text-sm">Choose your character's appearance and style</p>
          </div>

          {/* Avatar Preview with Frame */}
          <div className="bg-slate-700/50 rounded-lg p-6 text-center border border-slate-600/50 mb-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-32 h-32 bg-slate-600 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-slate-600 rounded w-24 mx-auto mb-1"></div>
                <div className="h-3 bg-slate-600 rounded w-16 mx-auto"></div>
              </div>
            ) : (
              <>
                {/* Avatar with Frame Container */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {/* Avatar Base */}
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt="Current avatar"
                      className="w-32 h-32 rounded-full object-cover absolute inset-0 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-4xl font-bold text-slate-900 shadow-lg absolute inset-0">
                      {userProfile?.display_name ? userProfile.display_name[0].toUpperCase() : 'A'}
                    </div>
                  )}
                  
                  {/* Frame Overlay */}
                  {selectedFrame && avatarFrames.find(f => f.id === selectedFrame)?.image && (
                    <img 
                      src={avatarFrames.find(f => f.id === selectedFrame)?.image || ''}
                      alt="Avatar frame"
                      className="w-32 h-32 absolute inset-0 pointer-events-none"
                    />
                  )}
                </div>
                
                <h5 className="text-white font-bold mb-1">Current Avatar</h5>
                <p className="text-slate-400 text-sm mb-1">{userProfile?.display_name || 'Adventurer'}</p>
                {selectedFrame && selectedFrame !== 'none' && (
                  <p className="text-pink-300 text-xs">
                    Frame: {avatarFrames.find(f => f.id === selectedFrame)?.name}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Avatar Frame Selection */}
          <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 mb-6">
            <h6 className="text-pink-300 font-medium mb-4 text-center">Choose Avatar Frame</h6>
            
            {/* Frame Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {avatarFrames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`relative group transition-all duration-200 hover:scale-105 ${
                    selectedFrame === frame.id 
                      ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-800' 
                      : 'hover:ring-1 hover:ring-pink-400/50 hover:ring-offset-1 hover:ring-offset-slate-800'
                  }`}
                >
                  {/* Frame Preview Container */}
                  <div className="relative w-16 h-16 mx-auto">
                    {/* Sample Avatar for Preview */}
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-lg font-bold text-slate-900 shadow-lg absolute inset-0">
                      A
                    </div>
                    
                    {/* Frame Preview */}
                    {frame.image && (
                      <img 
                        src={frame.image}
                        alt={frame.name}
                        className="w-16 h-16 absolute inset-0 pointer-events-none"
                      />
                    )}
                    
                    {/* "No Frame" indicator */}
                    {frame.id === 'none' && (
                      <div className="absolute inset-0 border-2 border-dashed border-slate-500 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Frame Name */}
                  <p className="text-xs text-slate-300 mt-2 group-hover:text-pink-300 transition-colors">
                    {frame.name}
                  </p>
                  
                  {/* Selected Indicator */}
                  {selectedFrame === frame.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Frame Info */}
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                Click on a frame to preview it with your avatar
              </p>
            </div>
          </div>
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

          {/* Background Opacity Control */}
          {backgroundImage && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h6 className="text-pink-300 font-medium">Background Opacity</h6>
                <span className="text-slate-400 text-sm">{Math.round(backgroundOpacity * 100)}%</span>
              </div>
              <Slider
                value={[backgroundOpacity]}
                onValueChange={(value) => setBackgroundOpacity(value[0])}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}

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
              disabled={backgroundLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {backgroundLoading ? 'Uploading...' : 'Upload Background Image'}
            </Button>

            {backgroundImage && (
              <Button 
                onClick={handleRemoveBackground}
                disabled={backgroundLoading}
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
