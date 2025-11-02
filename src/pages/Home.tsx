import { Link } from "react-router-dom";
import { 
  MapPin, Palette, Sparkles, Heart, Flower2, Bot, 
  Crown, LogOut, Menu, X 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useAuth } from "@/contexts/AuthContext";

const allFeatures = [
  {
    title: "Places Search",
    icon: MapPin,
    path: "/places",
    description: "Discover perfect date spots near you",
    color: "from-pink-500 to-rose-500",
    category: "main",
  },
  {
    title: "Cartoonifier",
    icon: Palette,
    path: "/cartoonifier",
    description: "Transform photos into art",
    color: "from-purple-500 to-pink-500",
    category: "main",
  },
  {
    title: "AI Cupid",
    icon: Bot,
    path: "/ai-recommender",
    description: "Smart date suggestions",
    color: "from-violet-500 to-purple-500",
    category: "admin",
  },
  {
    title: "Couple Mode",
    icon: Heart,
    path: "/couple-mode",
    description: "Sync with your partner",
    color: "from-red-500 to-pink-500",
    category: "admin",
  },
  {
    title: "Love Cycle",
    icon: Flower2,
    path: "/period-tracker",
    description: "Relationship cycle tracking",
    color: "from-pink-400 to-rose-400",
    category: "admin",
  },
  {
    title: "Quizzes",
    icon: Sparkles,
    path: "/quizzes",
    description: "Personality & compatibility tests",
    color: "from-blue-500 to-cyan-500",
    category: "admin",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  // Separate features by category
  const mainFeatures = allFeatures.filter(f => f.category === "main");
  const adminFeatures = allFeatures.filter(f => f.category === "admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* CYBERPUNK HEADER */}
      <header className="border-b border-primary/20 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl sm:text-2xl font-black gradient-text">
                  TLC PLACES
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  V1 by FeeFee for Lord TLC
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-primary/20 space-y-2">
              <DarkModeToggle />
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Crown className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
              {user && (
                <Button 
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }} 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black gradient-text">
            Your Love Command Center
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Everything you need to plan the perfect date experience
          </p>
        </div>

        {/* Main Features Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Main Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mainFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="group relative overflow-hidden hover:shadow-glow transition-all duration-300 hover:scale-105 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <CardContent className="p-8 flex items-center gap-6 relative z-10">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Admin Features Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">👑</span>
            Admin Features
            <span className="text-sm font-normal text-muted-foreground ml-2">(Restricted Access)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="group relative overflow-hidden hover:shadow-glow transition-all duration-300 hover:scale-105 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>

                      <div className="mt-auto px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                          ⚠️ Admin Only
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-black gradient-text mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Date Spots Discovered</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-black gradient-text mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Photos Cartoonified</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-black gradient-text mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}