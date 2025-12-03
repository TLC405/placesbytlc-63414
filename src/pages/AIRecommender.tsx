import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Heart, TrendingUp, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTesterCheck } from "@/hooks/useTesterCheck";
import { useNavigate } from "react-router-dom";

export default function AIRecommender() {
  useTesterCheck();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleGetRecommendations = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what you're looking for!");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI recommendations for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecommendations([
        "The Mule - Rooftop bar with stunning city views, perfect for sunset dates",
        "Paseo Arts District - Walk through galleries and grab dinner at The Press",
        "Scissortail Park - Romantic evening stroll with food trucks nearby",
        "Vast - Upscale dining on the 49th floor with panoramic views",
        "Factory Obscura - Interactive art experience, fun and unique date"
      ]);
      
      toast.success("Got your recommendations!");
    } catch (error) {
      toast.error("Failed to get recommendations");
    } finally {
      setLoading(false);
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
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                  AI Date Recommender
                </h1>
                <p className="text-sm text-muted-foreground">Get personalized date spot recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-3xl space-y-8">
        {/* Input Section */}
        <Card className="surface-raised shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              What are you looking for?
            </CardTitle>
            <CardDescription>
              Describe your ideal date - budget, vibe, activities, food preferences, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: Looking for a romantic dinner under $100, preferably Italian, with a nice ambiance and maybe live music..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
            
            <Button
              onClick={handleGetRecommendations}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2" />
                  Getting Recommendations...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {recommendations.length > 0 && (
          <Card className="surface-raised">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted/50 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-sm leading-relaxed">{rec}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Coming Soon Notice */}
        <Card className="surface-raised border-dashed">
          <CardContent className="p-4">
            <p className="text-center text-sm text-muted-foreground">
              <strong>Beta Feature:</strong> AI recommendations are being enhanced with real-time data and smarter personalization.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
