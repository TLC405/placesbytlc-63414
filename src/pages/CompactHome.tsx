import { Link } from "react-router-dom";
import { MapPin, Palette, Sparkles, Heart, Flower2, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Places",
    icon: MapPin,
    path: "/",
    description: "Discover date spots",
    color: "from-pink-500 to-rose-500",
    public: true,
  },
  {
    title: "Cartoonifier",
    icon: Palette,
    path: "/cartoonifier",
    description: "Transform photos",
    color: "from-purple-500 to-pink-500",
    public: true,
  },
  {
    title: "Quizzes",
    icon: Sparkles,
    path: "/quizzes",
    description: "Personality tests",
    color: "from-blue-500 to-cyan-500",
    public: false,
  },
  {
    title: "Couple Mode",
    icon: Heart,
    path: "/couple-mode",
    description: "Sync with partner",
    color: "from-red-500 to-pink-500",
    public: false,
  },
  {
    title: "Love Cycle",
    icon: Flower2,
    path: "/period-tracker",
    description: "Relationship sync",
    color: "from-pink-400 to-rose-400",
    public: false,
  },
  {
    title: "AI Cupid",
    icon: Bot,
    path: "/ai-recommender",
    description: "Smart suggestions",
    color: "from-violet-500 to-purple-500",
    public: false,
  },
];

export default function CompactHome() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold gradient-text">TLC PLACES</h1>
            <p className="text-xs text-muted-foreground">by FeeFee for Lord TLC</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-all"
          >
            👑 Admin
          </Link>
        </div>
      </header>

      {/* Main Content Grid - No Scrolling */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8 space-y-2">
            <h2 className="font-heading text-4xl font-black gradient-text">
              Choose Your Adventure
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for the perfect date experience
            </p>
          </div>

          {/* Compact 3x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="group relative overflow-hidden hover:shadow-glow transition-all duration-300 hover:scale-105 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>

                      {!feature.public && (
                        <div className="mt-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                            ⚠️ Admin Only
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
              <div className="text-2xl font-bold gradient-text">1000+</div>
              <div className="text-xs text-muted-foreground">Places</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
              <div className="text-2xl font-bold gradient-text">50K+</div>
              <div className="text-xs text-muted-foreground">Cartoons Made</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
              <div className="text-2xl font-bold gradient-text">24/7</div>
              <div className="text-xs text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
