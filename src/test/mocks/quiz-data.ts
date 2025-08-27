import { QuizResults } from '@/types/quiz';

export const mockQuizResults: QuizResults = {
  answers: {
    'q1': 'option1',
    'q2': 'option2',
    'q3': 'option3',
  },
  scores: {
    'Software Development': 85,
    'Data Science': 75,
    'Product Management': 65,
  },
  topCareer: {
    title: 'Software Development',
    score: 85,
    description: 'Build applications and systems',
    skills: ['Programming', 'Problem Solving', 'Logic'],
    careerPath: {
      title: 'Software Development',
      description: 'Build applications and systems',
      skills: ['Programming', 'Problem Solving', 'Logic'],
      averageSalary: '$95,000',
      jobGrowth: '22%',
      workEnvironment: 'Office/Remote',
      education: "Bachelor's degree preferred",
      certifications: ['AWS', 'Google Cloud'],
      companies: ['Google', 'Microsoft', 'Apple'],
      dayInLife: [
        'Write and review code',
        'Debug applications',
        'Collaborate with team',
      ],
      careerProgression: [
        'Junior Developer',
        'Senior Developer',
        'Tech Lead',
      ],
    },
  },
  aiAnalysis: {
    summary: 'You show strong technical aptitude and problem-solving skills.',
    strengths: ['Analytical thinking', 'Technical skills', 'Problem solving'],
    recommendations: ['Consider learning new programming languages', 'Build a portfolio'],
    careerFit: 'Excellent fit for software development roles',
  },
  completedAt: new Date().toISOString(),
};

export const mockIncompleteResults = {
  answers: {
    'q1': 'option1',
  },
  scores: {},
  completedAt: new Date().toISOString(),
};

export const mockCorruptedResults = {
  invalid: 'data',
  missing: 'required fields',
};
