import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MapPin, Image, Heart, Users, Calendar, Brain, Trophy, Settings, Download, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";

// Import feature components
import { EpicSearch } from "@/components/EpicSearch";
import { AIRecommendations } from "@/components/AIRecommendations";
import { PeriodTrackerForGuys } from "@/components/PeriodTrackerForGuys";

export default function UnifiedDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

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

  const downloadAllFiles = () => {
    toast.success("Preparing download package...");
    // Trigger download logic here
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

        {/* AI Prompt Interface */}
        <Card className="surface-float p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Ask anything about the app or get recommendations</p>
            </div>
          </div>
          <Textarea 
            placeholder="Example: 'Find me romantic restaurants near downtown' or 'What's the best date spot for a first date?'"
            className="min-h-[100px] mb-3"
          />
          <Button className="btn-material w-full gap-2">
            <Sparkles className="w-4 h-4" />
            Get AI Suggestions
          </Button>
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

          {/* Cartoonifier Placeholder */}
          <AccordionItem value="cartoonifier" className="surface-raised rounded-lg border-0">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Cartoonifier</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Card className="surface-pressed p-8 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Transform Your Photos</h3>
                <p className="text-muted-foreground mb-4">Upload an image to cartoonify</p>
                <Button className="btn-material">Upload Image</Button>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Quizzes */}
          <AccordionItem value="quizzes" className="surface-raised rounded-lg border-0">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Relationship Quizzes</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid gap-4">
                <Card className="surface-pressed p-4">
                  <h4 className="font-semibold mb-2">Love Language Quiz</h4>
                  <p className="text-sm text-muted-foreground mb-3">Discover how you give and receive love</p>
                  <Button variant="outline" className="btn-material w-full">Start Quiz</Button>
                </Card>
                <Card className="surface-pressed p-4">
                  <h4 className="font-semibold mb-2">MBTI Personality</h4>
                  <p className="text-sm text-muted-foreground mb-3">Find your personality type</p>
                  <Button variant="outline" className="btn-material w-full">Start Quiz</Button>
                </Card>
                <Card className="surface-pressed p-4">
                  <h4 className="font-semibold mb-2">Relationship Style</h4>
                  <p className="text-sm text-muted-foreground mb-3">Understand your attachment style</p>
                  <Button variant="outline" className="btn-material w-full">Start Quiz</Button>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Couple Mode */}
          <AccordionItem value="couple-mode" className="surface-raised rounded-lg border-0">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Couple Mode</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Card className="surface-pressed p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Connect With Your Partner</h3>
                <p className="text-muted-foreground mb-4">Share places, plans, and track together</p>
                <Button className="btn-material">Generate Pairing Code</Button>
              </Card>
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

        {/* Download Section */}
        <Card className="surface-float p-8 mt-8 text-center">
          <Download className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Export Everything</h2>
          <p className="text-muted-foreground mb-6">Download all app files, components, and data</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-material" variant="outline">
              Download Source Code
            </Button>
            <Button className="btn-material" variant="outline">
              Export User Data
            </Button>
            <Button className="btn-material" variant="outline">
              Download Assets
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
