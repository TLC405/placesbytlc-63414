import { useNavigate } from "react-router-dom";
import { Heart, LogIn, UserPlus, Terminal, Zap, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success("✨ ACCESS GRANTED");
      navigate("/home");
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
          emailRedirectTo: `${window.location.origin}/home`
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
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
      {/* Animated matrix rain background */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 240, 255, 0.15) 25%, rgba(0, 240, 255, 0.15) 26%, transparent 27%, transparent 74%, rgba(255, 16, 240, 0.15) 75%, rgba(255, 16, 240, 0.15) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 240, 255, 0.15) 25%, rgba(0, 240, 255, 0.15) 26%, transparent 27%, transparent 74%, rgba(255, 16, 240, 0.15) 75%, rgba(255, 16, 240, 0.15) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Animated scanlines */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none animate-scan" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent pointer-events-none animate-scan" style={{ animationDelay: "1s" }} />

      {/* Massive corner glows */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-cyan-500/30 rounded-full blur-[200px] pointer-events-none animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-pink-500/30 rounded-full blur-[200px] pointer-events-none animate-pulse" style={{ animationDuration: "3s" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[180px] pointer-events-none" />

      {/* Cyber frame borders */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-cyan-400 pointer-events-none z-20 opacity-80" style={{ clipPath: "polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%)" }} />
      <div className="fixed top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-cyan-400 pointer-events-none z-20 opacity-80" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 80% 100%, 80% 20%, 0 20%)" }} />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-pink-400 pointer-events-none z-20 opacity-80" style={{ clipPath: "polygon(0 0, 20% 0, 20% 80%, 100% 80%, 100% 100%, 0 100%)" }} />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-pink-400 pointer-events-none z-20 opacity-80" style={{ clipPath: "polygon(80% 0, 100% 0, 100% 100%, 0 100%, 0 80%, 80% 80%)" }} />

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl md:text-3xl font-black font-mono text-cyan-400 tracking-wider">
              TLC VISION
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded text-cyan-300 font-mono text-xs tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              ENCRYPTED
            </div>
            <div className="px-4 py-2 bg-green-500/20 border border-green-400/50 rounded text-green-300 font-mono text-xs tracking-widest shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              SECURE
            </div>
          </div>
        </header>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl space-y-8">
            {!showAuth ? (
              <>
                {/* JOIN PUBLIC BETA Button */}
                <Card 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 backdrop-blur-md border-4 border-cyan-400 shadow-[0_0_80px_rgba(0,240,255,0.6),inset_0_0_40px_rgba(0,240,255,0.2)] relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-pulse" />
                  <div className="absolute top-2 right-2 font-mono text-xs text-cyan-200 opacity-60">v2.0</div>
                  <div className="absolute top-2 left-2 font-mono text-xs text-cyan-300 opacity-80">STATUS</div>
                  <CardContent className="p-12 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(0,240,255,1)]" style={{ fontStyle: "italic" }}>
                      JOIN PUBLIC BETA
                    </h2>
                  </CardContent>
                </Card>

                {/* LOGIN TO ADMIN PORTAL Button */}
                <Card 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-br from-pink-500/30 to-pink-600/20 backdrop-blur-md border-4 border-pink-400 shadow-[0_0_80px_rgba(255,16,240,0.6),inset_0_0_40px_rgba(255,16,240,0.2)] relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/20 to-transparent animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-2 right-2 font-mono text-xs text-pink-200 opacity-60">SECURE</div>
                  <div className="absolute bottom-2 left-2 font-mono text-xs text-pink-300 opacity-80">ACCESS_GRANTED</div>
                  <div className="absolute bottom-2 right-2 font-mono text-xs text-pink-300 opacity-80">BIO.IMS</div>
                  <CardContent className="p-12 text-center relative z-10">
                    <div className="flex items-center justify-center gap-6">
                      <h2 className="text-5xl md:text-7xl font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(255,16,240,1)]" style={{ fontStyle: "italic" }}>
                        LOGIN TO ADMIN PORTAL
                      </h2>
                      <Lock className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-[0_0_20px_rgba(255,16,240,1)]" />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Auth Form */
              <Card className="bg-black/90 backdrop-blur-sm border-2 border-pink-500/30 shadow-[0_0_60px_rgba(255,16,240,0.3)] relative overflow-hidden">
                {/* Terminal header bar */}
                <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 px-4 py-2 border-b border-pink-500/20 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-pink-500/80 shadow-[0_0_8px_rgba(255,16,240,0.6)]" />
                    <div className="w-3 h-3 rounded-full bg-purple-500/80 shadow-[0_0_8px_rgba(159,0,255,0.6)]" />
                    <div className="w-3 h-3 rounded-full bg-cyan-500/80 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                  </div>
                  <p className="text-pink-300/80 font-mono text-xs flex-1">~/AUTH_TERMINAL.exe</p>
                  <p className="text-cyan-300/60 font-mono text-xs">v2.5.1</p>
                  <button 
                    onClick={() => setShowAuth(false)}
                    className="text-pink-300/60 hover:text-pink-300 transition-colors text-xs"
                  >
                    ✕
                  </button>
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
            )}
          </div>
        </div>

        {/* Bottom status bar */}
        <footer className="mt-12 pt-4 border-t border-cyan-500/20 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-4 text-cyan-300/50">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              DATA_LINK
            </span>
            <span className="h-3 w-px bg-cyan-500/30" />
            <span>DASHBOARD</span>
            <span>ANALYSE</span>
            <span>ACCESS_CONTROLS</span>
          </div>
          <div className="flex items-center gap-4 text-pink-300/50">
            <span>TLC_ARMY</span>
            <span className="h-3 w-px bg-pink-500/30" />
            <span>v2.5.1_HACKER</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
