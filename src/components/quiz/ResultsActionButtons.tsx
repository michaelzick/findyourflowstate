import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, History, Loader2, ArrowLeft } from 'lucide-react';

interface ResultsActionButtonsProps {
  onStartNewQuiz: () => void;
  onLoadPrevious: () => void;
  isLoading?: boolean;
}

export function ResultsActionButtons({ onStartNewQuiz, onLoadPrevious, isLoading = false }: ResultsActionButtonsProps) {
  const [loadingAction, setLoadingAction] = useState<'start' | 'load' | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation only once on mount
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleStartNewQuiz = () => {
    setLoadingAction('start');
    try {
      onStartNewQuiz();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLoadPrevious = () => {
    setLoadingAction('load');
    try {
      onLoadPrevious();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              Quiz Results
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose an action to continue
            </p>
          </div>

          {/* Action Buttons Card */}
          <Card className={`p-8 bg-quiz-card border-border shadow-quiz transition-all duration-500 ${isAnimated
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0'
            }`}>
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">What would you like to do?</h2>
                <p className="text-muted-foreground">
                  Start a fresh assessment or review your previous results
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Start New Quiz Button */}
                <Button
                  onClick={handleStartNewQuiz}
                  size="lg"
                  disabled={isLoading || loadingAction !== null}
                  className="gap-2"
                  aria-label="Start a new quiz assessment"
                  aria-describedby="start-quiz-description"
                >
                  {loadingAction === 'start' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-5 w-5" />
                      Start New Quiz
                    </>
                  )}
                </Button>

                {/* Load Previous Results Button */}
                <Button
                  onClick={handleLoadPrevious}
                  size="lg"
                  variant="outline"
                  disabled={isLoading || loadingAction !== null}
                  className="gap-2"
                  aria-label="Load your previous quiz results"
                  aria-describedby="load-results-description"
                >
                  {loadingAction === 'load' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <History className="h-5 w-5" />
                      Load Previous Results
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p id="start-quiz-description" className="sr-only">
                  Starting a new quiz will clear your current progress and results.
                </p>
                <p id="load-results-description" className="sr-only">
                  Loading previous results will show your last completed assessment.
                </p>
                <p>
                  Starting a new quiz will clear your current progress and results.
                  Loading previous results will show your last completed assessment.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
