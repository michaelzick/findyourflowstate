import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BuyMeCoffeeButton } from '@/components/ui/buy-me-coffee-button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Download, Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStickyFooter } from '@/hooks/use-sticky-footer';
import { AIAnalysisStatus, AIAnalysisLoading } from './AIAnalysisStatus';
import { DownloadFormatModal } from './DownloadFormatModal';
import { generateMarkdownContent, generateRichTextContent, downloadFile } from '@/utils/download-formats';

interface QuizResultsProps {
  showClearButton?: boolean;
}

export function QuizResults({ showClearButton = false }: QuizResultsProps) {
  const { state, resetQuiz, downloadAnswersAsJSON } = useQuiz();
  const { toast } = useToast();
  const navigate = useNavigate();
  const results = state.results!;
  const { isSticky, footerRef, originalPositionRef } = useStickyFooter({ offset: 150 });
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const generateComprehensiveText = () => {
    const text = `
COMPREHENSIVE CAREER ASSESSMENT RESULTS
=====================================

Assessment Overview:
- Confidence Level: ${results.confidence}%
- Completed: ${results.completedAt.toLocaleDateString()}

TOP CAREER PATHS
===============

${results.careerPaths.map((cp, i) => `
${i + 1}. ${cp.title.toUpperCase()} (${cp.score}% MATCH)
${'-'.repeat(50)}

Description:
${cp.description}

Key Traits:
${cp.keyTraits.map(trait => `• ${trait}`).join('\n')}

Typical Roles:
${cp.typicalRoles.map(role => `• ${role}`).join('\n')}

${cp.specificOccupations ? `Specific Occupations:
${cp.specificOccupations.map(occ => `• ${occ}`).join('\n')}` : ''}

Work Environment:
${cp.workEnvironment}

Strengths in This Path:
${cp.strengths.map(strength => `• ${strength}`).join('\n')}

Potential Challenges:
${cp.challenges.map(challenge => `• ${challenge}`).join('\n')}

`).join('\n')}

${results.aiAnalysis?.specificOccupations ? `
SPECIFIC CAREER RECOMMENDATIONS (AI-ENHANCED)
===========================================

${results.aiAnalysis.specificOccupations.map((occ, i) => `
${i + 1}. ${occ.title.toUpperCase()} (${occ.fitScore}% FIT)
${'-'.repeat(40)}
Category: ${occ.category}
Reasoning: ${occ.reasoning}

`).join('\n')}` : ''}

COMPREHENSIVE PERSONALITY PROFILE
================================

YOUR STRENGTHS:
${results.personalityInsight.strengths.map(strength => `• ${strength}`).join('\n')}

AREAS FOR GROWTH:
${results.personalityInsight.areasForGrowth.map(area => `• ${area}`).join('\n')}

YOUR WORKING STYLE:
${results.personalityInsight.workingStyle}

WHAT MOTIVATES YOU:
${results.personalityInsight.motivators.map(motivator => `• ${motivator}`).join('\n')}

YOUR NATURAL TENDENCIES:
${results.personalityInsight.naturalTendencies.map(tendency => `• ${tendency}`).join('\n')}

RELATIONSHIP INSIGHTS:
${results.personalityInsight.relationshipStyles.map(style => `• ${style}`).join('\n')}

ENVIRONMENTS TO APPROACH WITH CAUTION:
${results.personalityInsight.avoidanceAreas.map(area => `• ${area}`).join('\n')}

${results.aiAnalysis?.hiddenBeliefs ? `
HIDDEN BELIEFS & PSYCHOLOGICAL PATTERNS (AI ANALYSIS)
===================================================

SUCCESS BLOCKERS:
${results.aiAnalysis.hiddenBeliefs.successBlockers.map(blocker => `• ${blocker}`).join('\n')}

MONEY BELIEFS:
${results.aiAnalysis.hiddenBeliefs.moneyBeliefs.map(belief => `• ${belief}`).join('\n')}

FEAR PATTERNS:
${results.aiAnalysis.hiddenBeliefs.fearPatterns.map(pattern => `• ${pattern}`).join('\n')}

CORE PSYCHOLOGICAL INSIGHTS:
${results.aiAnalysis.hiddenBeliefs.coreInsights.map(insight => `• ${insight}`).join('\n')}` : ''}

${results.aiAnalysis?.enhancedPersonality ? `

ENHANCED PERSONALITY ANALYSIS (AI-POWERED)
========================================

COGNITIVE STYLE:
${results.aiAnalysis.enhancedPersonality.cognitiveStyle}

MOTIVATIONAL DRIVERS:
${results.aiAnalysis.enhancedPersonality.motivationalDrivers.map(driver => `• ${driver}`).join('\n')}

RELATIONSHIP STYLE:
${results.aiAnalysis.enhancedPersonality.relationshipStyle}

WORK ENVIRONMENT NEEDS:
${results.aiAnalysis.enhancedPersonality.workEnvironmentNeeds}` : ''}

${results.aiAnalysis?.deepAnalysis ? `

DEEP BEHAVIORAL ANALYSIS (AI-POWERED)
====================================

BEHAVIORAL PATTERNS:
${results.aiAnalysis.deepAnalysis.behavioralPatterns.map(pattern => `• ${pattern}`).join('\n')}

UNCONSCIOUS DRIVERS:
${results.aiAnalysis.deepAnalysis.unconsciousDrivers.map(driver => `• ${driver}`).join('\n')}

BLIND SPOTS:
${results.aiAnalysis.deepAnalysis.blindSpots.map(spot => `• ${spot}`).join('\n')}

SELF-SABOTAGE PATTERNS:
${results.aiAnalysis.deepAnalysis.selfSabotagePatterns.map(pattern => `• ${pattern}`).join('\n')}

EMOTIONAL TRIGGERS:
${results.aiAnalysis.deepAnalysis.emotionalTriggers.map(trigger => `• ${trigger}`).join('\n')}

DECISION-MAKING STYLE:
${results.aiAnalysis.deepAnalysis.decisionMakingStyle}

COMMUNICATION STYLE:
${results.aiAnalysis.deepAnalysis.communicationStyle}

LEADERSHIP STYLE:
${results.aiAnalysis.deepAnalysis.leadershipStyle}

STRESS RESPONSE:
${results.aiAnalysis.deepAnalysis.stressResponse}

CONFLICT STYLE:
${results.aiAnalysis.deepAnalysis.conflictStyle}` : ''}

${results.aiAnalysis?.lifePurpose ? `

LIFE PURPOSE ANALYSIS (AI-POWERED)
=================================

CORE CONTRIBUTION:
${results.aiAnalysis.lifePurpose.coreContribution}

NATURAL GIFTS:
${results.aiAnalysis.lifePurpose.naturalGifts.map(gift => `• ${gift}`).join('\n')}

MEANINGFUL IMPACT AREAS:
${results.aiAnalysis.lifePurpose.meaningfulImpact.map(impact => `• ${impact}`).join('\n')}

WHAT THE WORLD NEEDS FROM YOU:
${results.aiAnalysis.lifePurpose.worldNeeds.map(need => `• ${need}`).join('\n')}

PURPOSE ALIGNMENT:
${results.aiAnalysis.lifePurpose.purposeAlignment}

FULFILLMENT FACTORS:
${results.aiAnalysis.lifePurpose.fulfillmentFactors.map(factor => `• ${factor}`).join('\n')}

LEGACY VISION:
${results.aiAnalysis.lifePurpose.legacyVision}

SERVICE ORIENTATION:
${results.aiAnalysis.lifePurpose.serviceOrientation}

SPIRITUAL DIMENSION:
${results.aiAnalysis.lifePurpose.spiritualDimension}` : ''}

---
Generated by Comprehensive Career Assessment Quiz with AI Enhancement
Assessment Date: ${results.completedAt.toLocaleDateString()}
    `;

    return text;
  };

  const handleDownloadAnswers = () => {
    downloadAnswersAsJSON();
    toast({
      title: "Answers Downloaded",
      description: "Your quiz answers have been saved as JSON for future use!",
    });
  };

  const handleCopyResults = () => {
    const comprehensiveText = generateComprehensiveText();
    navigator.clipboard.writeText(comprehensiveText);
    toast({
      title: "Results Copied",
      description: "Comprehensive results copied to clipboard!",
    });
  };

  const handleDownloadResults = () => {
    setShowDownloadModal(true);
  };

  const handleFormatSelect = (format: 'markdown' | 'richtext') => {
    setShowDownloadModal(false);

    const timestamp = new Date().toISOString().slice(0, 10);

    try {
      if (format === 'markdown') {
        const content = generateMarkdownContent(results);
        downloadFile(content, `career-assessment-results-${timestamp}.md`, 'text/markdown');

        toast({
          title: "Markdown Downloaded",
          description: "Your results have been saved as a Markdown file!",
        });
      } else {
        const content = generateRichTextContent(results);
        downloadFile(content, `career-assessment-results-${timestamp}.rtf`, 'application/rtf');

        toast({
          title: "Rich Text Downloaded",
          description: "Your results have been saved as a Rich Text file!",
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to generate download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background animate-in fade-in-0 duration-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl font-bold">
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

          {/* AI Analysis Status */}
          <AIAnalysisStatus
            isLoading={state.isAiAnalysisLoading}
            hasError={!!state.aiAnalysisError}
            errorMessage={state.aiAnalysisError || undefined}
            hasResults={!!results.aiAnalysis}
          />

          {/* Career Paths */}
          <div className="space-y-8">
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
                        <h4 className="font-medium mb-3">Key Traits</h4>
                        <ul className="space-y-2">
                          {career.keyTraits.map((trait) => (
                            <li key={trait} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Typical Roles</h4>
                        <ul className="space-y-2">
                          {career.typicalRoles.map((role) => (
                            <li key={role} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{role}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-3 text-accent">Strengths</h4>
                        <ul className="space-y-2">
                          {career.strengths.map((strength) => (
                            <li key={strength} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3 text-red-400">Challenges</h4>
                        <ul className="space-y-2">
                          {career.challenges.map((challenge) => (
                            <li key={challenge} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{challenge}</span>
                            </li>
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
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-center">Your Personality Profile</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-accent">Your Strengths</h3>
                  <ul className="space-y-2">
                    {results.personalityInsight.strengths.map((strength) => (
                      <li key={strength} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-accent">Areas for Growth</h3>
                  <ul className="space-y-2">
                    {results.personalityInsight.areasForGrowth.map((area) => (
                      <li key={area} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
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
                <ul className="space-y-2">
                  {results.personalityInsight.motivators.map((motivator) => (
                    <li key={motivator} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{motivator}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Your Natural Tendencies</h3>
                <ul className="space-y-2">
                  {results.personalityInsight.naturalTendencies.map((tendency) => (
                    <li key={tendency} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{tendency}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Relationship Insights</h3>
                <ul className="space-y-2">
                  {results.personalityInsight.relationshipStyles.map((style) => (
                    <li key={style} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{style}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* AI Analysis - Specific Occupations */}
          {state.isAiAnalysisLoading ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">Specific Career Recommendations</h2>
                <AIAnalysisLoading message="Analyzing your responses to generate specific career recommendations..." />
              </div>
            </Card>
          ) : results.aiAnalysis?.specificOccupations && results.aiAnalysis.specificOccupations.length > 0 ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">Specific Career Recommendations</h2>
                <div className="grid gap-4">
                  {results.aiAnalysis.specificOccupations
                    .sort((a, b) => b.fitScore - a.fitScore)
                    .map((occupation) => (
                      <div key={occupation.title} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-accent">{occupation.title}</h3>
                          <div className="text-sm text-primary font-medium">{occupation.fitScore}% fit</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Category: {occupation.category}</p>
                        <p className="text-sm">{occupation.reasoning}</p>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          ) : null}

          {/* Hidden Beliefs & Blockers Analysis */}
          {state.isAiAnalysisLoading ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Hidden Beliefs & Psychological Patterns</h2>
                <AIAnalysisLoading message="Analyzing psychological patterns and hidden beliefs..." />
              </div>
            </Card>
          ) : results.aiAnalysis?.hiddenBeliefs ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Hidden Beliefs & Psychological Patterns</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-red-400">Success Blockers</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.hiddenBeliefs.successBlockers.map((blocker, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          <span className="text-sm">{blocker}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-red-400">Money Beliefs</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.hiddenBeliefs.moneyBeliefs.map((belief, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          <span className="text-sm">{belief}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-red-400">Fear Patterns</h3>
                  <ul className="space-y-2">
                    {results.aiAnalysis.hiddenBeliefs.fearPatterns.map((pattern, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-accent">Core Insights</h3>
                  <ul className="space-y-2">
                    {results.aiAnalysis.hiddenBeliefs.coreInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Enhanced Personality Analysis */}
          {state.isAiAnalysisLoading ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Enhanced Personality Analysis</h2>
                <AIAnalysisLoading message="Generating enhanced personality insights..." />
              </div>
            </Card>
          ) : results.aiAnalysis?.enhancedPersonality ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Enhanced Personality Analysis</h2>

                <div>
                  <h3 className="font-semibold mb-3 text-accent">Cognitive Style</h3>
                  <p className="text-sm text-muted-foreground">{results.aiAnalysis.enhancedPersonality.cognitiveStyle}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-accent">Motivational Drivers</h3>
                  <ul className="space-y-2">
                    {results.aiAnalysis.enhancedPersonality.motivationalDrivers.map((driver, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-accent">Relationship Style</h3>
                  <p className="text-sm text-muted-foreground">{results.aiAnalysis.enhancedPersonality.relationshipStyle}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-accent">Work Environment Needs</h3>
                  <p className="text-sm text-muted-foreground">{results.aiAnalysis.enhancedPersonality.workEnvironmentNeeds}</p>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Deep Behavioral Analysis */}
          {state.isAiAnalysisLoading ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Deep Behavioral Analysis</h2>
                <AIAnalysisLoading message="Analyzing behavioral patterns and unconscious drivers..." />
              </div>
            </Card>
          ) : results.aiAnalysis?.deepAnalysis ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Deep Behavioral Analysis</h2>
                <p className="text-center text-muted-foreground">
                  Understanding your unconscious patterns, triggers, and behavioral tendencies
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Behavioral Patterns</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.deepAnalysis.behavioralPatterns.map((pattern, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-sm">{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-red-400">Blind Spots</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.deepAnalysis.blindSpots.map((blindSpot, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          <span className="text-sm">{blindSpot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Unconscious Drivers</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.deepAnalysis.unconsciousDrivers.map((driver, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-sm">{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-red-400">Self-Sabotage Patterns</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.deepAnalysis.selfSabotagePatterns.map((pattern, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          <span className="text-sm">{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Decision-Making Style</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.aiAnalysis.deepAnalysis.decisionMakingStyle}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Communication Style</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.aiAnalysis.deepAnalysis.communicationStyle}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Leadership Style</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.aiAnalysis.deepAnalysis.leadershipStyle}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-red-400">Emotional Triggers</h3>
                  <ul className="space-y-2">
                    {results.aiAnalysis.deepAnalysis.emotionalTriggers.map((trigger, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Life Purpose Analysis */}
          {state.isAiAnalysisLoading ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Life Purpose Analysis</h2>
                <AIAnalysisLoading message="Discovering your life purpose and meaningful contribution..." />
              </div>
            </Card>
          ) : results.aiAnalysis?.lifePurpose ? (
            <Card className="p-6 bg-quiz-card border-border shadow-quiz">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Your Life Purpose</h2>
                <p className="text-center text-muted-foreground">
                  Understanding your deeper calling and meaningful contribution to the world
                </p>

                <div className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-3 text-xl text-primary">Core Contribution</h3>
                    <p className="text-lg text-muted-foreground italic">
                      "{results.aiAnalysis.lifePurpose.coreContribution}"
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Your Natural Gifts</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.lifePurpose.naturalGifts.map((gift, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-sm">{gift}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Meaningful Impact Areas</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.lifePurpose.meaningfulImpact.map((impact, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-sm">{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">What the World Needs from You</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.lifePurpose.worldNeeds.map((need, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-sm">{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Purpose Alignment</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.aiAnalysis.lifePurpose.purposeAlignment}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Fulfillment Factors</h3>
                    <ul className="space-y-2">
                      {results.aiAnalysis.lifePurpose.fulfillmentFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-accent">Legacy Vision</h3>
                      <p className="text-sm text-muted-foreground">
                        {results.aiAnalysis.lifePurpose.legacyVision}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-accent">Service Orientation</h3>
                      <p className="text-sm text-muted-foreground">
                        {results.aiAnalysis.lifePurpose.serviceOrientation}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-accent">Spiritual Dimension</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.aiAnalysis.lifePurpose.spiritualDimension}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Original Footer Position Marker */}
          <div ref={originalPositionRef} className="w-full">
            {/* Actions - Original Position */}
            <div className="flex flex-wrap justify-center gap-3 pb-4 max-w-4xl mx-auto">
              <Button onClick={handleDownloadResults} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Results</span>
                <span className="sm:hidden">Results</span>
              </Button>
              <Button onClick={handleCopyResults} variant="outline" size="sm" className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy to Clipboard</span>
                <span className="sm:hidden">Copy</span>
              </Button>
              <Button onClick={handleDownloadAnswers} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Answers</span>
                <span className="sm:hidden">Answers</span>
              </Button>
              {showClearButton ? (
                <Button onClick={() => navigate('/quiz-results/clear-results')} variant="outline" size="sm" className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear Results</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              ) : (
                <Button onClick={resetQuiz} variant="default" size="sm" className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Take Quiz Again</span>
                  <span className="sm:hidden">Retake</span>
                </Button>
              )}
              <BuyMeCoffeeButton size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div
        ref={footerRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-background/95 backdrop-blur-sm border-t border-border
          transition-transform duration-300 ease-in-out
          ${isSticky ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            <Button
              onClick={handleDownloadResults}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Results</span>
              <span className="sm:hidden">Results</span>
            </Button>
            <Button
              onClick={handleCopyResults}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy to Clipboard</span>
              <span className="sm:hidden">Copy</span>
            </Button>
            <Button
              onClick={handleDownloadAnswers}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Answers</span>
              <span className="sm:hidden">Answers</span>
            </Button>
            {showClearButton ? (
              <Button
                onClick={() => navigate('/quiz-results/clear-results')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear Results</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            ) : (
              <Button
                onClick={resetQuiz}
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Take Quiz Again</span>
                <span className="sm:hidden">Retake</span>
              </Button>
            )}
            <BuyMeCoffeeButton size="sm" />
          </div>
        </div>
      </div>

      {/* Download Format Modal */}
      <DownloadFormatModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onSelectFormat={handleFormatSelect}
      />
    </div>
  );
}
