import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Target, Clock, CheckCircle } from 'lucide-react';
import { useQuiz } from '@/contexts/QuizContext';
import quizHero from '@/assets/quiz-hero.jpg';

export function QuizLanding() {
  const { nextQuestion } = useQuiz();
  const navigate = useNavigate();

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
      title: "15-20 Minutes",
      description: "Comprehensive assessment that respects your time while being thorough"
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${quizHero})` }}
        />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="mb-4">
              Scientifically-Based Career Assessment
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Discover Your Optimal Career Path
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive quiz that combines psychology, neuroscience, and behavioral science
              to determine your 3 most compatible career paths—along with deep personality insights.
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
            <Button
              size="lg"
              onClick={nextQuestion}
              className="bg-primary hover:bg-primary/90 text-xl px-12 py-4"
            >
              Begin Assessment Now
            </Button>
            <p className="text-sm text-muted-foreground">
              Takes 15-20 minutes • No email required • Immediate results
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
