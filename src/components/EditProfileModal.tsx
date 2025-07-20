import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AvatarFrame {
  id: string;
  name: string;
  display_name: string;
  description: string;
  rarity: string;
  css_class: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user: authUser } = useAuth();
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  
  const [characterName, setCharacterName] = useState(user.name);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableFrames, setAvailableFrames] = useState<AvatarFrame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState(user.avatarFrame || 'none');
  const [isLoadingFrames, setIsLoadingFrames] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available avatar frames
  useEffect(() => {
    const loadAvatarFrames = async () => {
      setIsLoadingFrames(true);
      try {
        const { data, error } = await supabase
          .from('avatar_frames')
          .select('id, name, display_name, description, rarity, css_class')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setAvailableFrames(data || []);
      } catch (error) {
        console.error('Error loading avatar frames:', error);
        toast({
          title: "Error loading frames",
          description: "Could not load avatar frame options.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFrames(false);
      }
    };

    if (isOpen) {
      loadAvatarFrames();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCharacterName(user.name);
      setSelectedFrame(user.avatarFrame || 'none');
      setPreviewImage(null);
    }
  }, [isOpen, user.name, user.avatarFrame]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!previewImage || !authUser) return;
    
    setIsUploading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();
      
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = blob.type.split('/')[1] || 'png';
      const fileName = `${authUser.id}/avatar_${timestamp}.${fileExtension}`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', authUser.id);

      if (profileError) {
        throw profileError;
      }

      // Update local state
      updateUser({ avatar: publicUrl });
      setPreviewImage(null);
      
      toast({
        title: "Avatar updated!",
        description: "Your new avatar has been saved.",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to save avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderAvatar = (avatarData: string, frameClass: string, size: string = "w-20 h-20") => {
    const baseClasses = `${size} rounded-full object-cover`;
    const frameClasses = frameClass !== 'avatar-frame-none' ? frameClass : '';
    
    if (avatarData.startsWith('data:') || avatarData.startsWith('http')) {
      return (
        <img 
          src={avatarData} 
          alt="Avatar" 
          className={`${baseClasses} ${frameClasses}`}
        />
      );
    } else {
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xl font-bold text-slate-900 ${frameClasses}`}>
          {avatarData}
        </div>
      );
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update name if changed
      const updates: any = {};
      if (characterName !== user.name) {
        updates.name = characterName;
      }
      
      // Update avatar frame if changed
      if (selectedFrame !== user.avatarFrame) {
        updates.avatarFrame = selectedFrame;
        
        // Update in database
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_frame: selectedFrame })
          .eq('user_id', authUser?.id);

        if (error) throw error;
      }

      // Update local user state
      if (Object.keys(updates).length > 0) {
        updateUser(updates);
      }

      toast({
        title: "Profile updated!",
        description: "Your profile changes have been saved.",
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const hasChanges = characterName !== user.name || selectedFrame !== user.avatarFrame || previewImage !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-amber-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              ⚙️ Edit Profile
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-slate-700/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Character Name */}
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Character Name</label>
            <Input 
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter your character name"
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-slate-300 mb-3 font-medium">Avatar</label>
            <div className="flex items-center gap-4 mb-4">
              {previewImage ? (
                <div className="relative">
                  {renderAvatar(previewImage, selectedFrame !== 'none' ? availableFrames.find(f => f.name === selectedFrame)?.css_class || '' : '')}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
              ) : (
                renderAvatar(user.avatar, selectedFrame !== 'none' ? availableFrames.find(f => f.name === selectedFrame)?.css_class || '' : '')
              )}
              
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {!previewImage ? (
                  <Button 
                    variant="outline" 
                    className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveAvatar}
                      disabled={isUploading}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isUploading ? 'Saving...' : 'Save Avatar'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelPreview}
                      disabled={isUploading}
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:bg-slate-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-slate-400">
                  Upload a custom image or use your initials
                </p>
              </div>
            </div>
          </div>

          {/* Avatar Frame Selector */}
          <div>
            <label className="block text-slate-300 mb-3 font-medium">Choose Your Frame</label>
            
            {isLoadingFrames ? (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 mt-2">Loading frames...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {availableFrames.map((frame) => (
                  <div
                    key={frame.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFrame === frame.name 
                        ? 'border-amber-500 bg-amber-500/10' 
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                    }`}
                    onClick={() => setSelectedFrame(frame.name)}
                  >
                    <div className="text-center">
                      {/* Preview of frame with current avatar */}
                      <div className="flex justify-center mb-2">
                        {renderAvatar(
                          previewImage || user.avatar, 
                          frame.css_class, 
                          "w-12 h-12"
                        )}
                      </div>
                      
                      <h4 className="text-sm font-medium text-white mb-1">
                        {frame.display_name}
                      </h4>
                      <p className={`text-xs capitalize ${getRarityColor(frame.rarity)} font-medium`}>
                        {frame.rarity}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {frame.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={!hasChanges || isSaving}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;