import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md surface-raised shadow-xl">
        <CardContent className="p-10 text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mx-auto">
            <span className="text-5xl font-serif font-black text-destructive">404</span>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </div>
          
          <Link to="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
