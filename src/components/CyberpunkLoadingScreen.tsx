import { useEffect, useState } from "react";

interface CyberpunkLoadingScreenProps {
  text?: string;
  subtext?: string;
}

export const CyberpunkLoadingScreen = ({ 
  text = "INITIALIZING SYSTEM", 
  subtext = "Loading modules..." 
}: CyberpunkLoadingScreenProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Matrix Background Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10 animate-scan"
          style={{
            background: 'linear-gradient(0deg, transparent 0%, rgba(0, 255, 255, 0.3) 50%, transparent 100%)',
            backgroundSize: '100% 4px',
            animation: 'scan 8s linear infinite'
          }}
        />
      </div>

      {/* Corner Glows - Top Left (Cyan) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-[150px] animate-pulse" />
      
      {/* Corner Glows - Bottom Right (Pink) */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-[150px] animate-pulse" 
        style={{ animationDelay: '1s' }} 
      />

      {/* Cyber Frame Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-400/50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-400/50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-pink-400/50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-pink-400/50" />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Terminal Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="text-cyan-400 text-sm font-mono tracking-wider">
            [ TLC VISION SYSTEM ]
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-mono">
            <span className="text-green-400">●</span>
            <span className="text-green-400">CONNECTED</span>
            <span className="text-cyan-400 mx-2">|</span>
            <span className="text-cyan-400">STATUS: LOADING</span>
          </div>
        </div>

        {/* Main Loading Text */}
        <div className="relative">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-cyan-400 animate-gradient tracking-wider font-mono glitch-text mb-4">
            {text}
          </h1>
          
          {/* Loading Animation */}
          <div className="text-center space-y-4 mt-8">
            <div className="text-2xl font-mono text-cyan-400">
              {subtext}{dots}
            </div>
            
            {/* Progress Bar */}
            <div className="w-64 h-2 bg-gray-800 border border-cyan-400/30 mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-pink-400 animate-pulse"
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  width: '100%'
                }}
              />
            </div>

            {/* Terminal Command Lines */}
            <div className="text-xs font-mono text-cyan-400/60 text-left space-y-1 mt-8">
              <div>&gt; Loading core systems{dots}</div>
              <div>&gt; Initializing database connection{dots}</div>
              <div>&gt; Establishing secure session{dots}</div>
              <div className="text-green-400">&gt; System ready</div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="text-xs font-mono text-cyan-400/50 tracking-wider">
            [ POWERED BY TLC ] [ ENCRYPTED CONNECTION ] [ v2.5.0 ]
          </div>
        </div>
      </div>
    </div>
  );
};
