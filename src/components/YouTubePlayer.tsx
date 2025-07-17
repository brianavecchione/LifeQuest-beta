import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Headphones, X, RefreshCw } from "lucide-react";

// Default YouTube embed URL
const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/embed/nOmx4ePpuRM?si=0i37bV2oLEfTXSKe";

// Helper function to extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to validate YouTube URL
const isValidYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export const YouTubePlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Custom URL state
  const [customUrl, setCustomUrl] = useState("");
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState(() => {
    // Get saved URL from local storage or use default
    const savedUrl = localStorage.getItem("quest-soundtrack-url");
    return savedUrl || DEFAULT_YOUTUBE_URL;
  });
  const [urlError, setUrlError] = useState("");
  
  // Save to local storage when URL changes
  useEffect(() => {
    if (currentEmbedUrl !== DEFAULT_YOUTUBE_URL) {
      localStorage.setItem("quest-soundtrack-url", currentEmbedUrl);
    }
  }, [currentEmbedUrl]);
  
  if (isMobile) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
    setUrlError(""); // Clear any previous errors
  };
  
  const applyCustomUrl = () => {
    if (!customUrl.trim()) {
      setUrlError("Please enter a URL");
      return;
    }
    
    if (!isValidYouTubeUrl(customUrl)) {
      setUrlError("Please enter a valid YouTube URL");
      return;
    }
    
    const videoId = extractYouTubeId(customUrl);
    
    if (!videoId) {
      setUrlError("Could not extract YouTube video ID");
      return;
    }
    
    // Create proper embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    setCurrentEmbedUrl(embedUrl);
    setCustomUrl("");
  };
  
  const restoreDefaultUrl = () => {
    setCurrentEmbedUrl(DEFAULT_YOUTUBE_URL);
    localStorage.removeItem("quest-soundtrack-url");
    setCustomUrl("");
    setUrlError("");
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

      {/* Player container - always present in DOM */}
      <div 
        className={`${
          isExpanded 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none absolute"
        } ${isExpanded ? "animate-scale-in" : ""} transition-opacity duration-300 w-[300px]`}
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-xl border border-border overflow-hidden">
          {/* Header with title and close button - Only visible when expanded */}
          {isExpanded && (
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
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          )}
          
          {/* Single YouTube iframe */}
          <div className="w-full h-[169px] bg-background">
            <iframe 
              ref={iframeRef}
              width="300" 
              height="169" 
              src={currentEmbedUrl}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
              style={{ 
                display: 'block',
                visibility: 'visible' 
              }}
              onLoad={() => setIframeLoaded(true)}
            ></iframe>
          </div>
          
          {/* Custom YouTube URL Input - Only visible when expanded */}
          {isExpanded && (
            <div className="p-4 space-y-3">
              <div>
                <label 
                  htmlFor="youtube-url" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Paste your own YouTube URL
                </label>
                <div className="flex space-x-2">
                  <input
                    id="youtube-url"
                    type="text"
                    value={customUrl}
                    onChange={handleUrlChange}
                    placeholder="YouTube video or playlist link"
                    className={`flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${urlError ? 'border-destructive' : ''}`}
                  />
                  <button 
                    onClick={applyCustomUrl}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Begin
                  </button>
                </div>
                {urlError && (
                  <p className="text-xs text-destructive mt-1">{urlError}</p>
                )}
              </div>
              
              <button
                onClick={restoreDefaultUrl}
                className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Restore default quest music
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;