import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALLOWED_TESTER_ROUTES = ['/', '/cartoonifier', '/tester'];

export const TesterGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole, hasAnyRole, isLoading } = useUserRole();

  const isTester = hasRole('tester') && !hasAnyRole(['admin', 'moderator']);
  const isAllowedRoute = ALLOWED_TESTER_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (!isLoading && isTester && !isAllowedRoute) {
      // Redirect testers to tester dashboard if they try to access forbidden routes
      navigate('/tester', { replace: true });
    }
  }, [isTester, isAllowedRoute, isLoading, navigate]);

  if (isLoading) {
    return null;
  }

  // If tester is trying to access forbidden route, show access denied
  if (isTester && !isAllowedRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-pink-500/30 bg-black/80 backdrop-blur-xl shadow-[0_0_40px_rgba(255,16,240,0.3)]">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-500 p-4 animate-pulse shadow-[0_0_30px_rgba(255,16,240,0.6)]">
                <AlertTriangle className="w-full h-full text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              ACCESS_RESTRICTED
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg font-mono text-sm text-pink-300">
              <p className="mb-2">&gt; TESTER_MODE: ACTIVE</p>
              <p className="mb-2">&gt; AUTHORIZED_AREAS: [PLACES, CARTOONIFIER]</p>
              <p className="text-pink-400">&gt; ERROR: ROUTE_FORBIDDEN</p>
            </div>
            <Button
              onClick={() => navigate('/tester')}
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,16,240,0.4)]"
            >
              <Shield className="w-5 h-5 mr-2" />
              Return to Tester Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
