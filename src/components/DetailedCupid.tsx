import { useEffect, useState, memo } from "react";
import cupidImageOriginal from "@/assets/cupid-icon-original.png";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const DetailedCupidComponent = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);

  // Check if Cupid is enabled from database
  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'cupid_visible')
        .maybeSingle();
      
      const settingValue = data?.setting_value as any;
      setIsEnabled(settingValue?.enabled ?? true);
    };
    
    loadSettings();
    
    // Subscribe to settings changes
    const channel = supabase
      .channel('app_settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings', filter: 'setting_key=eq.cupid_visible' },
        (payload) => {
          const newValue = (payload.new as any)?.setting_value;
          setIsEnabled(newValue?.enabled ?? true);
        }
      )
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!isEnabled || !isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[998] flex flex-col items-center gap-2">
      {/* Cupid Image - Static & Clickable */}
      <div className="relative group">
        <img
          src={cupidImageOriginal}
          alt="Cupid - Your Love Assistant"
          className="w-20 h-20 cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 4px 20px rgba(236, 72, 153, 0.4))',
          }}
          onClick={() => {
            // Future: Open Cupid chat or settings
            console.log('Cupid clicked!');
          }}
        />
        
        {/* Close Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            localStorage.setItem('cupid_hidden', 'true');
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Tooltip */}
      <div className="bg-pink-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        💘 Cupid
      </div>
    </div>
  );
};

export const DetailedCupid = memo(DetailedCupidComponent);
