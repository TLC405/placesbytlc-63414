import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { MapPin, User, MessageSquare, Filter, Heart, Sparkles, Calendar, LogOut, Menu, X, ImageIcon, Upload, Download, RefreshCw, Wand2, Users, Link as LinkIcon, Crown, BarChart3, Brain, AlertTriangle, Laugh, Terminal, Activity, Code2, Shield } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobalTabs, GlobalTab } from "@/components/GlobalTabs";
import { AppLogo } from "@/components/AppLogo";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { ThemeSelector } from "@/components/ThemeSelector";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceDetailsModal } from "@/components/PlaceDetailsModal";
import { PlacesEmptyState } from "@/components/PlacesEmptyState";
import { PlacesLoadingSkeleton } from "@/components/PlacesLoadingSkeleton";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { AIRecommendations } from "@/components/AIRecommendations";
import { YouTubeLoadingScreen } from "@/components/YouTubeLoadingScreen";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AdminPanel from "@/pages/AdminPanel";
import { PlaceItem } from "@/types";

type Message = { role: 'user' | 'assistant'; content: string };

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasRole } = useUserRole();
  const [showInitialLoading, setShowInitialLoading] = useState(true);

  // Places state
  const { location } = useGeolocation();
  const { results: places, isSearching, search: searchPlaces } = usePlacesSearch({ onError: (msg) => toast.error(msg) });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  // Cartoonifier state
  const [cartoonFile, setCartoonFile] = useState<File | null>(null);
  const [cartoonPreview, setCartoonPreview] = useState<string>("");
  const [cartoonResult, setCartoonResult] = useState<string>("");
  const [isCartoonifying, setIsCartoonifying] = useState(false);
  const [cartoonStyle, setCartoonStyle] = useState("simpsons");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Couple Mode state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [pairingCode, setPairingCode] = useState("");

  // Period Tracker state
  const [periodDate, setPeriodDate] = useState("");
  const [guyPhone, setGuyPhone] = useState("");
  const [guyName, setGuyName] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [isPeriodTrackerLoading, setIsPeriodTrackerLoading] = useState(false);

  // Initial loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  // Places handlers
  const handleSearch = async (query: string) => {
    if (!location) {
      toast.error("Location not available");
      return;
    }
    await searchPlaces(query, location, 8047);
  };

  const handleAddToPlan = (place: PlaceItem) => {
    toast.success(`${place.name} added to plan!`);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Cartoonifier handlers
  const handleCartoonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCartoonFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setCartoonPreview(e.target?.result as string);
      setCartoonResult("");
    };
    reader.readAsDataURL(file);
  };

  const handleCartoonGenerate = async () => {
    if (!cartoonFile) {
      toast.error("Please upload an image first!");
      return;
    }
    
    setIsCartoonifying(true);
    
    try {
      const formData = new FormData();
      formData.append('image', cartoonFile);
      formData.append('style', cartoonStyle);
      
      const { data, error } = await supabase.functions.invoke('teefeeme-cartoonify', {
        body: formData
      });

      if (error) throw error;
      
      if (data.cartoonUrl) {
        setCartoonResult(data.cartoonUrl);
        toast.success(`✨ Image transformed to ${cartoonStyle} style!`);
      }
    } catch (error: any) {
      console.error('Cartoon error:', error);
      toast.error("Failed to cartoonify image. Please try again!");
    } finally {
      setIsCartoonifying(false);
    }
  };

  const handleCartoonDownload = () => {
    if (!cartoonResult) return;
    const link = document.createElement('a');
    link.href = cartoonResult;
    link.download = `tlc-cartoon-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  const handleCartoonReset = () => {
    setCartoonFile(null);
    setCartoonPreview("");
    setCartoonResult("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Couple Mode handlers
  const handleGeneratePairingCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPairingCode(code);
    toast.success("Share this code with your partner!");
  };

  const handlePairAccounts = () => {
    if (!pairingCode) {
      toast.error("Please enter a pairing code");
      return;
    }
    toast.success("Accounts paired successfully! 💑");
  };

  const handleChatSend = async () => {
    if (!chatMessage.trim()) return;
    
    const userMessage: Message = { role: 'user', content: chatMessage };
    setMessages(prev => [...prev, userMessage]);
    setChatMessage("");
    
    try {
      const { data, error } = await supabase.functions.invoke('couple-mode-chat', {
        body: { messages: [...messages, userMessage] }
      });
      
      if (error) throw error;
      
      const aiMessage: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error("Failed to send message");
    }
  };

  // Period Tracker handler
  const handlePeriodTrackerSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!periodDate || !guyPhone || !guyName) {
      toast.error("Fill out all fields!");
      return;
    }

    let cleanPhone = guyPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '1' + cleanPhone;
    }
    
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('1')) {
      toast.error("Please enter a valid 10-digit US phone number");
      return;
    }

    setIsPeriodTrackerLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('period-tracker-setup', {
        body: {
          guyName,
          guyPhone: '+' + cleanPhone,
          periodDate,
          cycleLength: parseInt(cycleLength),
          spamMode: false,
          dryRun: false
        }
      });

      if (error) throw error;

      toast.success(`🎯 ${guyName} will get survival texts! 💝`);
      
      // Reset form
      setGuyName("");
      setGuyPhone("");
      setPeriodDate("");
      setCycleLength("28");
    } catch (error: any) {
      console.error('Period tracker setup error:', error);
      toast.error(error.message || "Failed to set up tracker");
    } finally {
      setIsPeriodTrackerLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (showInitialLoading) {
    return <YouTubeLoadingScreen brandText="TLC" />;
  }

  // Define all tabs
  const tabs: GlobalTab[] = [
    {
      id: "places",
      label: "Places",
      icon: <MapPin className="w-4 h-4" />,
      component: (
        <div className="space-y-6">
          <SearchBar 
            query=""
            radius="8047"
            onQueryChange={() => {}}
            onRadiusChange={() => {}}
            onSearch={() => handleSearch("")}
            disabled={false}
            loading={isSearching}
          />

          {isSearching && <PlacesLoadingSkeleton />}
          
          {!isSearching && places.length === 0 && <PlacesEmptyState />}
          
          {!isSearching && places.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onAdd={() => handleAddToPlan(place)}
                  onView={() => setSelectedPlace(place)}
                />
              ))}
            </div>
          )}

          {selectedPlace && (
            <PlaceDetailsModal
              place={selectedPlace}
              open={!!selectedPlace}
              onOpenChange={() => setSelectedPlace(null)}
              onAddToPlan={() => handleAddToPlan(selectedPlace)}
            />
          )}
        </div>
      )
    },
    {
      id: "cartoonifier",
      label: "Cartoonifier",
      icon: <ImageIcon className="w-4 h-4" />,
      component: (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-glow border-2 border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">AI Photo Cartoonifier</CardTitle>
                  <CardDescription>Transform photos into cartoon art</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isCartoonifying && (
                <div className="py-20">
                  <YouTubeLoadingScreen brandText="TRANSFORMING" />
                </div>
              )}
              
              {!isCartoonifying && !cartoonResult && (
                <>
                  <div className="space-y-4">
                    <Label>Choose Style</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['simpsons', 'pixar', 'anime', 'comic'].map((style) => (
                        <Button
                          key={style}
                          variant={cartoonStyle === style ? "default" : "outline"}
                          onClick={() => setCartoonStyle(style)}
                          className="capitalize"
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center space-y-4 bg-primary/5">
                    <Upload className="w-12 h-12 mx-auto text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">Upload Photo</h3>
                      <p className="text-sm text-muted-foreground">Choose an image to transform</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCartoonUpload}
                      className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Select Image
                    </Button>
                  </div>

                  {cartoonPreview && (
                    <div className="space-y-4">
                      <img src={cartoonPreview} alt="Preview" className="w-full rounded-xl shadow-lg" />
                      <Button onClick={handleCartoonGenerate} className="w-full h-14 text-lg">
                        <Wand2 className="w-5 h-5 mr-2" />
                        Cartoonify ({cartoonStyle})
                      </Button>
                    </div>
                  )}
                </>
              )}

              {!isCartoonifying && cartoonResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Original</p>
                      <img src={cartoonPreview} alt="Original" className="w-full rounded-xl shadow-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Cartoonified ({cartoonStyle})</p>
                      <img src={cartoonResult} alt="Result" className="w-full rounded-xl shadow-lg" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleCartoonDownload} variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleCartoonReset} variant="outline" className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "ai-cupid",
      label: "AI Cupid",
      icon: <Sparkles className="w-4 h-4" />,
      component: (
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-glow border-2 border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="w-10 h-10 text-primary" />
                <div>
                  <CardTitle className="text-2xl">AI Date Recommender</CardTitle>
                  <CardDescription>Get personalized date ideas powered by AI</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AIRecommendations />
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "couple-mode",
      label: "Couple Mode",
      icon: <Users className="w-4 h-4" />,
      component: (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-glow border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Couple Mode
              </CardTitle>
              <CardDescription>Connect accounts and chat with your AI cupid</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={handleGeneratePairingCode} className="h-20 text-lg">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Generate Pairing Code
                </Button>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter partner's code"
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value)}
                    className="h-12"
                  />
                  <Button onClick={handlePairAccounts} className="w-full h-12">
                    Connect Accounts
                  </Button>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-lg">Cupid Chat</h3>
                <div className="space-y-3 h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask Cupid anything..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  />
                  <Button onClick={handleChatSend}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "period-tracker",
      label: "Period Tracker",
      icon: <Calendar className="w-4 h-4" />,
      component: (
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-glow border-2 border-primary/30">
            <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_100%]" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-10 h-10 text-primary" />
                <Laugh className="w-10 h-10 text-accent" />
                <div>
                  <CardTitle className="text-2xl">Peripod Tracker for Him</CardTitle>
                  <CardDescription>Because he will forget. Save him. Save yourself.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 p-5 bg-primary/5 border-2 border-primary/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-base font-bold">Ladies: Set it and forget it 💅</p>
                  <p className="text-sm text-muted-foreground">Your man will get automated SMS reminders sent directly to his phone.</p>
                </div>
              </div>

              <form onSubmit={handlePeriodTrackerSetup} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guyName">His Name</Label>
                    <Input
                      id="guyName"
                      value={guyName}
                      onChange={(e) => setGuyName(e.target.value)}
                      placeholder="e.g., Marcus, Babe"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guyPhone">His Phone Number *</Label>
                    <Input
                      id="guyPhone"
                      type="tel"
                      value={guyPhone}
                      onChange={(e) => setGuyPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodDate">Next Period Start Date *</Label>
                    <Input
                      id="periodDate"
                      type="date"
                      value={periodDate}
                      onChange={(e) => setPeriodDate(e.target.value)}
                      className="h-12"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength">Cycle Length (days)</Label>
                    <Input
                      id="cycleLength"
                      type="number"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(e.target.value)}
                      placeholder="28"
                      className="h-12"
                      min="21"
                      max="35"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPeriodTrackerLoading}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-accent"
                >
                  {isPeriodTrackerLoading ? "Setting Up..." : "Activate His Survival Mode"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: <Brain className="w-4 h-4" />,
      component: (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Epic Couple Quizzes
            </h1>
            <p className="text-xl text-muted-foreground">Discover what makes your connection special</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-glow transition-all border-2 border-primary/20 cursor-pointer" onClick={() => navigate('/quiz/love')}>
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Love Language</CardTitle>
                <CardDescription>Discover how you express and receive love</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Quiz</Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all border-2 border-primary/20 cursor-pointer" onClick={() => navigate('/quiz/mbti')}>
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Personality Type</CardTitle>
                <CardDescription>Understand your unique personality traits</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Quiz</Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all border-2 border-primary/20 cursor-pointer" onClick={() => navigate('/quiz/relationship-style')}>
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Relationship Style</CardTitle>
                <CardDescription>Learn your approach to relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Quiz</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  // Add admin tab conditionally
  if (hasRole('admin')) {
    tabs.push({
      id: "admin",
      label: "Admin",
      icon: <Crown className="w-4 h-4" />,
      component: <AdminPanel />
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <AppLogo />
              <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              <ThemeSelector />
              <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <GlobalTabs tabs={tabs} />
      </main>
    </div>
  );
}
