import React, { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ActivityTracker } from "@/components/ActivityTracker";
import { AuthRedirect } from "@/components/AuthRedirect";
import { InAppEditor } from "@/components/InAppEditor";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminOnlyOverlay } from "@/components/AdminOnlyOverlay";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy load pages
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const QuizLove = lazy(() => import("./pages/QuizLove"));
const QuizMBTI = lazy(() => import("./pages/QuizMBTI"));
const QuizRelationshipStyle = lazy(() => import("./pages/QuizRelationshipStyle"));
const TesterDashboard = lazy(() => import("./pages/TesterDashboard"));
const TesterGuard = lazy(() => import("./components/TesterGuard").then(m => ({ default: m.TesterGuard })));
const CodeViewer = lazy(() => import("./pages/CodeViewer"));

import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
        
        {/* Main App Route - All Features in One Unified Hub */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Individual Quiz Routes (for deep links) */}
        <Route path="/quiz/love" element={<ProtectedRoute><QuizLove /></ProtectedRoute>} />
        <Route path="/quiz/mbti" element={<ProtectedRoute><QuizMBTI /></ProtectedRoute>} />
        <Route path="/quiz/relationship-style" element={<ProtectedRoute><QuizRelationshipStyle /></ProtectedRoute>} />
        
        {/* Redirect old routes to unified hub */}
        <Route path="/admin" element={<Navigate to="/home?tab=admin" replace />} />
        <Route path="/quizzes" element={<Navigate to="/home?tab=quizzes" replace />} />
        <Route path="/period-tracker" element={<Navigate to="/home?tab=period-tracker" replace />} />
        
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
