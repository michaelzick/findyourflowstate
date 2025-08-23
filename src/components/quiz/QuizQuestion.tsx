import React from 'react';
import { QuizQuestion as QuizQuestionType, QuizAnswer } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: QuizQuestionType;
  answer?: QuizAnswer;
  onAnswer: (answer: QuizAnswer) => void;
  className?: string;
}

export function QuizQuestion({ question, answer, onAnswer, className }: QuizQuestionProps) {
  const handleMultipleChoiceAnswer = (value: string) => {
    onAnswer({
      questionId: question.id,
      value,
    });
  };

  const handleScaleAnswer = (value: number) => {
    onAnswer({
      questionId: question.id,
      value,
    });
  };

  const handleTextAnswer = (value: string) => {
    onAnswer({
      questionId: question.id,
      value,
    });
  };

  const handleMultiSelectAnswer = (optionValue: string, checked: boolean) => {
    const currentValues = (answer?.value as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(v => v !== optionValue);
    }

    onAnswer({
      questionId: question.id,
      value: newValues,
    });
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={answer?.value === option ? "default" : "outline"}
                className={cn(
                  "w-full justify-start text-left h-auto p-4 whitespace-normal",
                  answer?.value === option && "bg-primary border-primary"
                )}
                onClick={() => handleMultipleChoiceAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.scaleLabels?.[0]}</span>
              <span>{question.scaleLabels?.[1]}</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              {Array.from({ length: question.scaleMax! - question.scaleMin! + 1 }, (_, i) => {
                const value = question.scaleMin! + i;
                return (
                  <Button
                    key={value}
                    variant={answer?.value === value ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "w-12 h-12 rounded-full",
                      answer?.value === value && "bg-primary border-primary"
                    )}
                    onClick={() => handleScaleAnswer(value)}
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 'text':
        return (
          <Textarea
            placeholder="Share your thoughts..."
            value={(answer?.value as string) || ''}
            onChange={(e) => handleTextAnswer(e.target.value)}
            className="min-h-[120px] bg-quiz-card border-border focus:border-primary"
          />
        );

      case 'multi_select':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={((answer?.value as string[]) || []).includes(option)}
                  onCheckedChange={(checked) =>
                    handleMultiSelectAnswer(option, checked as boolean)
                  }
                />
                <label
                  htmlFor={`${question.id}-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("p-6 bg-quiz-card border-border shadow-quiz animate-fade-in", className)}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {question.question}
          </h2>
          {question.required && (
            <p className="text-sm text-muted-foreground">* Required</p>
          )}
        </div>
        {renderQuestion()}
      </div>
    </Card>
  );
}
