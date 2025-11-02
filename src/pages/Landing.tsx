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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Matrix-style grid background */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255, 16, 240, 0.1) 25%, rgba(255, 16, 240, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.1) 75%, rgba(0, 240, 255, 0.1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255, 16, 240, 0.1) 25%, rgba(255, 16, 240, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.1) 75%, rgba(0, 240, 255, 0.1) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Multiple scanlines for terminal effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent pointer-events-none animate-scan" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-scan" style={{ animationDelay: "1.5s" }} />

      {/* Corner glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10 min-h-screen flex flex-col">
        {/* Terminal Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_40px_rgba(255,16,240,0.6)] animate-pulse">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 glitch-text">
                PLACES_BY_TLC
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
                <p className="text-green-400 font-mono text-xs tracking-widest">SYSTEM_ONLINE</p>
              </div>
            </div>
          </div>
          
          {/* Terminal command line */}
          <div className="font-mono text-sm space-y-1">
            <p className="text-pink-400">&gt; Initializing TLC Authentication Protocol...</p>
            <p className="text-cyan-400">&gt; Loading date_discovery_system.exe</p>
            <p className="text-purple-400">&gt; Awaiting user credentials...</p>
          </div>
        </header>


        {/* Auth Terminal Console */}
        <Card className="flex-1 bg-black/90 backdrop-blur-sm border-2 border-pink-500/30 shadow-[0_0_60px_rgba(255,16,240,0.3)] relative overflow-hidden">
          {/* Terminal header bar */}
          <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 px-4 py-2 border-b border-pink-500/20 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-pink-500/80 shadow-[0_0_8px_rgba(255,16,240,0.6)]" />
              <div className="w-3 h-3 rounded-full bg-purple-500/80 shadow-[0_0_8px_rgba(159,0,255,0.6)]" />
              <div className="w-3 h-3 rounded-full bg-cyan-500/80 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            </div>
            <p className="text-pink-300/80 font-mono text-xs flex-1">~/AUTH_TERMINAL.exe</p>
            <p className="text-cyan-300/60 font-mono text-xs">v2.5.1</p>
          </div>

          <Tabs defaultValue="signin" className="w-full h-full flex flex-col">
            <TabsList className="w-full bg-black/40 border-b border-pink-500/20 rounded-none p-0 h-auto">
              <TabsTrigger 
                value="signin" 
                className="flex-1 data-[state=active]:bg-pink-500/10 data-[state=active]:text-pink-300 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 text-pink-300/60 font-mono text-xs uppercase tracking-wider py-3 transition-all"
              >
                <LogIn className="w-3 h-3 mr-2" />
                [SIGN_IN]
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="flex-1 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-300 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 text-cyan-300/60 font-mono text-xs uppercase tracking-wider py-3 transition-all"
              >
                <UserPlus className="w-3 h-3 mr-2" />
                [SIGN_UP]
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="p-6 space-y-6 flex-1">
              <div className="space-y-3 mb-6">
                <p className="text-pink-400 font-mono text-xs">&gt; Authenticating user session...</p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
              </div>
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-cyan-300/80 tracking-wider flex items-center gap-2">
                    <span className="text-pink-500">$</span> EMAIL
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@tlc.system"
                    required
                    className="h-11 bg-black/50 border border-pink-500/30 text-pink-200 font-mono text-sm placeholder:text-pink-500/20 focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-cyan-300/80 tracking-wider flex items-center gap-2">
                    <span className="text-pink-500">$</span> PASSWORD
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 bg-black/50 border border-pink-500/30 text-pink-200 font-mono text-sm placeholder:text-pink-500/20 focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-500 hover:to-purple-500 text-white font-mono font-bold text-sm shadow-[0_0_20px_rgba(255,16,240,0.4)] hover:shadow-[0_0_30px_rgba(255,16,240,0.6)] transition-all uppercase tracking-widest border border-pink-400/30"
                >
                  {isLoading ? (
                    <span className="animate-pulse">&gt; AUTHENTICATING...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      &gt; ACCESS_SYSTEM
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="p-6 space-y-6 flex-1">
              <div className="space-y-3 mb-6">
                <p className="text-cyan-400 font-mono text-xs">&gt; Creating new user account...</p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              </div>
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-pink-300/80 tracking-wider flex items-center gap-2">
                    <span className="text-cyan-500">$</span> EMAIL
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="newuser@tlc.system"
                    required
                    className="h-11 bg-black/50 border border-cyan-500/30 text-cyan-200 font-mono text-sm placeholder:text-cyan-500/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-pink-300/80 tracking-wider flex items-center gap-2">
                    <span className="text-cyan-500">$</span> PASSWORD
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 bg-black/50 border border-cyan-500/30 text-cyan-200 font-mono text-sm placeholder:text-cyan-500/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all uppercase tracking-widest border border-cyan-400/30"
                >
                  {isLoading ? (
                    <span className="animate-pulse">&gt; CREATING_ACCOUNT...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      &gt; REGISTER_USER
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer - Terminal Status */}
        <footer className="mt-8 pt-4 border-t border-pink-500/20 font-mono text-xs">
          <div className="flex items-center justify-between text-pink-300/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                ONLINE
              </span>
              <span className="text-cyan-300/50">v2.5.1_HACKER</span>
            </div>
            <span className="text-purple-300/50">TLC_ARMY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
