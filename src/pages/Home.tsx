import { useState, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Palette, Sparkles, Heart, Flower2, Bot, 
  Crown, LogOut, Menu, X, Upload, Download, RefreshCw, Send,
  Calendar, Users, Brain, Home as HomeIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { trackPlaceView, trackPlaceSave, trackSearch } from "@/components/ActivityTracker";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { Progress } from "@/components/ui/progress";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = { role: 'user' | 'assistant'; content: string };

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Places Search State
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047");
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<"food" | "activity" | "both">("both");
  const { location } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => setError(message),
  });

  // Cartoonifier State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Recommender State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Couple Mode State
  const [pairingCode, setPairingCode] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  // Places Search Handlers
  const handleAddToPlan = useCallback((place: PlaceItem) => {
    const existing = storage.getPlan();
    if (existing.some((p) => p.id === place.id)) {
      toast.info("Already in your plan!");
      return;
    }
    storage.addToPlan(place);
    trackPlaceSave(place);
    toast.success(`${place.name} added to plan!`);
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories([category]);
  }, []);

  const handleSearch = useCallback(() => {
    if (!categoryType || categoryType === "both" && !query.trim() && selectedCategories.length === 0) {
      toast.error("Pick Food, Activity, or Both first! 👆");
      return;
    }
    if (!location) {
      toast.error("Location not available. Please enable location services.");
      return;
    }
    const searchQuery = selectedCategories.length > 0 ? selectedCategories[0] : categoryType;
    if (!searchQuery) {
      toast.info("Enter a search term or select categories!");
      return;
    }
    setError("");
    search(searchQuery, location, parseInt(radius, 10));
    trackSearch(searchQuery, { radius, location, categoryType });
  }, [query, selectedCategories, location, radius, search, categoryType]);

  // Cartoonifier Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setCartoonImage(null);
      setProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const generateCartoon = async () => {
    if (!originalImage) return;
    setProcessing(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    try {
      const base64Data = originalImage.split(",")[1];
      const { data, error } = await supabase.functions.invoke("teefeeme-cartoonify", {
        body: { image: base64Data },
      });
      clearInterval(progressInterval);
      if (error) throw error;
      if (data?.cartoonImage) {
        setProgress(100);
        setCartoonImage(`data:image/png;base64,${data.cartoonImage}`);
        toast.success("🎨 Cartoon Generated!");
      } else {
        throw new Error("No cartoon image returned");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setProgress(0);
      toast.error("Generation Failed: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const downloadCartoon = () => {
    if (!cartoonImage) return;
    const link = document.createElement("a");
    link.href = cartoonImage;
    link.download = `tlc-cartoon-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  const resetCartoonifier = () => {
    setOriginalImage(null);
    setCartoonImage(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // AI Recommender Handler
  const handleGetRecommendations = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe what you're looking for!");
      return;
    }
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRecommendations([
        "The Mule - Rooftop bar with stunning city views",
        "Paseo Arts District - Walk through galleries",
        "Scissortail Park - Romantic evening stroll",
        "Vast - Upscale dining on the 49th floor",
        "Factory Obscura - Interactive art experience"
      ]);
      toast.success("Got your recommendations!");
    } catch (error) {
      toast.error("Failed to get recommendations");
    } finally {
      setAiLoading(false);
    }
  };

  // Couple Mode Handlers
  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPairingCode(code);
    toast.success("Share this code with your partner!");
  };

  const handlePair = () => {
    if (!pairingCode.trim()) {
      toast.error("Please enter a pairing code!");
      return;
    }
    setIsPaired(true);
    toast.success("Successfully paired! 💑");
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMessage: Message = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('couple-mode-chat', {
        body: { messages: [...messages, userMessage] }
      });
      if (error) throw error;
      const aiMessage: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error(error.message || "Failed to get AI response");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* HEADER */}
      <header className="border-b border-primary/20 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl sm:text-2xl font-black gradient-text">
                  TLC PLACES HUB
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  All Features in One Place
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <DarkModeToggle />
              {user && (
                <span className="text-sm text-muted-foreground px-3 py-1 rounded-lg bg-primary/5">
                  {user.email}
                </span>
              )}
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-primary/30">
                  <Crown className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
              {user && (
                <Button onClick={handleSignOut} variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-primary/20 space-y-2">
              <DarkModeToggle />
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Crown className="w-4 h-4 mr-2" />Admin Panel</Button>
              </Link>
              {user && (
                <Button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} variant="ghost" size="sm" className="w-full justify-start">
                  <LogOut className="w-4 h-4 mr-2" />Sign Out</Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="places" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-xl">
            <TabsTrigger value="places" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-lg">
              <MapPin className="w-4 h-4 mr-2" />Places
            </TabsTrigger>
            <TabsTrigger value="cartoonifier" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              <Palette className="w-4 h-4 mr-2" />Cartoonify
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg">
              <Bot className="w-4 h-4 mr-2" />AI Cupid
            </TabsTrigger>
            <TabsTrigger value="couple" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              <Heart className="w-4 h-4 mr-2" />Couple
            </TabsTrigger>
            <TabsTrigger value="period" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-rose-400 data-[state=active]:text-white rounded-lg" onClick={() => navigate('/period-tracker')}>
              <Flower2 className="w-4 h-4 mr-2" />Period
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg" onClick={() => navigate('/quizzes')}>
              <Sparkles className="w-4 h-4 mr-2" />Quizzes
            </TabsTrigger>
          </TabsList>

          {/* PLACES TAB */}
          <TabsContent value="places" className="space-y-6 mt-6">
            <Card className="border-2 border-primary/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Search Perfect Date Spots
                </CardTitle>
                <CardDescription>Find restaurants, activities, and more near you</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchBar
                  query={query}
                  radius={radius}
                  onQueryChange={setQuery}
                  onRadiusChange={setRadius}
                  onSearch={handleSearch}
                  disabled={false}
                  loading={isSearching}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  categoryType={categoryType}
                  onCategoryTypeChange={setCategoryType}
                  onLocationModeChange={(mode) => toast.success(`Searching from ${mode}!`)}
                />
              </CardContent>
            </Card>
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{results.length} Places Found 🎉</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((place) => (
                    <PlaceCard key={place.id} place={place} onAdd={handleAddToPlan} onView={() => trackPlaceView(place)} />
                  ))}
                </div>
              </div>
            )}
            {results.length === 0 && !isSearching && (
              <EmptyState icon={Heart} title="Start Your Search" description="Choose your preferences and discover amazing spots" />
            )}
          </TabsContent>

          {/* CARTOONIFIER TAB */}
          <TabsContent value="cartoonifier" className="space-y-6 mt-6">
            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Palette className="w-6 h-6 text-primary" />
                  Transform Photos into Cartoons
                </CardTitle>
                <CardDescription>Upload a photo and make it cute!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Upload className="w-5 h-5" />Upload Photo</h3>
                    <div className="aspect-square rounded-xl border-2 border-dashed border-primary/30 hover:border-primary flex items-center justify-center overflow-hidden cursor-pointer bg-card" onClick={() => fileInputRef.current?.click()}>
                      {originalImage ? (
                        <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center"><Upload className="w-16 h-16 text-primary mx-auto mb-2" /><p>Tap to upload 📸</p></div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5" />Cartoon Result</h3>
                    <div className="aspect-square rounded-xl border-2 border-primary/30 bg-card flex items-center justify-center overflow-hidden">
                      {cartoonImage ? (
                        <img src={cartoonImage} alt="Cartoon" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center"><Sparkles className="w-16 h-16 text-primary mx-auto mb-2" /><p>Your cartoon appears here 🎨</p></div>
                      )}
                    </div>
                  </div>
                </div>
                {processing && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm"><span>Creating magic...</span><span>{progress}%</span></div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={generateCartoon} disabled={!originalImage || processing} className="bg-gradient-to-r from-pink-500 to-purple-500">
                    {processing ? "Cartoonifying..." : <><Heart className="w-5 h-5 mr-2" />Make It Cute!</>}
                  </Button>
                  {cartoonImage && (
                    <Button onClick={downloadCartoon} variant="outline"><Download className="w-5 h-5 mr-2" />Download</Button>
                  )}
                  {(originalImage || cartoonImage) && (
                    <Button onClick={resetCartoonifier} variant="outline"><RefreshCw className="w-5 h-5 mr-2" />Reset</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI RECOMMENDER TAB */}
          <TabsContent value="ai" className="space-y-6 mt-6">
            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Bot className="w-6 h-6 text-primary" />AI Date Recommender</CardTitle>
                <CardDescription>Get personalized suggestions from AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Example: Looking for a romantic dinner under $100..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="min-h-[120px]" />
                <Button onClick={handleGetRecommendations} disabled={aiLoading} className="w-full bg-gradient-to-r from-violet-500 to-purple-500">
                  {aiLoading ? "Getting Recommendations..." : <><Send className="w-5 h-5 mr-2" />Get AI Recommendations</>}
                </Button>
                {recommendations.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className="font-bold text-lg">Your Recommendations:</h3>
                    {recommendations.map((rec, i) => (
                      <div key={i} className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <Badge className="mb-2">{i + 1}</Badge>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* COUPLE MODE TAB */}
          <TabsContent value="couple" className="space-y-6 mt-6">
            {!isPaired ? (
              <Card className="border-2 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2"><Users className="w-6 h-6 text-primary" />Connect with Your Partner</CardTitle>
                  <CardDescription>Generate or enter a pairing code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-bold">Generate Code</h3>
                      <Button onClick={generateCode} className="w-full"><Heart className="w-5 h-5 mr-2" />Generate Code</Button>
                      {pairingCode && (
                        <div className="p-6 bg-primary/10 rounded-xl text-center">
                          <p className="text-sm text-muted-foreground mb-2">Your Code:</p>
                          <p className="text-4xl font-black">{pairingCode}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold">Enter Partner's Code</h3>
                      <Input placeholder="Enter 6-digit code" value={pairingCode} onChange={(e) => setPairingCode(e.target.value.toUpperCase())} maxLength={6} className="text-center text-xl" />
                      <Button onClick={handlePair} variant="outline" className="w-full">Pair Accounts</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2"><Users className="w-6 h-6 text-primary" />You're Connected! 💑</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="mb-4">Couple Mode Active</Badge>
                  <p className="text-muted-foreground">Full features coming soon!</p>
                </CardContent>
              </Card>
            )}
            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="w-6 h-6 text-primary" />AI Dating Assistant</CardTitle>
                <CardDescription>Get date ideas and relationship advice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 rounded-lg border p-4 bg-card">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Sparkles className="w-12 h-12 mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Ask me for date ideas or advice!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent/20'}`}>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isChatLoading && <div className="flex justify-start"><div className="bg-accent/20 rounded-lg p-3"><p className="text-sm">Thinking... 💭</p></div></div>}
                    </div>
                  )}
                </ScrollArea>
                <div className="flex gap-2">
                  <Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} placeholder="Ask for date ideas..." className="min-h-[60px]" disabled={isChatLoading} />
                  <Button onClick={handleSendMessage} disabled={!chatInput.trim() || isChatLoading}><Send className="w-5 h-5" /></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}