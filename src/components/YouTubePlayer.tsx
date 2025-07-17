import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const YouTubePlayer = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-20 z-50 hidden md:block">
      <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-xl border border-border overflow-hidden">
        <div className="p-3 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Quest Soundtrack</h3>
          <p className="text-sm text-muted-foreground">Optional ambient music to accompany your journey. Press play to begin.</p>
        </div>
        <iframe 
          width="300" 
          height="169" 
          src="https://www.youtube.com/embed/nOmx4ePpuRM?si=0i37bV2oLEfTXSKe" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-auto"
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubePlayer;