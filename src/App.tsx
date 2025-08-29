import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "@/contexts/QuizContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import QuizResultsPage from "./pages/QuizResultsPage";
import QuizResultsClearPage from "./pages/QuizResultsClearPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <QuizProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <RouteErrorBoundary routeName="homepage">
                      <Index />
                    </RouteErrorBoundary>
                  }
                />
                <Route
                  path="/learn-more"
                  element={
                    <RouteErrorBoundary routeName="learn more page">
                      <LearnMore />
                    </RouteErrorBoundary>
                  }
                />
                <Route
                  path="/quiz-results"
                  element={
                    <RouteErrorBoundary routeName="quiz results page">
                      <QuizResultsPage />
                    </RouteErrorBoundary>
                  }
                />
                <Route
                  path="/quiz-results/clear-results"
                  element={
                    <RouteErrorBoundary routeName="quiz results clear page">
                      <QuizResultsClearPage />
                    </RouteErrorBoundary>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route
                  path="*"
                  element={
                    <RouteErrorBoundary routeName="not found page">
                      <NotFound />
                    </RouteErrorBoundary>
                  }
                />
              </Routes>
            </QuizProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
