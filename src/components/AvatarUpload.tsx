import React, { useState, useRef } from 'react';
import { Upload, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (avatar: string) => void;
  userName: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, onAvatarChange, userName }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleSaveAvatar = () => {
    if (previewImage) {
      onAvatarChange(previewImage);
      setPreviewImage(null);
      toast({
        title: "Avatar updated!",
        description: "Your new avatar has been saved.",
      });
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
                className="bg-green-600 hover:bg-green-700"
              >
                Save Avatar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancelPreview}
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