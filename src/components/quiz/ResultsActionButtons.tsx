import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, History, Loader2 } from 'lucide-react';

interface ResultsActionButtonsProps {
  onStartNewQuiz: () => void;
  onLoadPrevious: () => void;
  isLoading?: boolean;
}

export function ResultsActionButtons({ onStartNewQuiz, onLoadPrevious, isLoading = false }: ResultsActionButtonsProps) {
  const [loadingAction, setLoadingAction] = useState<'start' | 'load' | null>(null);

  const handleStartNewQuiz = async () => {
    setLoadingAction('start');
    try {
      await onStartNewQuiz();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLoadPrevious = async () => {
    setLoadingAction('load');
    try {
      await onLoadPrevious();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center animate-in fade-in-0 duration-500">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl font-bold">
              Quiz Results
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose an action to continue
            </p>
          </div>

          {/* Action Buttons Card */}
          <Card className="p-8 bg-quiz-card border-border shadow-quiz animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">What would you like to do?</h2>
                <p className="text-muted-foreground">
                  Start a fresh assessment or review your previous results
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Start New Quiz Button - Left */}
                <Button
                  onClick={handleStartNewQuiz}
                  size="lg"
                  disabled={isLoading || loadingAction !== null}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 disabled:hover:scale-100 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Start a new quiz assessment"
                  aria-describedby="start-quiz-description"
                >
                  {loadingAction === 'start' ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-lg font-medium">Starting...</span>
                      <span className="text-sm opacity-90">Please wait</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-6 h-6" />
                      <span className="text-lg font-medium">Start New Quiz</span>
                      <span className="text-sm opacity-90">Begin fresh assessment</span>
                    </>
                  )}
                </Button>

                {/* Load Previous Results Button - Right */}
                <Button
                  onClick={handleLoadPrevious}
                  size="lg"
                  variant="outline"
                  disabled={isLoading || loadingAction !== null}
                  className="h-20 flex flex-col items-center justify-center gap-2 border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 disabled:hover:scale-100 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Load your previous quiz results"
                  aria-describedby="load-results-description"
                >
                  {loadingAction === 'load' ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-lg font-medium">Loading...</span>
                      <span className="text-sm opacity-90">Please wait</span>
                    </>
                  ) : (
                    <>
                      <History className="w-6 h-6" />
                      <span className="text-lg font-medium">Load Previous Results</span>
                      <span className="text-sm opacity-90">View saved analysis</span>
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
