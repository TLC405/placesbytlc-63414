import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Heart, Link as LinkIcon, Calendar, Star, Brain, Sparkles, Send, Bot, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTesterCheck } from "@/hooks/useTesterCheck";
import { CupidTutorial } from "@/components/CupidTutorial";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Message = { role: 'user' | 'assistant'; content: string };

export default function CoupleMode() {
  useTesterCheck();
  const navigate = useNavigate();
  const [pairingCode, setPairingCode] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const tutorialSteps = [
    "Hey there, lovebirds! Welcome to Couple Mode!",
    "This is where you can take fun quizzes together to learn more about each other.",
    "Discover your love languages, personality types, and what makes you both tick!",
    "Ready to dive in? Click on the Quizzes section below to get started!",
  ];

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
    toast.success("Successfully paired!");
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isAiLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsAiLoading(true);

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
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="surface-raised border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                  Couple Mode
                </h1>
                <p className="text-sm text-muted-foreground">Plan dates together with shared features</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl space-y-8">
        {!isPaired ? (
          <>
            {/* Pairing Section */}
            <Card className="surface-raised shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  Connect with Your Partner
                </CardTitle>
                <CardDescription>
                  Generate a code or enter your partner's code to link accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Generate Code</h3>
                    <Button onClick={generateCode} className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      Generate Pairing Code
                    </Button>
                    {pairingCode && (
                      <div className="p-4 bg-primary/5 rounded-lg border text-center">
                        <p className="text-sm text-muted-foreground mb-2">Your Code:</p>
                        <p className="text-3xl font-bold text-primary tracking-wider">{pairingCode}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Enter Partner's Code</h3>
                    <Input
                      placeholder="Enter 6-digit code"
                      value={pairingCode}
                      onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                      className="text-center text-xl font-bold tracking-wider"
                      maxLength={6}
                    />
                    <Button onClick={handlePair} variant="outline" className="w-full">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Pair Accounts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-primary/5 border">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Shared Calendar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Plan dates together and see each other's availability
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-accent/5 border">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-accent" />
                    Shared Wishlist
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Save places you both want to try and mark them as visited
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-success/5 border">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    <Star className="w-4 h-4 text-success" />
                    Shared Notes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add memories and notes to each place you visit together
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Chat Assistant */}
            <Card className="surface-raised shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Dating Assistant
                </CardTitle>
                <CardDescription>
                  Get creative date ideas and relationship advice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full rounded-lg border p-4 bg-muted/30">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Sparkles className="w-10 h-10 mb-2 text-primary" />
                      <p className="text-sm">Ask me for date ideas, relationship advice, or recommendations!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isAiLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">Thinking...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask for date ideas, relationship advice..."
                    className="min-h-[80px] resize-none"
                    disabled={isAiLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isAiLoading}
                    className="h-[80px]"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quizzes Section */}
            <Card className="surface-raised">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Couple Quizzes
                </CardTitle>
                <CardDescription>
                  Learn more about each other through fun personality quizzes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Discover Each Other</h3>
                    <p className="text-sm text-muted-foreground">
                      Take quizzes to understand your love languages and personalities
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTutorial(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Tutorial
                  </Button>
                </div>

                <Link to="/quizzes">
                  <Button className="w-full">
                    <Brain className="w-4 h-4 mr-2" />
                    Start Quizzes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="surface-raised">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                You're Connected!
              </CardTitle>
              <CardDescription>
                Start planning your next date adventure together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4 py-8">
                <Badge variant="secondary" className="px-4 py-2">
                  Couple Mode Active
                </Badge>
                <p className="text-muted-foreground">
                  Full couple features coming soon! For now, explore places together.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {showTutorial && (
        <CupidTutorial
          steps={tutorialSteps}
          onComplete={() => setShowTutorial(false)}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
