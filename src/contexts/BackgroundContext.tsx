import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BackgroundContextType {
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  uploadBackgroundImage: (file: File) => Promise<string>;
  removeBackgroundImage: () => Promise<void>;
  loading: boolean;
}

const BackgroundContext = createContext<BackgroundContextType | null>(null);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load existing background image on mount
  useEffect(() => {
    if (user) {
      loadBackgroundImage();
    } else {
      setBackgroundImageState(null);
    }
  }, [user]);

  const loadBackgroundImage = async () => {
    if (!user) return;
    
    console.log('Loading background image for user:', user.id);
    
    try {
      const { data: files } = await supabase.storage
        .from('backgrounds')
        .list(`${user.id}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      console.log('Background files found:', files);

      if (files && files.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('backgrounds')
          .getPublicUrl(`${user.id}/${files[0].name}`);
        
        console.log('Background image URL:', publicUrl);
        setBackgroundImageState(publicUrl);
      }
    } catch (error) {
      console.error('Error loading background image:', error);
    }
  };

  const setBackgroundImage = (url: string | null) => {
    setBackgroundImageState(url);
  };

  const uploadBackgroundImage = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);

    try {
      // Remove existing background first
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

      setBackgroundImageState(publicUrl);
      return publicUrl;
    } finally {
      setLoading(false);
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

  const removeBackgroundImage = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await removeExistingBackground();
      setBackgroundImageState(null);
    } finally {
      setLoading(false);
    }
  };

  const value: BackgroundContextType = {
    backgroundImage,
    setBackgroundImage,
    uploadBackgroundImage,
    removeBackgroundImage,
    loading,
  };

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};