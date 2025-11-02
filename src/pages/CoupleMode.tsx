import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Heart, Link as LinkIcon, Calendar, Star, Brain, Sparkles, Send, Bot } from "lucide-react";
import { toast } from "sonner";
import { useTesterCheck } from "@/hooks/useTesterCheck";
import { CupidTutorial } from "@/components/CupidTutorial";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Message = { role: 'user' | 'assistant'; content: string };

export default function CoupleMode() {
  useTesterCheck();
  const [pairingCode, setPairingCode] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const tutorialSteps = [
    "Hey there, lovebirds! 💕 Welcome to Couple Mode!",
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
    toast.success("Successfully paired! 💑");
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
      // Remove user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Users className="w-10 h-10" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black">Couple Mode</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Plan dates together with shared calendar and wishlist
          </CardDescription>
        </CardHeader>
      </Card>

      {!isPaired ? (
        <>
          {/* Pairing Section */}
          <Card className="border-2 border-primary/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-primary" />
                Connect with Your Partner
              </CardTitle>
              <CardDescription>
                Generate a code or enter your partner's code to link accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Generate Code</h3>
                  <Button
                    onClick={generateCode}
                    size="lg"
                    className="w-full gradient-primary h-14"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Generate Pairing Code
                  </Button>
                  {pairingCode && (
                    <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border-2 border-primary/30 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Your Code:</p>
                      <p className="text-4xl font-black gradient-text">{pairingCode}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Enter Partner's Code</h3>
                  <Input
                    placeholder="Enter 6-digit code"
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                    className="h-14 text-center text-2xl font-bold"
                    maxLength={6}
                  />
                  <Button
                    onClick={handlePair}
                    size="lg"
                    variant="outline"
                    className="w-full h-14"
                  >
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Pair Accounts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle>What You'll Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Shared Calendar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Plan dates together and see each other's availability
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/20">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  Shared Wishlist
                </h3>
                <p className="text-sm text-muted-foreground">
                  Save places you both want to try and mark them as visited
                </p>
              </div>
              
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple/10 to-pink/10 border-2 border-purple/20">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Shared Notes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add memories and notes to each place you visit together
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Assistant */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                AI Dating Assistant
              </CardTitle>
              <CardDescription>
                Get creative date ideas and relationship advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-64 w-full rounded-lg border p-4 bg-white/50 dark:bg-black/50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mb-2 text-primary" />
                    <p className="text-sm">Ask me for date ideas, relationship advice, or OKC recommendations!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-r from-primary to-accent text-white' 
                            : 'bg-accent/20 text-foreground'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-accent/20 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground">Thinking... 💭</p>
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
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                Couple Quizzes
              </CardTitle>
              <CardDescription>
                Learn more about each other through fun personality quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Discover Each Other</h3>
                  <p className="text-sm text-muted-foreground">
                    Take quizzes to understand your love languages, personalities, and more
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTutorial(true)}
                  className="flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tutorial
                </Button>
              </div>

              <Link to="/quizzes">
                <Button size="lg" className="w-full">
                  <Brain className="w-5 h-5 mr-2" />
                  Start Quizzes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              You're Connected! 💑
            </CardTitle>
            <CardDescription>
              Start planning your next date adventure together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6 py-8">
              <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-primary to-accent text-white">
                Couple Mode Active
              </Badge>
              <p className="text-muted-foreground">
                Full couple features coming soon! For now, explore places together and share your favorites.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
