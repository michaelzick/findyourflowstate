export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  type: QuestionType;
  question: string;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: [string, string];
  required?: boolean;
  weight?: number;
}

export type QuestionCategory =
  | 'personality'
  | 'work_environment'
  | 'childhood_patterns'
  | 'media_preferences'
  | 'values_philosophy'
  | 'work_style'
  | 'relationships'
  | 'failures_dislikes'
  | 'flow_states'
  | 'motivations';

export type QuestionType =
  | 'multiple_choice'
  | 'scale'
  | 'text'
  | 'multi_select';

export interface QuizAnswer {
  questionId: string;
  value: string | number | string[];
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  keyTraits: string[];
  workEnvironment: string;
  typicalRoles: string[];
  specificOccupations?: string[];
  strengths: string[];
  challenges: string[];
  score?: number;
  aiReasoning?: string;
}

export interface PersonalityInsight {
  strengths: string[];
  areasForGrowth: string[];
  naturalTendencies: string[];
  avoidanceAreas: string[];
  relationshipStyles: string[];
  workingStyle: string;
  motivators: string[];
}

export interface SpecificOccupation {
  title: string;
  category: string;
  fitScore: number;
  reasoning: string;
}

export interface HiddenBeliefs {
  successBlockers: string[];
  moneyBeliefs: string[];
  fearPatterns: string[];
  coreInsights: string[];
}

export interface EnhancedPersonality {
  cognitiveStyle: string;
  motivationalDrivers: string[];
  relationshipStyle: string;
  workEnvironmentNeeds: string;
}

export interface DeepAnalysis {
  behavioralPatterns: string[];
  unconsciousDrivers: string[];
  blindSpots: string[];
  selfSabotagePatterns: string[];
  emotionalTriggers: string[];
  decisionMakingStyle: string;
  stressResponse: string;
  conflictStyle: string;
  leadershipStyle: string;
  communicationStyle: string;
}

export interface LifePurpose {
  coreContribution: string;
  meaningfulImpact: string[];
  naturalGifts: string[];
  worldNeeds: string[];
  purposeAlignment: string;
  fulfillmentFactors: string[];
  legacyVision: string;
  spiritualDimension: string;
  serviceOrientation: string;
}

export interface AIAnalysis {
  specificOccupations: SpecificOccupation[];
  hiddenBeliefs: HiddenBeliefs;
  enhancedPersonality: EnhancedPersonality;
  deepAnalysis: DeepAnalysis;
  lifePurpose: LifePurpose;
}

export interface QuizResults {
  careerPaths: CareerPath[];
  personalityInsight: PersonalityInsight;
  confidence: number;
  completedAt: Date;
  aiAnalysis?: AIAnalysis;
}
