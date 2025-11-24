import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Sparkles, Calendar, Image, Heart, Trophy, Settings, Download, MessageSquare } from "lucide-react";
import { EpicSearch } from "@/components/EpicSearch";
import { AIRecommendations } from "@/components/AIRecommendations";
import { PeriodTrackerForGuys } from "@/components/PeriodTrackerForGuys";
import { useNavigate } from "react-router-dom";
import ComprehensiveExportSystem from "@/components/admin/ComprehensiveExportSystem";
import { AIPromptInterface } from "@/components/admin/AIPromptInterface";

const PremiumDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("places");

  const features = [
    { id: "places", label: "Places Discovery", icon: MapPin, color: "text-primary" },
    { id: "ai", label: "AI Recommender", icon: Sparkles, color: "text-accent" },
    { id: "tracker", label: "Period Tracker", icon: Calendar, color: "text-success" },
    { id: "cartoonify", label: "Cartoonifier", icon: Image, color: "text-primary" },
    { id: "quizzes", label: "Quizzes", icon: Heart, color: "text-accent" },
    { id: "couple", label: "Couple Mode", icon: MessageSquare, color: "text-success" },
    { id: "gamification", label: "Gamification", icon: Trophy, color: "text-primary" },
    { id: "export", label: "Export Data", icon: Download, color: "text-muted-foreground" },
    { id: "admin", label: "Admin Panel", icon: Settings, color: "text-muted-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <header className="surface-raised border-b sticky top-0 z-50 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
                Places by TLC
              </h1>
              <p className="text-sm text-muted-foreground mt-2 tracking-wide">Premium relationship management suite</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin")} 
                className="surface-raised hover:scale-105 transition-all"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Premium Tab Navigation */}
          <Card className="surface-raised shadow-lg">
            <CardContent className="p-4">
              <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-3 bg-transparent h-auto p-0">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <TabsTrigger
                      key={feature.id}
                      value={feature.id}
                      className="data-[state=active]:surface-raised data-[state=active]:shadow-lg data-[state=active]:scale-105 flex-col gap-3 py-6 px-3 transition-all duration-200 hover:scale-102"
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                      <span className="text-xs font-semibold">{feature.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </CardContent>
          </Card>

          {/* Places Discovery */}
          <TabsContent value="places" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MapPin className="h-7 w-7 text-primary" />
                  Places Discovery
                </CardTitle>
                <CardDescription className="text-base">
                  Discover and save amazing places for your next date
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <EpicSearch onSearch={(query) => console.log(query)} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Recommender */}
          <TabsContent value="ai" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Sparkles className="h-7 w-7 text-accent" />
                  AI Recommender
                </CardTitle>
                <CardDescription className="text-base">
                  Get personalized recommendations powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <AIRecommendations />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Period Tracker */}
          <TabsContent value="tracker" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Calendar className="h-7 w-7 text-success" />
                  Period Tracker for Guys
                </CardTitle>
                <CardDescription className="text-base">
                  Track and understand your partner's cycle with empathy
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <PeriodTrackerForGuys />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cartoonifier */}
          <TabsContent value="cartoonify" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Image className="h-7 w-7 text-primary" />
                  Cartoonifier
                </CardTitle>
                <CardDescription className="text-base">
                  Transform your photos into beautiful cartoon art
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Cartoonifier</h3>
                  <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                    Upload photos to transform them into stunning cartoon art
                  </p>
                  <Button onClick={() => navigate("/cartoonifier")} size="lg" className="shadow-lg">
                    Open Cartoonifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes */}
          <TabsContent value="quizzes" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Heart className="h-7 w-7 text-accent" />
                  Relationship Quizzes
                </CardTitle>
                <CardDescription className="text-base">
                  Discover insights about your relationship and personalities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid gap-6 md:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-40 flex flex-col gap-3 surface-raised hover:scale-105 hover:shadow-xl transition-all duration-200"
                    onClick={() => navigate("/quizzes/love")}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                      <Heart className="h-9 w-9 text-accent" />
                    </div>
                    <span className="font-semibold text-base">Love Language</span>
                    <span className="text-sm text-muted-foreground">Discover how you express love</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-40 flex flex-col gap-3 surface-raised hover:scale-105 hover:shadow-xl transition-all duration-200"
                    onClick={() => navigate("/quizzes/mbti")}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                      <Sparkles className="h-9 w-9 text-primary" />
                    </div>
                    <span className="font-semibold text-base">MBTI Personality</span>
                    <span className="text-sm text-muted-foreground">Understand your personality</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-40 flex flex-col gap-3 surface-raised hover:scale-105 hover:shadow-xl transition-all duration-200"
                    onClick={() => navigate("/quizzes/relationship-style")}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
                      <Heart className="h-9 w-9 text-success" />
                    </div>
                    <span className="font-semibold text-base">Relationship Style</span>
                    <span className="text-sm text-muted-foreground">Learn your attachment style</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Couple Mode */}
          <TabsContent value="couple" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MessageSquare className="h-7 w-7 text-success" />
                  Couple Mode
                </CardTitle>
                <CardDescription className="text-base">
                  Connect and share with your partner in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 mb-6">
                    <MessageSquare className="h-12 w-12 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Couple Mode</h3>
                  <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                    Pair with your partner and share experiences together
                  </p>
                  <Button onClick={() => navigate("/couple-mode")} size="lg" className="shadow-lg">
                    Enter Couple Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gamification */}
          <TabsContent value="gamification" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Trophy className="h-7 w-7 text-primary" />
                  Gamification & Rewards
                </CardTitle>
                <CardDescription className="text-base">
                  Earn points and unlock achievements for your activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                    <Trophy className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Gamification System</h3>
                  <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                    Track your progress and earn rewards
                  </p>
                  <Button onClick={() => navigate("/gamification")} size="lg" className="shadow-lg">
                    View Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Data */}
          <TabsContent value="export" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Download className="h-7 w-7 text-muted-foreground" />
                  Export & Backup
                </CardTitle>
                <CardDescription className="text-base">
                  Download your data and code exports
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ComprehensiveExportSystem />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Panel */}
          <TabsContent value="admin" className="space-y-6 mt-0 animate-fade-in">
            <Card className="surface-raised shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Settings className="h-7 w-7 text-muted-foreground" />
                  AI Prompt Interface
                </CardTitle>
                <CardDescription className="text-base">
                  Configure and manage AI prompts for the application
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <AIPromptInterface />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Premium Footer */}
      <footer className="surface-raised border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground tracking-wide">
            Places by TLC for FeeFee · Premium Edition · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumDashboard;
