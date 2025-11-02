import { ReactNode } from "react";
import { AlertTriangle, Lock } from "lucide-react";

interface AdminOnlyOverlayProps {
  children: ReactNode;
}

export const AdminOnlyOverlay = ({ children }: AdminOnlyOverlayProps) => {
  return (
    <div className="relative min-h-screen">
      {/* Sticky Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-white shadow-lg animate-pulse">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
          <span className="font-bold text-sm md:text-base">
            ⚠️ ADMIN ONLY - RESTRICTED ACCESS
          </span>
          <Lock className="w-5 h-5" />
        </div>
      </div>

      {/* Semi-transparent Red Shader */}
      <div className="absolute inset-0 bg-red-500/10 pointer-events-none z-10" />

      {/* Content (slightly dimmed) */}
      <div className="relative z-0">
        {children}
      </div>

      {/* Bottom Reminder */}
      <div className="fixed bottom-4 right-4 z-50 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <Lock className="w-4 h-4" />
        <span className="text-xs font-medium">Admin Feature</span>
      </div>
    </div>
  );
};
