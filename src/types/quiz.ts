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
  strengths: string[];
  challenges: string[];
  score?: number;
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

export interface QuizResults {
  careerPaths: CareerPath[];
  personalityInsight: PersonalityInsight;
  confidence: number;
  completedAt: Date;
}