import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  className?: string;
}

export function QuizProgress({ currentQuestion, totalQuestions, className }: QuizProgressProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Question {currentQuestion + 1} of {totalQuestions}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-primary"
      />
    </div>
  );
}
