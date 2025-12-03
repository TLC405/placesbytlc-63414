import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Users, ArrowLeft } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";
import { useNavigate } from "react-router-dom";

export default function Quizzes() {
  useTesterCheck();
  const navigate = useNavigate();
  
  const quizzes = [
    {
      id: "love",
      title: "Love Language",
      description: "Discover how you express and receive love",
      icon: Heart,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/quiz/love"
    },
    {
      id: "mbti",
      title: "Personality Type",
      description: "Understand your 16 personalities type",
      icon: Brain,
      color: "text-accent",
      bgColor: "bg-accent/10",
      path: "/quiz/mbti"
    },
    {
      id: "relationship",
      title: "Relationship Style",
      description: "Are you an Adventurer, Nurturer, or Romantic?",
      icon: Users,
      color: "text-success",
      bgColor: "bg-success/10",
      path: "/quiz/relationship-style"
    }
  ];

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
                Relationship Quizzes
              </h1>
              <p className="text-sm text-muted-foreground">Discover insights about yourself and your relationship</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Quiz Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <Card key={quiz.id} className="surface-raised shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full ${quiz.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${quiz.color}`} />
                  </div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={quiz.path}>
                    <Button className="w-full">Start Quiz</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon */}
        <Card className="surface-raised">
          <CardHeader>
            <CardTitle className="text-lg">Coming Soon</CardTitle>
            <CardDescription>More quizzes are on the way</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-1">Compatibility Calculator</h3>
                <p className="text-sm text-muted-foreground">Calculate your relationship compatibility score</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-1">Date Night Personality</h3>
                <p className="text-sm text-muted-foreground">Find your perfect date night style</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
