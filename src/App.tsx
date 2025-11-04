import React, { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivityTracker } from "@/components/ActivityTracker";
import { DetailedCupid } from "@/components/DetailedCupid";
import { FloatingEmoji } from "@/components/FloatingEmoji";
import { InAppEditor } from "@/components/InAppEditor";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminOnlyOverlay } from "@/components/AdminOnlyOverlay";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy load quiz pages and special features
const Quizzes = lazy(() => import("./pages/Quizzes"));
const QuizLove = lazy(() => import("./pages/QuizLove"));
const QuizMBTI = lazy(() => import("./pages/QuizMBTI"));
const QuizRelationshipStyle = lazy(() => import("./pages/QuizRelationshipStyle"));
const TesterDashboard = lazy(() => import("./pages/TesterDashboard"));
const TesterGuard = lazy(() => import("./components/TesterGuard").then(m => ({ default: m.TesterGuard })));
const PeriodTracker = lazy(() => import("./pages/PeriodTracker"));
const FeliciaModPanel = lazy(() => import("./components/FeliciaModPanel"));
const CodeViewer = lazy(() => import("./pages/CodeViewer"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Auth = lazy(() => import("./pages/Auth"));
const Landing = lazy(() => import("./pages/Landing"));

import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthRedirect } from "@/components/AuthRedirect";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useSessionTracker();
  // Ensure Google Maps Places API is loaded once globally
  const { isReady: isMapsReady } = useGoogleMaps();
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/code" element={<CodeViewer />} />
        <Route path="/tester" element={<TesterGuard><TesterDashboard /></TesterGuard>} />
        
        {/* Main App Route - All Features in One Hub */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Individual Feature Routes (for direct access if needed) */}
        <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
        <Route path="/quiz/love" element={<ProtectedRoute><QuizLove /></ProtectedRoute>} />
        <Route path="/quiz/mbti" element={<ProtectedRoute><QuizMBTI /></ProtectedRoute>} />
        <Route path="/quiz/relationship-style" element={<ProtectedRoute><QuizRelationshipStyle /></ProtectedRoute>} />
        <Route path="/period-tracker" element={<ProtectedRoute><PeriodTracker /></ProtectedRoute>} />
        
        {/* Super Admin Route - Requires Admin Auth */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DevModeProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ActivityTracker />
                  <AuthRedirect />
                  <DetailedCupid />
                  <FloatingEmoji />
                  <InAppEditor />
                  <AppRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </DevModeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
