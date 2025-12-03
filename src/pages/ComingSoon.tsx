import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowLeft, Sparkles } from "lucide-react";

export default function ComingSoon() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md surface-raised shadow-xl">
        <CardContent className="p-10 text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto">
            <Clock className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">
              Coming Soon
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              This feature is currently under development. Check back soon for updates.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Something special is brewing</span>
          </div>
          
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
