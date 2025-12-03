import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Flame, Crown, Award, Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Gamification() {
  const navigate = useNavigate();
  
  const achievements = [
    { id: 1, name: "First Date", description: "Visit your first place", icon: Heart, earned: true, points: 10 },
    { id: 2, name: "Foodie Explorer", description: "Try 5 different restaurants", icon: Star, earned: true, points: 25 },
    { id: 3, name: "Activity Adventurer", description: "Visit 3 activity spots", icon: Target, earned: false, points: 25 },
    { id: 4, name: "Weekly Warrior", description: "Go on dates 3 weeks in a row", icon: Flame, earned: false, points: 50 },
    { id: 5, name: "Date Master", description: "Complete 20 dates", icon: Crown, earned: false, points: 100 },
  ];

  const totalPoints = 35;
  const nextLevel = 100;
  const currentLevel = 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="surface-raised border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                Achievements & Rewards
              </h1>
              <p className="text-sm text-muted-foreground">Level up your dating game</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl space-y-8">
        {/* Level Progress */}
        <Card className="surface-raised shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Level {currentLevel}
              </CardTitle>
              <Badge variant="secondary" className="px-3 py-1">
                {totalPoints} / {nextLevel} XP
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={(totalPoints / nextLevel) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground text-center">
              {nextLevel - totalPoints} XP until Level {currentLevel + 1}
            </p>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold">Your Achievements</h2>
          
          <div className="grid gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card
                  key={achievement.id}
                  className={`surface-raised transition-all ${
                    achievement.earned ? "border-primary/30" : "opacity-60"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant={achievement.earned ? "default" : "secondary"}>
                        {achievement.points} XP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        <Card className="surface-raised">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-primary" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <h3 className="font-semibold text-sm mb-1">Leaderboards</h3>
              <p className="text-xs text-muted-foreground">Compete with other couples</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <h3 className="font-semibold text-sm mb-1">Weekly Challenges</h3>
              <p className="text-xs text-muted-foreground">New challenges every week</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <h3 className="font-semibold text-sm mb-1">Premium Rewards</h3>
              <p className="text-xs text-muted-foreground">Unlock exclusive perks</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
