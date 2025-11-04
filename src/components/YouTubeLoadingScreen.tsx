import { useEffect, useState } from "react";

interface YouTubeLoadingScreenProps {
  videoId?: string;
  brandText?: string;
}

export const YouTubeLoadingScreen = ({ 
  videoId = "TZawqWnFQ3w",
  brandText = "TLC"
}: YouTubeLoadingScreenProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Allow video to load
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0">
        <iframe
          className={`w-full h-full scale-150 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          title="Loading Screen"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            pointerEvents: 'none',
            border: 'none'
          }}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* TLC Branding Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* TLC Logo/Text */}
        <div className="text-center space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-pulse tracking-wider">
            {brandText}
          </h1>
          <div className="text-2xl md:text-3xl font-light text-white/90 tracking-[0.3em]">
            VISION SYSTEM
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Status Text */}
        <div className="text-sm font-mono text-cyan-400/80 tracking-wider">
          INITIALIZING SYSTEM...
        </div>
      </div>

      {/* Corner Frame Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-pink-400/50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-400/50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-400/50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-pink-400/50" />
    </div>
  );
};
