import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, PlayCircle, Brain, Target, Users, Building, Hammer, BookOpen, Heart, Lightbulb } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

const LearnMore = () => {
  useScrollToTop();
  const careerPaths = [
    { name: "Creative Artist", icon: "🎨", description: "Expression through creative mediums and artistic vision" },
    { name: "Analytical Problem Solver", icon: "🔬", description: "Data-driven analysis and systematic problem solving" },
    { name: "People Catalyst", icon: "👥", description: "Inspiring and developing others to reach their potential" },
    { name: "Systems Builder", icon: "🏗️", description: "Creating efficient processes and organizational structures" },
    { name: "Hands-On Builder", icon: "🔧", description: "Crafting tangible solutions and physical creations" },
    { name: "Knowledge Seeker", icon: "📚", description: "Continuous learning and sharing of expertise" },
    { name: "Service Helper", icon: "❤️", description: "Supporting others and contributing to community wellbeing" },
    { name: "Entrepreneur Innovator", icon: "💡", description: "Creating new opportunities and driving innovation" }
  ];

  const assessmentCategories = [
    {
      title: "Childhood Patterns",
      description: "How your early preferences shaped your natural inclinations",
      details: "Research shows that childhood play preferences strongly predict adult career satisfaction"
    },
    {
      title: "Media & Entertainment",
      description: "What themes and content naturally draw your attention",
      details: "Our entertainment choices reflect our values, interests, and cognitive preferences"
    },
    {
      title: "Work Environment",
      description: "Physical and social settings where you thrive",
      details: "Environmental preferences significantly impact productivity and job satisfaction"
    },
    {
      title: "Decision Making",
      description: "How you process information and make choices",
      details: "Decision-making style is a core predictor of career fit and leadership potential"
    },
    {
      title: "Social Interaction",
      description: "Your preferred ways of connecting and collaborating",
      details: "Understanding social preferences helps identify optimal team dynamics and roles"
    },
    {
      title: "Problem Solving",
      description: "Your natural approach to challenges and obstacles",
      details: "Problem-solving style determines which types of work will feel energizing vs. draining"
    },
    {
      title: "Values & Motivation",
      description: "What drives you and gives your work meaning",
      details: "Alignment between personal values and work content is crucial for long-term satisfaction"
    },
    {
      title: "Future Vision",
      description: "How you think about goals, growth, and legacy",
      details: "Future orientation and goal-setting preferences guide career trajectory decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment
            </Link>
            <Link to="/">
              <Button size="lg" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Understanding Your Career Assessment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A comprehensive guide to our methodology, what we measure, and how we help you discover your ideal career path.
          </p>
          <Link to="/">
            <Button size="lg" className="gap-2">
              <PlayCircle className="h-5 w-5" />
              Take the Assessment Now
            </Button>
          </Link>
        </div>

        {/* Scientific Methodology */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Scientific Foundation</CardTitle>
              </div>
              <CardDescription>
                Our assessment is built on decades of psychological and behavioral science research
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Psychological Foundations</h4>
                <p className="text-muted-foreground mb-4">
                  Our methodology integrates established psychological frameworks including trait theory, 
                  cognitive-behavioral patterns, and intrinsic motivation research. We draw from the work 
                  of leading researchers in personality psychology, occupational health, and career development.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Trait-Based Assessment</h5>
                    <p className="text-sm text-muted-foreground">
                      Measures stable personality characteristics that predict long-term career satisfaction
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Behavioral Patterns</h5>
                    <p className="text-sm text-muted-foreground">
                      Analyzes how you naturally approach work, relationships, and problem-solving
                    </p>
                  </Card>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Holistic Approach</h4>
                <p className="text-muted-foreground">
                  Unlike traditional assessments that focus solely on skills or preferences, we examine the 
                  full spectrum of factors that influence career fulfillment: your natural tendencies, 
                  core values, working style preferences, relationship patterns, and intrinsic motivators.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Beyond Traditional Tests</h4>
                <p className="text-muted-foreground">
                  While we respect established frameworks like MBTI and DISC, our assessment goes deeper by 
                  examining unconscious preferences through childhood patterns, media consumption, and 
                  philosophical orientations that reveal authentic personality traits.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Assessment Categories */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">What We Measure</CardTitle>
              </div>
              <CardDescription>
                Eight core dimensions that shape your ideal career path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {assessmentCategories.map((category, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-semibold mb-2">{category.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <p className="text-xs text-muted-foreground italic">{category.details}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Career Path Framework */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Career Path Framework</CardTitle>
              </div>
              <CardDescription>
                Eight distinct career archetypes based on psychological research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {careerPaths.map((path, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <h4 className="font-semibold mb-1">{path.name}</h4>
                        <p className="text-sm text-muted-foreground">{path.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">How We Calculate Your Fit</h4>
                <p className="text-muted-foreground mb-4">
                  Your responses are weighted across multiple dimensions to calculate compatibility percentages 
                  for each career path. We show your top 3 matches to provide focused, actionable guidance 
                  rather than overwhelming you with options.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">8</div>
                    <p className="text-sm text-muted-foreground">Question Categories</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">3</div>
                    <p className="text-sm text-muted-foreground">Top Recommendations</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">24</div>
                    <p className="text-sm text-muted-foreground">Assessment Questions</p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Scoring System */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Scoring Methodology</CardTitle>
              </div>
              <CardDescription>
                How we calculate your results and personality insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Weighted Response Analysis</h4>
                <p className="text-muted-foreground mb-4">
                  Each question is carefully weighted based on its predictive power for specific career paths. 
                  Some questions carry more influence because research shows they're stronger indicators 
                  of career satisfaction and success.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Personality Profile Generation</h4>
                <p className="text-muted-foreground mb-4">
                  Your personality insights are generated by analyzing patterns across your responses. 
                  We identify your natural strengths, growth areas, working style preferences, motivators, 
                  and relationship patterns using validated psychological principles.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Badge variant="secondary">Your Strengths (5 insights)</Badge>
                    <Badge variant="secondary">Areas for Growth (5 insights)</Badge>
                    <Badge variant="secondary">Working Style Analysis</Badge>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Motivation Drivers</Badge>
                    <Badge variant="secondary">Natural Tendencies</Badge>
                    <Badge variant="secondary">Relationship Insights</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Why We Ask Unconventional Questions</h4>
                <p className="text-muted-foreground">
                  Questions about childhood play, media preferences, and philosophical scenarios reveal 
                  authentic personality traits that people might not recognize in themselves. These indirect 
                  measures often provide more accurate insights than direct self-reporting.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">How accurate is this assessment?</h4>
                <p className="text-muted-foreground">
                  Our assessment is designed to provide directional guidance based on established psychological 
                  principles. While no assessment can predict your future with certainty, our methodology 
                  has been refined to maximize relevance and actionable insights.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">How long does it take to complete?</h4>
                <p className="text-muted-foreground">
                  The assessment typically takes 10-15 minutes to complete. We've designed it to be 
                  comprehensive yet respectful of your time, with 24 carefully selected questions 
                  that maximize insight while minimizing assessment fatigue.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Can I retake the assessment?</h4>
                <p className="text-muted-foreground">
                  Yes, you can retake the assessment at any time. Your responses aren't stored, so each 
                  session is independent. However, for the most accurate results, we recommend answering 
                  based on your genuine first instincts.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">What if I don't agree with my results?</h4>
                <p className="text-muted-foreground">
                  Assessment results are starting points for self-reflection, not definitive answers. 
                  If results don't resonate, consider what aspects feel accurate and which don't. 
                  Sometimes unexpected results reveal blind spots or growth opportunities.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">How should I use these results?</h4>
                <p className="text-muted-foreground">
                  Use your results as a framework for exploring career options, understanding your work 
                  preferences, and identifying development areas. Combine these insights with your 
                  experience, skills, and circumstances to make informed career decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Privacy & Data Protection - Placed Last */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Privacy & Data Protection</CardTitle>
              </div>
              <CardDescription>
                Your privacy is our priority - here's exactly how we handle your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Zero Data Collection</h4>
                <p className="text-muted-foreground mb-4">
                  We do not collect, store, or transmit any of your quiz responses or personal information. 
                  All processing happens locally in your browser, and your answers never leave your device 
                  unless you choose to export them.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <h5 className="font-medium mb-2 text-green-800 dark:text-green-200">✓ What We DON'T Do</h5>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Store your responses</li>
                      <li>• Track your behavior</li>
                      <li>• Share data with third parties</li>
                      <li>• Require account creation</li>
                    </ul>
                  </Card>
                  <Card className="p-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-200">✓ What We DO</h5>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Process locally in your browser</li>
                      <li>• Generate results instantly</li>
                      <li>• Let you export your own data</li>
                      <li>• Respect your complete privacy</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Local Processing Only</h4>
                <p className="text-muted-foreground">
                  All assessment calculations, scoring, and result generation happen entirely within your 
                  web browser using JavaScript. Your responses are processed in real-time on your device 
                  and are never transmitted to our servers or any external services.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Export Options</h4>
                <p className="text-muted-foreground mb-4">
                  You have complete control over your results. You can:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Download a comprehensive PDF report with all styling preserved</li>
                  <li>Copy detailed text results to your clipboard for sharing</li>
                  <li>Save results to your device for future reference</li>
                  <li>Choose what information to share and with whom</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Technical Transparency</h4>
                <p className="text-muted-foreground">
                  Our assessment runs entirely as client-side code with no backend database or user 
                  tracking systems. We use standard web technologies (React, TypeScript) that process 
                  your responses locally and generate results without any external communication.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Questions About Privacy?</h4>
                <p className="text-muted-foreground">
                  We believe in complete transparency about data handling. If you have any questions 
                  about how we protect your privacy or handle your information, we're happy to provide 
                  detailed technical explanations of our privacy-first approach.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Career Path?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Now that you understand our methodology, take the assessment to uncover insights about 
            your ideal career path, working style, and professional strengths.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                Start Your Assessment
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;