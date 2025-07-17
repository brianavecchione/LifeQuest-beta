import React, { useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Headphones } from "lucide-react";

export const YouTubePlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-20 right-20 z-50 hidden md:block">
      {/* Collapsed state - Toggle button */}
      {!isExpanded && (
        <button
          onClick={toggleExpanded}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg border border-border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Open Quest Soundtrack Player"
        >
          <Headphones className="h-6 w-6" />
        </button>
      )}

      {/* Expanded state - Full player */}
      {isExpanded && (
        <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-xl border border-border overflow-hidden animate-scale-in">
          {/* Header with title and close button */}
          <div className="p-3 pb-2 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Quest Soundtrack</h3>
              <p className="text-sm text-muted-foreground">Optional ambient music to accompany your journey. Press play to begin.</p>
            </div>
            <button
              onClick={toggleExpanded}
              className="ml-3 p-1 hover:bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Collapse Quest Soundtrack Player"
            >
              <Headphones className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* YouTube iframe - rendered even when collapsed to maintain playback */}
          <div className={isExpanded ? "block" : "hidden"}>
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
      )}

      {/* Hidden iframe container to maintain playback when collapsed */}
      {!isExpanded && (
        <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
          <iframe 
            width="300" 
            height="169" 
            src="https://www.youtube.com/embed/nOmx4ePpuRM?si=0i37bV2oLEfTXSKe" 
            title="YouTube video player (background)" 
            frameBorder="0" 
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-auto"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;