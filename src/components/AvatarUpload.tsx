import React, { useState, useRef } from 'react';
import { Upload, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (avatar: string) => void;
  userName: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, onAvatarChange, userName }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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
    if (!previewImage || !user) return;
    
    setIsUploading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();
      
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = blob.type.split('/')[1] || 'png';
      const fileName = `${user.id}/avatar_${timestamp}.${fileExtension}`;
      
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
        .eq('user_id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Update local state
      onAvatarChange(publicUrl);
      setPreviewImage(null);
      
      toast({
        title: "Avatar updated!",
        description: "Your new avatar has been saved permanently.",
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

  const renderAvatar = (avatarData: string, size: string = "w-16 h-16") => {
    if (avatarData.startsWith('data:') || avatarData.startsWith('http')) {
      return (
        <img 
          src={avatarData} 
          alt="Avatar" 
          className={`${size} rounded-full object-cover`}
        />
      );
    } else {
      return (
        <div className={`${size} bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900`}>
          {avatarData}
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {previewImage ? (
          <div className="relative">
            {renderAvatar(previewImage)}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>
        ) : (
          renderAvatar(currentAvatar)
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
              className="border-blue-600 text-blue-400"
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
                className="bg-green-600 hover:bg-green-700"
              >
                {isUploading ? 'Saving...' : 'Save Avatar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancelPreview}
                disabled={isUploading}
                className="border-slate-600 text-slate-400"
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
      
      {previewImage && (
        <div className="p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <p className="text-sm text-blue-400">
            <Camera className="w-4 h-4 inline mr-1" />
            Preview: Click "Save Avatar" to apply this image
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;