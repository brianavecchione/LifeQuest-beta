import React, { ReactNode } from 'react';
import { useBackground } from '@/contexts/BackgroundContext';

interface PageContentWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * A consistent wrapper component for all page content in logged-in pages
 * Provides standardized spacing and background handling
 */
const PageContentWrapper: React.FC<PageContentWrapperProps> = ({ 
  children,
  className = ""
}) => {
  const { backgroundImage } = useBackground();
  
  // Debug logging to verify component is rendered
  React.useEffect(() => {
    console.log('🔍 PageContentWrapper mounted with 14rem padding');
  }, []);
  
  return (
    <div className={`min-h-screen text-white relative z-10 ${!backgroundImage ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}`}>
      {/* Fantasy background pattern - only show if no custom background */}
      {!backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 page-content-wrapper ${className}`} style={{ paddingTop: '14rem' }}>
        {children}
      </div>
    </div>
  );
};

export default PageContentWrapper;