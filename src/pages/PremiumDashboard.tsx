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
      <header className="surface-raised border-b sticky top-0 z-50 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Places by TLC
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Premium relationship management suite</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/admin")} className="surface-raised">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Premium Tab Navigation */}
          <Card className="surface-raised">
            <CardContent className="p-2">
              <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-2 bg-transparent h-auto p-0">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <TabsTrigger
                      key={feature.id}
                      value={feature.id}
                      className="data-[state=active]:surface-raised data-[state=active]:shadow-md flex-col gap-2 py-4 px-2"
                    >
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                      <span className="text-xs font-medium">{feature.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </CardContent>
          </Card>

          {/* Places Discovery */}
          <TabsContent value="places" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Places Discovery
                </CardTitle>
                <CardDescription>
                  Discover and save amazing places for your next date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EpicSearch onSearch={(query) => console.log(query)} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Recommender */}
          <TabsContent value="ai" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  AI Recommender
                </CardTitle>
                <CardDescription>
                  Get personalized recommendations powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIRecommendations />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Period Tracker */}
          <TabsContent value="tracker" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-success" />
                  Period Tracker for Guys
                </CardTitle>
                <CardDescription>
                  Track and understand your partner's cycle with empathy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PeriodTrackerForGuys />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cartoonifier */}
          <TabsContent value="cartoonify" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-6 w-6 text-primary" />
                  Cartoonifier
                </CardTitle>
                <CardDescription>
                  Transform your photos into beautiful cartoon art
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Cartoonifier</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload photos to transform them into cartoon art
                  </p>
                  <Button onClick={() => navigate("/cartoonifier")}>
                    Open Cartoonifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes */}
          <TabsContent value="quizzes" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-accent" />
                  Relationship Quizzes
                </CardTitle>
                <CardDescription>
                  Discover insights about your relationship and personalities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col gap-2 surface-raised hover:scale-105 transition-transform"
                    onClick={() => navigate("/quizzes/love")}
                  >
                    <Heart className="h-8 w-8 text-accent" />
                    <span className="font-semibold">Love Language</span>
                    <span className="text-xs text-muted-foreground">Discover how you express love</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col gap-2 surface-raised hover:scale-105 transition-transform"
                    onClick={() => navigate("/quizzes/mbti")}
                  >
                    <Sparkles className="h-8 w-8 text-primary" />
                    <span className="font-semibold">MBTI Personality</span>
                    <span className="text-xs text-muted-foreground">Understand your personality</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col gap-2 surface-raised hover:scale-105 transition-transform"
                    onClick={() => navigate("/quizzes/relationship-style")}
                  >
                    <Heart className="h-8 w-8 text-success" />
                    <span className="font-semibold">Relationship Style</span>
                    <span className="text-xs text-muted-foreground">Learn your attachment style</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Couple Mode */}
          <TabsContent value="couple" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-success" />
                  Couple Mode
                </CardTitle>
                <CardDescription>
                  Connect and share with your partner in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Couple Mode</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pair with your partner and share experiences together
                  </p>
                  <Button onClick={() => navigate("/couple-mode")}>
                    Enter Couple Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gamification */}
          <TabsContent value="gamification" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  Gamification & Rewards
                </CardTitle>
                <CardDescription>
                  Earn points and unlock achievements for your activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Gamification System</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track your progress and earn rewards
                  </p>
                  <Button onClick={() => navigate("/gamification")}>
                    View Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Data */}
          <TabsContent value="export" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-6 w-6 text-muted-foreground" />
                  Export & Backup
                </CardTitle>
                <CardDescription>
                  Download your data and code exports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComprehensiveExportSystem />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Panel */}
          <TabsContent value="admin" className="space-y-6 mt-0">
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                  AI Prompt Interface
                </CardTitle>
                <CardDescription>
                  Configure and manage AI prompts for the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIPromptInterface />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Premium Footer */}
      <footer className="surface-raised border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Places by TLC for FeeFee · Premium Edition
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumDashboard;
