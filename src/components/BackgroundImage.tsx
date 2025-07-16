import React from 'react';
import { useBackground } from '@/contexts/BackgroundContext';

const BackgroundImage: React.FC = () => {
  const { backgroundImage } = useBackground();

  console.log('BackgroundImage component - backgroundImage:', backgroundImage);

  if (!backgroundImage) return null;

  return (
    <div 
      className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: 'fixed'
      }}
    />
  );
};

export default BackgroundImage;