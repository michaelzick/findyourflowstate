import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BuyMeCoffeeButton } from '@/components/ui/buy-me-coffee-button';
import { Brain, Users, Target, Clock, CheckCircle, Upload } from 'lucide-react';
import { useQuiz } from '@/contexts/QuizContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QuizAnswer } from '@/types/quiz';
import { safeJSONParse, sanitizeString } from '@/utils/security';
import fyfsWaveImage from '@/assets/fyfs-wave.webp';

export function QuizLanding() {
  const { state, goToQuestion, loadAnswersFromJSON, loadSavedProgress, resetQuizAndClearStorage } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hasProgress = state.answers.length > 0;
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleContinueQuiz = () => {
    const loaded = loadSavedProgress();
    if (loaded) {
      toast({
        title: "Progress Restored",
        description: "Your previous quiz progress has been restored.",
      });
    }
  };

  const handleStartOver = () => {
    setShowResetDialog(true);
  };

  const handleConfirmReset = () => {
    resetQuizAndClearStorage();
    setShowResetDialog(false);
    // Don't navigate anywhere - resetQuizAndClearStorage already navigates to home
    toast({
      title: "Quiz Reset",
      description: "All progress and saved data have been cleared. Starting fresh!",
    });
  };

  // Parallax scroll effect with throttling for performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setScrollY(scrollPosition);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartQuiz = () => {
    goToQuestion(0); // Navigate to first question
  };

  const features = [
    {
      icon: Brain,
      title: "Psychological Foundation",
      description: "Based on modern psychology, neuroscience, and behavioral science research"
    },
    {
      icon: Users,
      title: "Holistic Assessment",
      description: "Considers your childhood patterns, media preferences, work styles, and relationships"
    },
    {
      icon: Target,
      title: "3 Optimal Paths",
      description: "Get precisely matched career recommendations with detailed personality insights"
    },
    {
      icon: Clock,
      title: "45-60 Minutes",
      description: "In-depth assessment with thoughtful questions that reveal deep insights"
    }
  ];

  const whatWeMeasure = [
    "Childhood play patterns and flow states",
    "Media preferences and story themes that resonate with you",
    "Work environment preferences and energy sources",
    "Decision-making styles and information processing",
    "Relationship patterns and social preferences",
    "Values, motivations, and philosophical alignment",
    "Stress responses and conflict resolution styles",
    "Learning experiences from failures and dislikes"
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JSON file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = safeJSONParse(content);

        if (!jsonData) {
          toast({
            title: "Invalid or Unsafe JSON",
            description: "The JSON file contains potentially unsafe content or is malformed.",
            variant: "destructive",
          });
          return;
        }

        // Validate and process the JSON data
        const answers = processJSONAnswers(jsonData);
        if (answers.length > 0) {
          loadAnswersFromJSON(answers);
          toast({
            title: "Answers Loaded Successfully",
            description: `Loaded ${answers.length} answers from JSON file. You can now review and modify them.`,
          });
        } else {
          toast({
            title: "No Valid Answers Found",
            description: "The JSON file doesn't contain valid quiz answers.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "File Processing Error",
          description: "The file could not be processed safely.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);

    // Reset the input so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processJSONAnswers = (jsonData: unknown): QuizAnswer[] => {
    const answers: QuizAnswer[] = [];

    // Handle different JSON formats
    let answersArray: unknown[] = [];

    if (Array.isArray(jsonData)) {
      answersArray = jsonData;
    } else if (jsonData && typeof jsonData === 'object' && 'answers' in jsonData && Array.isArray((jsonData as { answers: unknown; }).answers)) {
      answersArray = (jsonData as { answers: unknown[]; }).answers;
    } else if (jsonData && typeof jsonData === 'object' && jsonData !== null) {
      // Convert object format to array format
      answersArray = Object.entries(jsonData as Record<string, unknown>).map(([key, value]) => ({
        questionId: key,
        value: value
      }));
    }

    // Process each answer with security validation
    answersArray.forEach((item: unknown) => {
      if (item && typeof item === 'object' && 'questionId' in item && 'value' in item && item.value !== undefined) {
        const typedItem = item as { questionId: string; value: string | number | string[]; };

        // Sanitize string values
        let sanitizedValue: string | number | string[];
        if (typeof typedItem.value === 'string') {
          sanitizedValue = sanitizeString(typedItem.value);
        } else if (Array.isArray(typedItem.value)) {
          sanitizedValue = typedItem.value.map(v =>
            typeof v === 'string' ? sanitizeString(v) : v
          );
        } else {
          sanitizedValue = typedItem.value;
        }

        answers.push({
          questionId: sanitizeString(typedItem.questionId),
          value: sanitizedValue
        });
      }
    });

    return answers;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden min-h-screen">
        {/* Single Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-75 ease-out"
            style={{
              backgroundImage: `url(${fyfsWaveImage})`,
              transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0001})`,
              transformOrigin: 'center center',
              opacity: 0.45
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center z-10 flex items-center min-h-screen">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="mb-1">
              Scientifically-Based Career Assessment
            </Badge>
            <h1 className="text-7xl md:text-8xl font-bold text-primary">
              Find Your Flow State
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-muted-foreground">
              Discover Your Optimal Career Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive career quiz that combines psychology, neuroscience, and behavioral science
              to determine your three most compatible career paths with deep{' '}
              <a
                href="/personality-types-careers.html"
                className="text-primary underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                personality type insights
              </a>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {hasProgress ? (
                <>
                  <Button
                    size="lg"
                    onClick={handleContinueQuiz}
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                  >
                    Continue Quiz
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleStartOver}
                    className="text-lg px-8 py-3"
                  >
                    Start Over
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                >
                  Start Your Assessment
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3"
                onClick={() => navigate('/learn-more')}
              >
                Learn More
              </Button>
            </div>

            <div className="mt-8">
              <div className="flex flex-col items-center gap-4">
                <p className="text-m text-muted-foreground">
                  Have previous answers saved as JSON?
                </p>
                <Button
                  variant="secondary"
                  onClick={handleUploadClick}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload JSON Answers
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Buy Me A Coffee Button */}
                <p className="text-m text-muted-foreground mt-6">
                  This assessment is completely free. If it helps you, consider supporting{' '}
                  <a
                    href="https://www.zickonezero.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    the creator
                  </a>
                  . 😉
                </p>
                <BuyMeCoffeeButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why This Career Quiz Is Different From Other Personality Tests
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike simple personality quizzes, our career assessment combines psychology, neuroscience, and behavioral science to provide accurate career guidance based on your unique personality type and work preferences. Learn more about{' '}
              <a
                href="/career-quiz-guide.html"
                className="text-primary underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                how career quizzes work
              </a>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 bg-quiz-card border-border shadow-quiz text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Measure */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                What Makes This Career Quiz and Personality Assessment Comprehensive
              </h2>
              <p className="text-lg text-muted-foreground">
                Our career quiz goes beyond traditional personality tests to analyze your complete personality type, work style, and career preferences for accurate job matching
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-quiz-card border-border shadow-quiz">
                <h3 className="text-xl font-semibold mb-6">Deep Psychological Analysis</h3>
                <div className="space-y-3">
                  {whatWeMeasure.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-8 bg-quiz-card border-border shadow-quiz">
                <h3 className="text-xl font-semibold mb-6">What You'll Discover</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Career Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      3 precisely matched career paths with detailed compatibility scores
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Personality Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Your strengths, natural tendencies, and areas for development
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Work Style Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Optimal environments, team dynamics, and decision-making approaches
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Relationship Guidance</h4>
                    <p className="text-sm text-muted-foreground">
                      Relationship styles that align with your personality and values
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold">
              Ready to Discover Your True Career Path?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands who have gained clarity about their career direction
              through our science-based assessment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {hasProgress ? (
                <>
                  <Button
                    size="lg"
                    onClick={handleContinueQuiz}
                    className="bg-primary hover:bg-primary/90 text-xl px-12 py-4"
                  >
                    Continue Quiz
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleStartOver}
                    className="text-lg px-8 py-3"
                  >
                    Start Over
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  className="bg-primary hover:bg-primary/90 text-xl px-12 py-4"
                >
                  Begin Assessment Now
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={handleUploadClick}
                className="text-lg px-8 py-3 flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Previous Answers
              </Button>
            </div>
            <p className="text-m text-muted-foreground">
              Takes 45-60 minutes • No email required • Immediate results
            </p>

            {/* FAQ Section for SEO */}
            <div className="mt-16 pt-8 border-t border-border/30">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions About Career Quizzes</h2>
                <div className="space-y-6 text-left" itemScope itemType="https://schema.org/FAQPage">
                  <div itemScope itemType="https://schema.org/Question">
                    <h3 className="text-lg font-semibold mb-2" itemProp="name">What is this career quiz and how does it work?</h3>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <p className="text-muted-foreground" itemProp="text">Our free career quiz is a comprehensive personality assessment that combines psychology, neuroscience, and behavioral science to identify your ideal career path. It analyzes your personality type, work preferences, and behavioral patterns to match you with your top 3 most compatible careers.</p>
                    </div>
                  </div>
                  <div itemScope itemType="https://schema.org/Question">
                    <h3 className="text-lg font-semibold mb-2" itemProp="name">How accurate is this personality and career test?</h3>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <p className="text-muted-foreground" itemProp="text">This career assessment is based on established psychological research and behavioral science principles. While no test is 100% accurate, our quiz provides scientifically-backed insights into your personality type and career compatibility to guide your career decisions.</p>
                    </div>
                  </div>
                  <div itemScope itemType="https://schema.org/Question">
                    <h3 className="text-lg font-semibold mb-2" itemProp="name">Is this career quiz really free?</h3>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <p className="text-muted-foreground" itemProp="text">Yes! This career quiz is completely free with no hidden costs, email requirements, or subscriptions. You get immediate access to your personality type results and career recommendations without any payment.</p>
                    </div>
                  </div>
                  <div itemScope itemType="https://schema.org/Question">
                    <h3 className="text-lg font-semibold mb-2" itemProp="name">How long does the career assessment take?</h3>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <p className="text-muted-foreground" itemProp="text">The career quiz typically takes 45-60 minutes to complete. This comprehensive assessment covers multiple aspects of your personality and work preferences to provide accurate career guidance.</p>
                    </div>
                  </div>
                  <div itemScope itemType="https://schema.org/Question">
                    <h3 className="text-lg font-semibold mb-2" itemProp="name">What careers will this personality quiz recommend?</h3>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <p className="text-muted-foreground" itemProp="text">Based on your personality type and assessment results, you'll receive your top 3 most compatible career paths with detailed explanations of why each career matches your personality, work style, and preferences.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="pt-8">
              <div className="flex flex-col items-center gap-4">
                <p className="text-m text-muted-foreground">
                  This assessment is completely free. If it helps you, consider supporting{' '}
                  <a
                    href="https://www.zickonezero.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    the creator
                  </a>
                  . 😉
                </p>
                <BuyMeCoffeeButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Quiz Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your current answers and progress. You'll start from the beginning. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset} className="bg-destructive hover:bg-destructive/90">
              Reset Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
