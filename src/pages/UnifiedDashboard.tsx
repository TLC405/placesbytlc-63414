import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { MapPin, Image, Heart, Users, Calendar, Brain, Trophy, Download, Sparkles, Search, Loader2, Upload, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Import feature components
import { EpicSearch } from "@/components/EpicSearch";
import { AIRecommendations } from "@/components/AIRecommendations";
import { PeriodTrackerForGuys } from "@/components/PeriodTrackerForGuys";

export default function UnifiedDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const features = [
    { id: "places", icon: MapPin, title: "Places Discovery", description: "Find date spots in Oklahoma City" },
    { id: "cartoonifier", icon: Image, title: "Cartoonifier", description: "Transform images into cartoons" },
    { id: "ai-recommender", icon: Sparkles, title: "AI Recommender", description: "Get personalized date suggestions" },
    { id: "couple-mode", icon: Users, title: "Couple Mode", description: "Share and plan together" },
    { id: "period-tracker", icon: Calendar, title: "Period Tracker", description: "Track cycles for better planning" },
    { id: "quizzes", icon: Brain, title: "Relationship Quizzes", description: "Love language, MBTI, compatibility" },
    { id: "gamification", icon: Trophy, title: "Gamification", description: "Earn points and achievements" },
    { id: "settings", icon: Settings, title: "Settings", description: "Customize your experience" },
  ];

  const filteredFeatures = features.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadSection = async (sectionId: string) => {
    try {
      toast.loading("Preparing export package...");
      
      const { data, error } = await supabase.functions.invoke('export-section', {
        body: { sectionId }
      });

      if (error) throw error;

      toast.success(`${data.message}`);
      
      // Open download URL in new tab
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to prepare export package");
    }
  };

  const handleAIPrompt = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoadingAI(true);
    setAiResponse("");

    try {
      const { data, error } = await supabase.functions.invoke('ai-recommender', {
        body: { 
          prompt: aiPrompt,
          context: "dating app assistant" 
        }
      });

      if (error) throw error;

      setAiResponse(data.response || "No response from AI");
      toast.success("AI suggestion ready!");
    } catch (error) {
      console.error('AI error:', error);
      toast.error("Failed to get AI suggestions");
      setAiResponse("Sorry, I couldn't process that request. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      toast.success("Image uploaded! Ready to cartoonify");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 surface-raised backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center surface-float">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Places by TLC</h1>
                <p className="text-xs text-muted-foreground">All-in-One Dating Companion</p>
              </div>
            </div>
            <Button 
              onClick={downloadAllFiles}
              className="btn-material gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Download All Files
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search Bar */}
        <Card className="surface-raised p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* AI Prompt Interface - Enhanced */}
        <Card className="surface-float p-6 mb-8 border-2 border-primary/20 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-material">
              <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Dating Assistant</h2>
              <p className="text-sm text-muted-foreground">Powered by advanced AI • Always learning your preferences</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: 'Find me romantic restaurants near downtown' or 'What's the best date spot for a first date?' or 'Plan a 3-date sequence from casual to intimate'"
              className="min-h-[120px] resize-none border-2 focus:border-primary transition-all"
              disabled={isLoadingAI}
            />
            
            <Button 
              onClick={handleAIPrompt}
              disabled={isLoadingAI || !aiPrompt.trim()}
              className="btn-material w-full gap-2 h-12 text-lg font-semibold shadow-material hover:shadow-material-hover"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get AI Suggestions
                </>
              )}
            </Button>

            {aiResponse && (
              <Card className="p-4 bg-primary/5 border-2 border-primary/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <p className="font-semibold text-foreground">AI Suggestion:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="surface-raised p-4 cursor-pointer hover:surface-float transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Separator className="my-8" />

        {/* Expandable Feature Sections */}
        <Accordion type="multiple" className="space-y-4">
          {/* Places Discovery */}
          <AccordionItem value="places" className="surface-raised rounded-lg border-0">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Places Discovery</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <EpicSearch onSearch={(query) => toast.info(`Searching for: ${query}`)} />
            </AccordionContent>
          </AccordionItem>

          {/* AI Recommender */}
          <AccordionItem value="ai-recommender" className="surface-raised rounded-lg border-0">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">AI Recommender</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <AIRecommendations />
            </AccordionContent>
          </AccordionItem>

          {/* Period Tracker */}
          <AccordionItem value="period-tracker" className="surface-raised rounded-lg border-0">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Period Tracker</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <PeriodTrackerForGuys />
            </AccordionContent>
          </AccordionItem>

          {/* Cartoonifier - Full Featured */}
          <AccordionItem value="cartoonifier" className="surface-raised rounded-lg border-0 border-l-4 border-l-rose">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose to-mauve flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-lg font-semibold block">TeeFee Me Cartoonifier</span>
                  <span className="text-xs text-muted-foreground">Transform photos into art</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="surface-pressed p-6 space-y-4">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-2 border-dashed border-border relative overflow-hidden">
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drop image or click to upload</p>
                      </div>
                    )}
                  </div>
                  
                  <label className="btn-material w-full cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choose Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </Card>

                <Card className="surface-pressed p-6 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose" />
                    Cartoon Styles
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['Anime', 'Disney', 'Pixar', 'Comic', 'Sketch', '3D'].map((style) => (
                      <Button
                        key={style}
                        variant="outline"
                        className="h-20 flex flex-col gap-2 hover:border-rose hover:bg-rose/5"
                        disabled={!uploadedImage}
                      >
                        <Image className="w-6 h-6" />
                        <span className="text-xs">{style}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full gap-2 bg-gradient-to-r from-rose to-mauve hover:opacity-90"
                    disabled={!uploadedImage}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Cartoonify Now
                  </Button>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Quizzes - Enhanced Cards */}
          <AccordionItem value="quizzes" className="surface-raised rounded-lg border-0 border-l-4 border-l-gold">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-lg font-semibold block">Relationship Quizzes</span>
                  <span className="text-xs text-muted-foreground">Scientifically designed assessments</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="surface-pressed p-6 hover:surface-float transition-all group cursor-pointer border-2 border-transparent hover:border-gold/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose to-rose/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">Love Language</h4>
                  <p className="text-sm text-muted-foreground mb-4">15 questions • 5 min</p>
                  <p className="text-xs text-muted-foreground mb-4">Discover how you give and receive love through words, touch, time, gifts, or service</p>
                  <Button variant="outline" className="btn-material w-full group-hover:bg-rose group-hover:text-white">Start Quiz</Button>
                </Card>

                <Card className="surface-pressed p-6 hover:surface-float transition-all group cursor-pointer border-2 border-transparent hover:border-gold/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">MBTI Personality</h4>
                  <p className="text-sm text-muted-foreground mb-4">30 questions • 10 min</p>
                  <p className="text-xs text-muted-foreground mb-4">Find your personality type and understand your dating patterns and compatibility</p>
                  <Button variant="outline" className="btn-material w-full group-hover:bg-primary group-hover:text-primary-foreground">Start Quiz</Button>
                </Card>

                <Card className="surface-pressed p-6 hover:surface-float transition-all group cursor-pointer border-2 border-transparent hover:border-gold/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mauve to-mauve/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">Attachment Style</h4>
                  <p className="text-sm text-muted-foreground mb-4">20 questions • 7 min</p>
                  <p className="text-xs text-muted-foreground mb-4">Understand if you're secure, anxious, avoidant, or fearful in relationships</p>
                  <Button variant="outline" className="btn-material w-full group-hover:bg-mauve group-hover:text-white">Start Quiz</Button>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Couple Mode - Enhanced */}
          <AccordionItem value="couple-mode" className="surface-raised rounded-lg border-0 border-l-4 border-l-mauve">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mauve to-primary flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-lg font-semibold block">Couple Mode</span>
                  <span className="text-xs text-muted-foreground">Sync with your partner in real-time</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="surface-pressed p-8 text-center border-2 border-mauve/20">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mauve to-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Not Paired Yet</h3>
                  <p className="text-muted-foreground mb-6">Generate a code to invite your partner and start syncing your plans</p>
                  <Button className="btn-material w-full h-12 bg-gradient-to-r from-mauve to-primary hover:opacity-90">
                    Generate Pairing Code
                  </Button>
                </Card>

                <Card className="surface-pressed p-6 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-mauve" />
                    What You'll Get:
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Shared favorites and saved places",
                      "Real-time date planning together",
                      "Synchronized calendar events",
                      "Private chat and notes",
                      "Shared photo albums",
                      "Joint relationship quizzes"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-mauve/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-mauve">{i + 1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Gamification */}
          <AccordionItem value="gamification" className="surface-raised rounded-lg border-0">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Achievements</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Explorer", desc: "Visit 10 places", icon: "🗺️" },
                  { name: "Romantic", desc: "Create 5 dates", icon: "💕" },
                  { name: "Quiz Master", desc: "Complete all quizzes", icon: "🧠" },
                  { name: "Connector", desc: "Use couple mode", icon: "👫" },
                ].map((achievement) => (
                  <Card key={achievement.name} className="surface-pressed p-4 text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-sm">{achievement.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.desc}</p>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Download Section - Full Export System */}
        <Card className="surface-float p-8 mt-8 border-2 border-primary/20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Download className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold">Export Everything</h2>
              <p className="text-muted-foreground">Download all app files, components, and data</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => downloadSection('places')}
              className="btn-material h-24 flex flex-col gap-2 hover:scale-105 transition-transform" 
              variant="outline"
            >
              <MapPin className="w-8 h-8" />
              <span className="font-bold">Places Module</span>
              <span className="text-xs text-muted-foreground">Google Maps integration</span>
            </Button>
            
            <Button 
              onClick={() => downloadSection('teefeeme')}
              className="btn-material h-24 flex flex-col gap-2 hover:scale-105 transition-transform" 
              variant="outline"
            >
              <Image className="w-8 h-8" />
              <span className="font-bold">Cartoonifier</span>
              <span className="text-xs text-muted-foreground">AI image processing</span>
            </Button>
            
            <Button 
              onClick={() => downloadSection('admin')}
              className="btn-material h-24 flex flex-col gap-2 hover:scale-105 transition-transform" 
              variant="outline"
            >
              <Trophy className="w-8 h-8" />
              <span className="font-bold">Admin Panel</span>
              <span className="text-xs text-muted-foreground">Analytics & settings</span>
            </Button>
            
            <Button 
              onClick={() => downloadSection('complete')}
              className="btn-material h-24 flex flex-col gap-2 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground hover:opacity-90 hover:scale-105 transition-all" 
            >
              <Download className="w-8 h-8" />
              <span className="font-bold">Complete App</span>
              <span className="text-xs">All features + docs</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
