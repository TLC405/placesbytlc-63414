import { useNavigate } from "react-router-dom";
import { Heart, LogIn, UserPlus, Terminal, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success("✨ ACCESS GRANTED");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "ACCESS DENIED");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
      
      toast.success("✨ ACCOUNT CREATED");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast.error(error.message || "ACCESS DENIED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900">
      {/* Cyberpunk grid background */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255, 16, 240, 0.05) 25%, rgba(255, 16, 240, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.05) 75%, rgba(0, 240, 255, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255, 16, 240, 0.05) 25%, rgba(255, 16, 240, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.05) 75%, rgba(0, 240, 255, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Animated scanline */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent pointer-events-none animate-scan" />

      {/* Neon glow accents */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header */}
        <header className="text-center mb-16 space-y-8">
          <div className="inline-block relative">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl opacity-50 blur-3xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_80px_rgba(255,16,240,0.9)] glitch-text">
                <Terminal className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 glitch-text animate-glow">
              PLACES_BY_TLC
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" />
              <p className="text-cyan-300 font-mono text-xl tracking-widest flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                SYSTEM_ONLINE
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
            </div>
            <p className="text-pink-200/80 text-lg max-w-2xl mx-auto font-mono">
              &gt; date_discovery_protocol.exe
            </p>
          </div>
        </header>


        {/* Auth Terminal - Integrated into design */}
        <Card className="max-w-2xl mx-auto mb-16 bg-black/80 backdrop-blur-xl border-2 border-pink-500/50 shadow-[0_0_50px_rgba(255,16,240,0.4)] relative overflow-hidden">
          {/* Terminal header bar */}
          <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 px-6 py-3 border-b border-pink-500/30 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(255,16,240,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(159,0,255,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            </div>
            <p className="text-pink-300 font-mono text-sm flex-1">&gt; AUTH_TERMINAL.exe</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="w-full bg-black/60 border-b-2 border-pink-500/30 rounded-none p-0">
              <TabsTrigger 
                value="signin" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 font-mono uppercase tracking-wider py-4 border-r border-pink-500/20"
              >
                <LogIn className="w-4 h-4 mr-2" />
                SIGN_IN
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-300 font-mono uppercase tracking-wider py-4"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                SIGN_UP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="p-8 space-y-6">
              <div className="text-center mb-6 space-y-2">
                <p className="text-pink-300 font-mono text-sm animate-pulse">&gt; AUTHENTICATE_USER</p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
              </div>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-pink-500">&gt;</span> EMAIL_ADDRESS
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@tlc.system"
                    required
                    className="h-12 bg-black/60 border-2 border-pink-500/30 text-pink-200 font-mono placeholder:text-pink-500/30 focus:border-pink-400 focus:shadow-[0_0_20px_rgba(255,16,240,0.3)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-pink-500">&gt;</span> PASSWORD
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 bg-black/60 border-2 border-pink-500/30 text-pink-200 font-mono placeholder:text-pink-500/30 focus:border-pink-400 focus:shadow-[0_0_20px_rgba(255,16,240,0.3)] transition-all"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-mono font-bold text-lg shadow-[0_0_30px_rgba(255,16,240,0.5)] hover:shadow-[0_0_40px_rgba(255,16,240,0.7)] transition-all uppercase tracking-wider border-2 border-pink-400/50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">AUTHENTICATING...</span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      ACCESS_SYSTEM
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="p-8 space-y-6">
              <div className="text-center mb-6 space-y-2">
                <p className="text-cyan-300 font-mono text-sm animate-pulse">&gt; CREATE_NEW_USER</p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              </div>
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-pink-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-cyan-500">&gt;</span> EMAIL_ADDRESS
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="newuser@tlc.system"
                    required
                    className="h-12 bg-black/60 border-2 border-cyan-500/30 text-cyan-200 font-mono placeholder:text-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-pink-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-cyan-500">&gt;</span> PASSWORD
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 bg-black/60 border-2 border-cyan-500/30 text-cyan-200 font-mono placeholder:text-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold text-lg shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-all uppercase tracking-wider border-2 border-cyan-400/50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">CREATING_ACCOUNT...</span>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      REGISTER_USER
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Feature Cards - Static Preview */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <Card className="group relative overflow-hidden bg-black/60 backdrop-blur-xl border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-500 shadow-[0_0_30px_rgba(255,16,240,0.3)] hover:shadow-[0_0_60px_rgba(255,16,240,0.5)] hover:scale-105">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-pulse" />
            <div className="p-8 space-y-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(255,16,240,0.7)] group-hover:scale-110 transition-transform group-hover:rotate-6">
                <span className="text-4xl">📍</span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2 font-mono glitch-text">PLACES_MODULE</h3>
                <p className="text-pink-200/70 font-mono text-sm">&gt; discover_date_locations.exe</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded text-xs font-mono text-pink-300 hover:bg-pink-500/30 transition-colors">SEARCH</span>
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-xs font-mono text-purple-300 hover:bg-purple-500/30 transition-colors">DISCOVERY</span>
                <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded text-xs font-mono text-pink-300 hover:bg-pink-500/30 transition-colors">AI_POWERED</span>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-black/60 backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_60px_rgba(0,240,255,0.5)] hover:scale-105">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="p-8 space-y-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.7)] group-hover:scale-110 transition-transform group-hover:rotate-6">
                <span className="text-4xl">💝</span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 font-mono glitch-text">QUIZ_ENGINE</h3>
                <p className="text-cyan-200/70 font-mono text-sm">&gt; personality_analysis.sys</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 transition-colors">MBTI</span>
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-xs font-mono text-blue-300 hover:bg-blue-500/30 transition-colors">LOVE_LANG</span>
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 transition-colors">RELATIONSHIP</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center space-y-4 font-mono">
          <div className="flex items-center justify-center gap-4 text-sm text-pink-300/70">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              SYSTEM_STATUS: ONLINE
            </span>
            <span>•</span>
            <span>v1.0_CYBERPUNK</span>
            <span>•</span>
            <span className="text-cyan-300">TLC_ARMY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
