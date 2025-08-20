import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuizResults() {
  const { state, resetQuiz } = useQuiz();
  const { toast } = useToast();
  const results = state.results!;

  const handleShare = () => {
    navigator.clipboard.writeText(
      `I just discovered my top career paths: ${results.careerPaths.map(cp => cp.title).join(', ')}. Take the comprehensive career quiz yourself!`
    );
    toast({
      title: "Results Shared",
      description: "Results copied to clipboard!",
    });
  };

  const handleDownload = () => {
    const resultsText = `
Career Assessment Results
=========================

Top Career Paths:
${results.careerPaths.map((cp, i) => `
${i + 1}. ${cp.title} (${cp.score}% match)
   ${cp.description}
   
   Key Traits: ${cp.keyTraits.join(', ')}
   Work Environment: ${cp.workEnvironment}
   Typical Roles: ${cp.typicalRoles.join(', ')}
   Strengths: ${cp.strengths.join(', ')}
   Challenges: ${cp.challenges.join(', ')}
`).join('\n')}

Personality Insights:
====================

Strengths: ${results.personalityInsight.strengths.join(', ')}
Natural Tendencies: ${results.personalityInsight.naturalTendencies.join(', ')}
Working Style: ${results.personalityInsight.workingStyle}
Motivators: ${results.personalityInsight.motivators.join(', ')}
Areas to Avoid: ${results.personalityInsight.avoidanceAreas.join(', ')}
Relationship Styles: ${results.personalityInsight.relationshipStyles.join(', ')}

Confidence Level: ${results.confidence}%
Completed: ${results.completedAt.toLocaleDateString()}
`;

    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-assessment-results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-quiz-gradient bg-clip-text text-transparent">
              Your Career Assessment Results
            </h1>
            <p className="text-xl text-muted-foreground">
              Based on comprehensive psychological analysis of your responses
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-sm">
                Confidence: {results.confidence}%
              </Badge>
              <Badge variant="outline" className="text-sm">
                Completed: {results.completedAt.toLocaleDateString()}
              </Badge>
            </div>
          </div>

          {/* Career Paths */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Your Top Career Paths</h2>
            <div className="grid gap-6">
              {results.careerPaths.map((career, index) => (
                <Card key={career.id} className="p-6 bg-quiz-card border-border shadow-quiz">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-primary">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{career.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={career.score} className="w-32 h-2" />
                            <span className="text-sm font-medium text-primary">
                              {career.score}% match
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground">{career.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Key Traits</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.keyTraits.map((trait) => (
                            <Badge key={trait} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Typical Roles</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.typicalRoles.slice(0, 4).map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                          {career.typicalRoles.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{career.typicalRoles.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2 text-green-400">Strengths</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {career.strengths.map((strength) => (
                            <li key={strength}>{strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-orange-400">Challenges</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {career.challenges.map((challenge) => (
                            <li key={challenge}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Work Environment</h4>
                      <p className="text-sm text-muted-foreground">{career.workEnvironment}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Personality Insights */}
          <Card className="p-6 bg-quiz-card border-border shadow-quiz">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">Your Personality Profile</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-400">Your Strengths</h3>
                  <ul className="space-y-2">
                    {results.personalityInsight.strengths.map((strength) => (
                      <li key={strength} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-orange-400">Areas for Growth</h3>
                  <ul className="space-y-2">
                    {results.personalityInsight.avoidanceAreas.map((area) => (
                      <li key={area} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Your Working Style</h3>
                <p className="text-muted-foreground">{results.personalityInsight.workingStyle}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">What Motivates You</h3>
                <div className="flex flex-wrap gap-2">
                  {results.personalityInsight.motivators.map((motivator) => (
                    <Badge key={motivator} variant="secondary">
                      {motivator}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Your Natural Tendencies</h3>
                <ul className="space-y-1">
                  {results.personalityInsight.naturalTendencies.map((tendency) => (
                    <li key={tendency} className="text-sm text-muted-foreground">
                      • {tendency}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Relationship Insights</h3>
                <ul className="space-y-1">
                  {results.personalityInsight.relationshipStyles.map((style) => (
                    <li key={style} className="text-sm text-muted-foreground">
                      • {style}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Results
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
            <Button onClick={resetQuiz} variant="default" className="flex items-center gap-2 bg-quiz-gradient">
              <RotateCcw className="w-4 h-4" />
              Take Quiz Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}