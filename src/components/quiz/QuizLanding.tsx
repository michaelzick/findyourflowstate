import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Target, Clock, CheckCircle, Upload } from 'lucide-react';
import { useQuiz } from '@/contexts/QuizContext';
import { useToast } from '@/hooks/use-toast';
import { QuizAnswer } from '@/types/quiz';
import psychologistImage from '@/assets/psychologist-colored-pencil.jpg';
import clientImage from '@/assets/client-colored-pencil.jpg';

export function QuizLanding() {
  const { nextQuestion, loadAnswersFromJSON } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const jsonData = JSON.parse(content);

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
          title: "Invalid JSON File",
          description: "The file could not be parsed. Please check the JSON format.",
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

  const processJSONAnswers = (jsonData: any): QuizAnswer[] => {
    const answers: QuizAnswer[] = [];

    // Handle different JSON formats
    let answersArray: any[] = [];

    if (Array.isArray(jsonData)) {
      answersArray = jsonData;
    } else if (jsonData.answers && Array.isArray(jsonData.answers)) {
      answersArray = jsonData.answers;
    } else if (typeof jsonData === 'object') {
      // Convert object format to array format
      answersArray = Object.entries(jsonData).map(([key, value]) => ({
        questionId: key,
        value: value
      }));
    }

    // Process each answer
    answersArray.forEach((item: unknown) => {
      if (item && typeof item === 'object' && 'questionId' in item && 'value' in item && item.value !== undefined) {
        const typedItem = item as { questionId: string; value: string | number | string[]; };
        answers.push({
          questionId: typedItem.questionId,
          value: typedItem.value
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
      <section className="relative overflow-hidden">
        {/* Split Background Images */}
        <div className="absolute inset-0 grid grid-cols-2">
          {/* Psychologist Side */}
          <div className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-x-[-1]"
              style={{ backgroundImage: `url(${psychologistImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />
          </div>
          {/* Client Side */}
          <div className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${clientImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/80" />
          </div>
        </div>

        {/* Mobile Background - Single Image */}
        <div className="absolute inset-0 md:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${psychologistImage})` }}
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="mb-2">
              Scientifically-Based Career Assessment
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Discover Your Optimal
              <br />
              Career Path
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive quiz that combines psychology, neuroscience, and behavioral science
              to determine your three most compatible career paths with deep personality insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={nextQuestion}
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
              >
                Start Your Assessment
              </Button>
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
                <p className="text-sm text-muted-foreground">
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
              Why This Assessment Is Different
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike simple personality tests, we dive deep into your authentic self
              using cutting-edge psychological research and unconventional insights.
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
                What Makes This Assessment Comprehensive
              </h2>
              <p className="text-lg text-muted-foreground">
                We go beyond traditional career assessments to understand the complete you
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
              <Button
                size="lg"
                onClick={nextQuestion}
                className="bg-primary hover:bg-primary/90 text-xl px-12 py-4"
              >
                Begin Assessment Now
              </Button>
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
            <p className="text-sm text-muted-foreground">
              Takes 45-60 minutes • No email required • Immediate results
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
