import React from 'react';
import { useBackground } from '@/contexts/BackgroundContext';

const BackgroundImage: React.FC = () => {
  const { backgroundImage } = useBackground();

  if (!backgroundImage) return null;

  return (
    <div 
      className="absolute inset-0 -z-10 bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: 'fixed'
      }}
    />
  );
};

export default BackgroundImage;