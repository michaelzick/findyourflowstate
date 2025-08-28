import { QuizResults } from '@/types/quiz';

export const mockQuizResults: QuizResults = {
  careerPaths: [
    {
      id: 'software-dev',
      title: 'Software Development',
      description: 'Build applications and systems',
      keyTraits: ['Programming', 'Problem Solving', 'Logic'],
      workEnvironment: 'Office/Remote',
      typicalRoles: ['Junior Developer', 'Senior Developer', 'Tech Lead'],
      strengths: ['Analytical thinking', 'Technical skills'],
      challenges: ['May overlook social dynamics'],
      score: 85,
      aiReasoning: 'Strong technical aptitude and problem-solving skills'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Analyze data to derive insights',
      keyTraits: ['Statistics', 'Analysis', 'Mathematics'],
      workEnvironment: 'Office/Remote',
      typicalRoles: ['Data Analyst', 'Data Scientist', 'ML Engineer'],
      strengths: ['Pattern recognition', 'Mathematical thinking'],
      challenges: ['Communication of complex ideas'],
      score: 75
    },
    {
      id: 'product-mgmt',
      title: 'Product Management',
      description: 'Guide product development and strategy',
      keyTraits: ['Strategy', 'Communication', 'Leadership'],
      workEnvironment: 'Office',
      typicalRoles: ['Associate PM', 'Senior PM', 'VP Product'],
      strengths: ['Strategic thinking', 'User focus'],
      challenges: ['Technical depth'],
      score: 65
    }
  ],
  personalityInsight: {
    strengths: ['Analytical thinking', 'Problem solving', 'Technical skills'],
    areasForGrowth: ['Social dynamics', 'Communication'],
    naturalTendencies: ['Detail-oriented', 'Methodical'],
    avoidanceAreas: ['High-pressure sales', 'Unstructured environments'],
    relationshipStyles: ['Independent collaborator', 'Direct communicator'],
    workingStyle: 'Systematic and detail-oriented',
    motivators: ['Problem solving', 'Continuous learning', 'Autonomy']
  },
  confidence: 85,
  aiAnalysis: {
    specificOccupations: [
      {
        title: 'Software Developer',
        category: 'Technology',
        fitScore: 95,
        reasoning: 'Strong technical aptitude and problem-solving skills'
      }
    ],
    hiddenBeliefs: {
      successBlockers: ['Perfectionism'],
      moneyBeliefs: ['Money comes from hard work'],
      fearPatterns: ['Fear of failure'],
      coreInsights: ['You value autonomy and creativity']
    },
    enhancedPersonality: {
      cognitiveStyle: 'Analytical and systematic',
      motivationalDrivers: ['Problem solving', 'Learning'],
      relationshipStyle: 'Independent collaborator',
      workEnvironmentNeeds: 'Quiet, focused environment'
    },
    deepAnalysis: {
      behavioralPatterns: ['Detail-oriented', 'Methodical'],
      unconsciousDrivers: ['Need for mastery'],
      blindSpots: ['May overlook social dynamics'],
      selfSabotagePatterns: ['Overthinking'],
      emotionalTriggers: ['Criticism'],
      decisionMakingStyle: 'Data-driven',
      stressResponse: 'Withdraw and analyze',
      conflictStyle: 'Avoidant initially',
      leadershipStyle: 'Lead by example',
      communicationStyle: 'Direct and factual'
    },
    lifePurpose: {
      coreContribution: 'Creating solutions to complex problems',
      meaningfulImpact: ['Improving efficiency', 'Solving technical challenges'],
      naturalGifts: ['Logical thinking', 'Pattern recognition'],
      worldNeeds: ['Better technology', 'Simplified processes'],
      purposeAlignment: 'High alignment with technology field',
      fulfillmentFactors: ['Continuous learning', 'Problem solving'],
      legacyVision: 'Leave behind robust, elegant solutions',
      spiritualDimension: 'Finding order in chaos',
      serviceOrientation: 'Serving through innovation'
    }
  },
  completedAt: new Date(),
};

export const mockIncompleteResults = {
  careerPaths: [],
  personalityInsight: {
    strengths: [],
    areasForGrowth: [],
    naturalTendencies: [],
    avoidanceAreas: [],
    relationshipStyles: [],
    workingStyle: '',
    motivators: []
  },
  confidence: 0,
  completedAt: new Date(),
};

export const mockCorruptedResults = {
  invalid: 'data',
  missing: 'required fields',
};
