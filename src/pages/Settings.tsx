
import React from 'react';
import AISidekick from '@/components/AISidekick';
import AvatarUpload from '@/components/AvatarUpload';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import { User, Bell, Zap, Shield, Accessibility, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [characterName, setCharacterName] = React.useState(user.name);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const handleNameChange = (value: string) => {
    setCharacterName(value);
    setHasUnsavedChanges(value !== user.name);
  };

  const handleAvatarChange = (avatar: string) => {
    updateUser({ avatar });
    // Avatar changes are saved immediately, don't mark as unsaved
  };

  const handleSaveProfile = () => {
    updateUser({ name: characterName });
    setHasUnsavedChanges(false);
    toast({
      title: "Profile updated!",
      description: "Your character name has been saved.",
    });
  };

  const handleReduceAnimationsChange = (checked: boolean) => {
    updateUser({ reduceAnimations: checked });
    
    // Apply CSS class to document root to control animations globally
    if (checked) {
      document.documentElement.classList.add('reduce-animations');
    } else {
      document.documentElement.classList.remove('reduce-animations');
    }
  };

  // Apply reduce animations class on component mount if setting is enabled
  React.useEffect(() => {
    if (user.reduceAnimations) {
      document.documentElement.classList.add('reduce-animations');
    }
  }, [user.reduceAnimations]);

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      {/* Fantasy background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('hsl(var(--app-pattern))')}'.replace('#', '')} fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            ⚙️ Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Configure your adventure preferences
          </p>
        </div>

        {/* Profile Settings */}
        <div className="mb-12">
          <div className="bg-component-background rounded-xl p-6 border border-blue-600/30 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-blue-400">Profile Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-component-foreground mb-2">Character Name</label>
                <div className="flex gap-2">
                  <Input 
                    value={characterName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="flex-1"
                    placeholder="Enter your character name"
                  />
                  {hasUnsavedChanges && (
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 px-3"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {hasUnsavedChanges && (
                  <p className="text-xs text-amber-400 mt-1">
                    You have unsaved changes
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-component-foreground mb-2">Avatar</label>
                <AvatarUpload 
                  currentAvatar={user.avatar}
                  onAvatarChange={handleAvatarChange}
                  userName={user.name}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-12">
          <div className="bg-component-background rounded-xl p-6 border border-purple-600/30 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-purple-400">Notification Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-component-foreground font-medium">Daily Quest Reminders</h4>
                  <p className="text-muted-foreground text-sm">Get notified about incomplete daily quests</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-component-foreground font-medium">Streak Warnings</h4>
                  <p className="text-muted-foreground text-sm">Alert when streaks are about to break</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="mb-12">
          <div className="bg-component-background rounded-xl p-6 border border-rose-600/30 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Accessibility className="w-6 h-6 text-rose-400" />
              <h3 className="text-xl font-bold text-rose-400">Accessibility</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-component-foreground font-medium">Reduce Animations</h4>
                  <p className="text-muted-foreground text-sm">Minimize visual motion and transitions for a calmer experience</p>
                </div>
                <Switch 
                  checked={user.reduceAnimations}
                  onCheckedChange={handleReduceAnimationsChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* XP Calculation Settings */}
        <div className="mb-12">
          <div className="bg-component-background rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-emerald-400">XP Calculation Rules</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-component-foreground font-medium">Bonus XP for Streaks</h4>
                  <p className="text-muted-foreground text-sm">Extra XP for maintaining daily streaks</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-component-foreground font-medium">Difficulty Multipliers</h4>
                  <p className="text-muted-foreground text-sm">Higher XP for harder quests</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-red-900/10 to-red-800/10 rounded-xl p-6 border border-red-600/30 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Trash2 className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">Delete Account</h4>
                <p className="text-component-foreground text-sm mb-4">
                  Permanently delete your LifeQuest account and all associated data. This action cannot be undone.
                </p>
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Sidekick */}
      <AISidekick />
      
      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
      />
    </div>
  );
};

export default Settings;
