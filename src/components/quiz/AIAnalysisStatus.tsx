import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface AIAnalysisStatusProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  hasResults: boolean;
}

export function AIAnalysisStatus({ isLoading, hasError, errorMessage, hasResults }: AIAnalysisStatusProps) {
  if (hasResults) return null; // Don't show status if we have results

  if (isLoading) {
    return (
      <Card className="p-4 bg-quiz-card border-border">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <h3 className="font-medium">AI Analysis in Progress</h3>
            <p className="text-sm text-muted-foreground">
              Generating deeper psychological insights and specific career recommendations...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="p-4 bg-quiz-card border-border border-secondary/30">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-secondary" />
          <div>
            <h3 className="font-medium text-secondary">AI Analysis Unavailable</h3>
            <p className="text-sm text-muted-foreground">
              {errorMessage || 'Enhanced AI insights could not be generated at this time. Your basic career analysis results are still complete and accurate.'}
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              Basic analysis complete
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

// Component for showing loading state within AI analysis sections
export function AIAnalysisLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 p-4 rounded-lg bg-background/50">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">
        {message || 'AI analysis in progress...'}
      </span>
    </div>
  );
}
