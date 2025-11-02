import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Shield, Calendar, Palette, LogOut, TestTube, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TesterDashboard = () => {
  const [smsUsage, setSmsUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadSmsUsage();
  }, []);

  const loadSmsUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("sms_usage")
        .select("*")
        .eq("user_id", user.id)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      setSmsUsage(data || []);
    } catch (error) {
      console.error("Error loading SMS usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "✨ Logged out",
        description: "You've been logged out successfully.",
      });
      window.location.href = "/";
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };

  const freeSmsUsed = smsUsage.filter(s => s.is_free_message).length;
  const hasFreeSmS = freeSmsUsed === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Cyberpunk Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-black/60 backdrop-blur-xl border-2 border-pink-500/30 rounded-2xl shadow-[0_0_40px_rgba(255,16,240,0.3)]">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 p-3 animate-pulse shadow-[0_0_30px_rgba(255,16,240,0.6)]">
              <TestTube className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                TESTER_DASHBOARD
              </h1>
              <p className="text-cyan-300 font-mono text-sm">&gt; authorized_testing_mode</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Status Card */}
        <Card className="mb-6 bg-black/60 backdrop-blur-xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-300">
              <Zap className="w-5 h-5" />
              <Badge variant={hasFreeSmS ? "default" : "secondary"} className="bg-gradient-to-r from-pink-500 to-cyan-500">
                {hasFreeSmS ? "Free SMS Available" : "Free SMS Used"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cyan-200/80 font-mono">
              &gt; {hasFreeSmS ? "STATUS: 1 FREE SMS CREDIT AVAILABLE" : "STATUS: FREE SMS QUOTA DEPLETED"}
            </p>
          </CardContent>
        </Card>

        {/* Available Features */}
        <Card className="mb-6 bg-black/60 backdrop-blur-xl border-2 border-pink-500/30 shadow-[0_0_30px_rgba(255,16,240,0.2)]">
          <CardHeader>
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              AUTHORIZED_TEST_ZONES
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              className="w-full justify-start h-auto py-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/50 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(255,16,240,0.4)] transition-all"
              variant="outline"
              onClick={() => navigate("/")}
            >
              <Calendar className="w-6 h-6 mr-4 text-pink-400" />
              <div className="text-left">
                <div className="font-bold text-lg text-pink-300">PLACES_MODULE</div>
                <div className="text-xs text-cyan-200/70 font-mono">
                  &gt; test_date_spot_discovery_system
                </div>
              </div>
            </Button>

            <Button
              className="w-full justify-start h-auto py-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all"
              variant="outline"
              onClick={() => navigate("/cartoonifier")}
            >
              <Palette className="w-6 h-6 mr-4 text-cyan-400" />
              <div className="text-left">
                <div className="font-bold text-lg text-cyan-300">CARTOONIFIER_ENGINE</div>
                <div className="text-xs text-pink-200/70 font-mono">
                  &gt; transform_photos_neural_network
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* SMS Usage History */}
        {smsUsage.length > 0 && (
          <Card className="bg-black/60 backdrop-blur-xl border-2 border-purple-500/30 shadow-[0_0_30px_rgba(157,0,255,0.2)]">
            <CardHeader>
              <CardTitle className="text-purple-300">SMS_USAGE_LOG</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {smsUsage.map((sms) => (
                  <div
                    key={sms.id}
                    className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-purple-300">{sms.message_type}</p>
                      <p className="text-xs text-cyan-200/70">
                        &gt; TO: {sms.phone_number}
                      </p>
                    </div>
                    <div className="text-right">
                      {sms.is_free_message && (
                        <Badge variant="secondary" className="mb-1 bg-pink-500/20 text-pink-300 border-pink-500/50">
                          FREE
                        </Badge>
                      )}
                      <p className="text-xs text-cyan-200/70">
                        {new Date(sms.sent_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TesterDashboard;
