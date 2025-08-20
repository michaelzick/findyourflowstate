import { QuizAnswer, CareerPath, PersonalityInsight, QuizResults } from '@/types/quiz';
import { careerPaths } from '@/data/career-paths';
import { quizQuestions } from '@/data/quiz-questions';

interface ScoringWeights {
  [careerId: string]: {
    [questionId: string]: number;
  };
}

// Sophisticated scoring weights based on psychological research
const scoringWeights: ScoringWeights = {
  creative_artist: {
    childhood_play: 2, // Building/Creating = high, other = lower
    flow_activities: 2, // Creative activities = high
    media_themes: 1.5, // Artistic expression = high
    invisible_work: 3, // Creative work = high
    perfect_world_contribution: 2, // Creating beautiful things = high
    hands_vs_knowledge: 1, // Either direction can work
    personality_energy_source: 1, // Often introverted
    information_processing: 1.5, // Patterns/possibilities = high
    work_environment_drain: 2, // Rigid environments = negative
    recognition_motivation: 1.5, // External recognition often matters
  },
  analytical_problem_solver: {
    childhood_play: 2, // Taking apart/puzzles = high
    flow_activities: 2, // Problem-solving activities = high
    media_themes: 1.5, // Innovation/mysteries = high
    perfect_world_contribution: 2, // Solving problems = high
    work_environment_energy: -1, // Often prefer independent work
    decision_making: 2, // Data analysis = high
    hands_vs_knowledge: 2, // Abstract concepts = high
    information_processing: 2, // Facts and details = high
    stress_response: 1.5, // Research/break down = high
  },
  people_catalyst: {
    childhood_play: 2, // Organizing games/performing = high
    childhood_environment: 1.5, // Social environments = high
    perfect_world_contribution: 2, // Helping people = high
    work_environment_energy: 2, // Team-based = high
    decision_making: 1.5, // Consensus building = high
    personality_energy_source: 1.5, // Often extroverted
    stress_response: 1.5, // Seek support = high
    conflict_style: 2, // Address directly/understand perspectives = high
    relationship_depth: 1, // Can work either way
  },
  systems_builder: {
    childhood_environment: 1.5, // Structured environments = high
    perfect_world_contribution: 2, // Building systems = high
    decision_making: 1.5, // Past examples/proven methods = high
    work_pace: 1.5, // Steady pace = high
    information_processing: 1.5, // Facts and details = high
    stress_response: 2, // Break down into steps = high
    legacy_desire: 1.5, // Building lasting things = high
  },
  hands_on_builder: {
    childhood_play: 3, // Building with blocks/taking apart = very high
    perfect_world_contribution: 1.5, // Building/creating = high
    hands_vs_knowledge: 3, // Physical materials = very high
    work_environment_drain: 2, // Isolation negative for some, positive for others
  },
  knowledge_seeker: {
    childhood_play: 2, // Reading/puzzles = high
    childhood_environment: 1.5, // Libraries = high
    media_themes: 1.5, // Mysteries/knowledge = high
    invisible_work: 2, // Research/learning = high
    perfect_world_contribution: 2, // Discovering knowledge = high
    hands_vs_knowledge: 2, // Abstract concepts = high
    personality_energy_source: 1, // Often introverted
    information_processing: 1, // Can be either
    recognition_motivation: -1, // Often internally motivated
  },
  service_helper: {
    perfect_world_contribution: 3, // Helping people = very high
    legacy_desire: 2, // Helping others grow = high
    work_environment_drain: 2, // Meaningless work = very negative
    conflict_style: 1.5, // Understanding perspectives = high
    relationship_depth: 1.5, // Often prefer deep connections
  },
  entrepreneur_innovator: {
    childhood_play: 1.5, // Leading activities = high
    media_themes: 2, // Innovation/building = high
    invisible_work: 2, // Creating/building = high
    perfect_world_contribution: 1.5, // Building/innovation = high
    decision_making: 1.5, // Creative possibilities = high
    work_pace: 1.5, // Intense bursts = high
    stress_response: 1.5, // Jump in and act = high
    recognition_motivation: 1.5, // Often motivated by recognition
  }
};

export function calculateQuizResults(answers: QuizAnswer[]): QuizResults {
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));
  const careerScores: { [key: string]: number } = {};
  
  // Initialize scores
  careerPaths.forEach(career => {
    careerScores[career.id] = 0;
  });

  // Calculate scores for each career path
  Object.entries(scoringWeights).forEach(([careerId, weights]) => {
    Object.entries(weights).forEach(([questionId, weight]) => {
      const answer = answerMap.get(questionId);
      if (answer !== undefined) {
        const score = calculateQuestionScore(questionId, answer, weight);
        careerScores[careerId] += score;
      }
    });
  });

  // Normalize scores to 0-100 range
  const maxScore = Math.max(...Object.values(careerScores));
  const minScore = Math.min(...Object.values(careerScores));
  const range = maxScore - minScore;

  Object.keys(careerScores).forEach(careerId => {
    if (range > 0) {
      careerScores[careerId] = Math.round(((careerScores[careerId] - minScore) / range) * 100);
    } else {
      careerScores[careerId] = 50; // Default if all scores are the same
    }
  });

  // Get top 3 career paths
  const rankedCareers = careerPaths
    .map(career => ({ ...career, score: careerScores[career.id] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Generate personality insights
  const personalityInsight = generatePersonalityInsights(answers, answerMap);

  // Calculate confidence based on score distribution
  const topScore = rankedCareers[0].score;
  const secondScore = rankedCareers[1].score;
  const confidence = Math.min(100, Math.max(60, topScore - secondScore + 70));

  return {
    careerPaths: rankedCareers,
    personalityInsight,
    confidence,
    completedAt: new Date()
  };
}

function calculateQuestionScore(questionId: string, answer: string | number | string[], weight: number): number {
  const question = quizQuestions.find(q => q.id === questionId);
  if (!question) return 0;

  let baseScore = 0;

  switch (question.type) {
    case 'multiple_choice':
      baseScore = getMultipleChoiceScore(questionId, answer as string);
      break;
    case 'scale':
      baseScore = getScaleScore(questionId, answer as number);
      break;
    case 'multi_select':
      baseScore = getMultiSelectScore(questionId, answer as string[]);
      break;
    case 'text':
      baseScore = getTextScore(questionId, answer as string);
      break;
  }

  return baseScore * weight;
}

function getMultipleChoiceScore(questionId: string, answer: string): number {
  // Scoring logic for specific questions
  const scoringRules: { [key: string]: { [key: string]: number } } = {
    childhood_play: {
      "Building things with blocks, Lego, or found objects": 5,
      "Creating stories, drawing, or imaginative role-play": 4,
      "Organizing games with friends or leading group activities": 3,
      "Taking things apart to see how they worked": 5,
      "Performing for others - singing, dancing, or acting": 4,
      "Reading books and getting lost in other worlds": 3,
      "Competing in sports or physical challenges": 2,
      "Solving puzzles, riddles, or brain teasers": 4
    },
    perfect_world_contribution: {
      "Creating beautiful things that inspire and move people": 5,
      "Solving complex problems that improve how things work": 5,
      "Helping people overcome challenges and reach their potential": 5,
      "Building systems and organizations that serve others": 4,
      "Discovering new knowledge or pushing boundaries of understanding": 4,
      "Bringing people together and fostering community": 4,
      "Protecting and preserving what's valuable for future generations": 3,
      "Teaching and sharing knowledge with others": 4
    }
  };

  return scoringRules[questionId]?.[answer] || 3; // Default neutral score
}

function getScaleScore(questionId: string, answer: number): number {
  // Scale scores are already numeric, normalize to 1-5 range
  return answer;
}

function getMultiSelectScore(questionId: string, answers: string[]): number {
  // Average score for selected options
  return answers.length > 0 ? 3 : 1; // Basic implementation
}

function getTextScore(questionId: string, answer: string): number {
  // Basic text analysis - could be enhanced with NLP
  const creativityKeywords = ['create', 'art', 'design', 'music', 'write', 'imagine', 'beautiful'];
  const analyticalKeywords = ['solve', 'analyze', 'data', 'logic', 'system', 'problem', 'research'];
  const peopleKeywords = ['help', 'teach', 'team', 'people', 'community', 'relationship'];
  
  const lowerAnswer = answer.toLowerCase();
  let score = 3; // Base score
  
  creativityKeywords.forEach(keyword => {
    if (lowerAnswer.includes(keyword)) score += 0.5;
  });
  
  analyticalKeywords.forEach(keyword => {
    if (lowerAnswer.includes(keyword)) score += 0.5;
  });
  
  peopleKeywords.forEach(keyword => {
    if (lowerAnswer.includes(keyword)) score += 0.5;
  });
  
  return Math.min(5, score);
}

function generatePersonalityInsights(answers: QuizAnswer[], answerMap: Map<string, string | number | string[]>): PersonalityInsight {
  const insights: PersonalityInsight = {
    strengths: [],
    areasForGrowth: [],
    naturalTendencies: [],
    avoidanceAreas: [],
    relationshipStyles: [],
    workingStyle: '',
    motivators: []
  };

  // Analyze personality patterns
  const energySource = answerMap.get('personality_energy_source') as number;
  const informationProcessing = answerMap.get('information_processing') as number;
  const workEnvironmentPref = answerMap.get('work_environment_energy') as number;
  const relationshipDepth = answerMap.get('relationship_depth') as number;
  const commitmentStyle = answerMap.get('commitment_style') as string;

  // Energy source analysis
  if (energySource <= 3) {
    insights.strengths.push('Deep focus and independent thinking');
    insights.strengths.push('Self-directed work ethic and internal motivation');
    insights.strengths.push('Thoughtful analysis before making decisions');
    insights.naturalTendencies.push('Prefers quiet reflection and solo work time');
    insights.naturalTendencies.push('Processes information internally before sharing');
    insights.naturalTendencies.push('Values depth over breadth in relationships and projects');
    insights.workingStyle = 'Independent contributor who produces best work with minimal interruptions. You prefer structured environments where you can dive deep into projects, work at your own pace, and have control over your schedule. You excel when given clear objectives and the autonomy to determine how to achieve them.';
    insights.areasForGrowth.push('Developing comfort with spontaneous collaboration');
    insights.areasForGrowth.push('Building skills in real-time brainstorming and group ideation');
  } else {
    insights.strengths.push('Strong collaboration and interpersonal skills');
    insights.strengths.push('Natural ability to energize and motivate teams');
    insights.strengths.push('Quick adaptation to changing social dynamics');
    insights.naturalTendencies.push('Energized by social interaction and team dynamics');
    insights.naturalTendencies.push('Thinks out loud and processes ideas through discussion');
    insights.naturalTendencies.push('Seeks variety and stimulation in work environments');
    insights.workingStyle = 'Team player who thrives in collaborative environments. You perform best in dynamic settings with regular interaction, feedback, and the opportunity to bounce ideas off others. You excel in roles that involve presenting, networking, and building relationships across different groups.';
    insights.areasForGrowth.push('Developing patience for detailed, solitary work');
    insights.areasForGrowth.push('Building tolerance for extended periods of independent focus');
  }

  // Information processing
  if (informationProcessing <= 3) {
    insights.strengths.push('Attention to detail and practical problem-solving');
    insights.strengths.push('Systematic approach to complex challenges');
    insights.naturalTendencies.push('Focuses on concrete facts and proven methods');
    insights.naturalTendencies.push('Prefers step-by-step implementation over abstract theorizing');
    insights.areasForGrowth.push('Expanding comfort with ambiguous or incomplete information');
    insights.areasForGrowth.push('Developing tolerance for experimental or unproven approaches');
  } else {
    insights.strengths.push('Big-picture thinking and innovation');
    insights.strengths.push('Pattern recognition and future-oriented planning');
    insights.naturalTendencies.push('Sees patterns and future possibilities');
    insights.naturalTendencies.push('Enjoys conceptual work and theoretical exploration');
    insights.areasForGrowth.push('Improving attention to practical implementation details');
    insights.areasForGrowth.push('Developing patience for routine or repetitive tasks');
  }

  // Work environment preferences
  if (workEnvironmentPref <= 3) {
    insights.avoidanceAreas.push('Open offices with constant interruptions');
    insights.avoidanceAreas.push('Roles requiring extensive networking or schmoozing');
    insights.avoidanceAreas.push('High-pressure social environments with politics');
  } else {
    insights.avoidanceAreas.push('Isolated work with minimal human contact');
    insights.avoidanceAreas.push('Highly independent roles without team interaction');
    insights.avoidanceAreas.push('Repetitive tasks without social stimulation');
  }

  // Relationship insights
  if (relationshipDepth <= 3) {
    insights.relationshipStyles.push('Prefers few, deep, meaningful connections over broad social networks');
    insights.relationshipStyles.push('Values emotional intimacy and authentic communication');
    insights.relationshipStyles.push('Seeks partners who appreciate thoughtful, consistent commitment');
    if (commitmentStyle === 'Deep, exclusive partnership with one person') {
      insights.relationshipStyles.push('Monogamous relationship style likely suits your desire for deep, focused connection');
    }
  } else {
    insights.relationshipStyles.push('Enjoys variety in social connections and experiences');
    insights.relationshipStyles.push('Thrives with multiple types of relationships serving different needs');
    insights.relationshipStyles.push('Values freedom and flexibility in relationship structures');
    if (commitmentStyle === 'Multiple meaningful connections with different people') {
      insights.relationshipStyles.push('Non-monogamous or polyamorous styles may align with your need for variety and stimulation');
    }
  }

  // Enhanced motivator analysis
  const recognitionMotivation = answerMap.get('recognition_motivation') as number;
  const workPace = answerMap.get('work_pace') as number;
  const legacyDesire = answerMap.get('legacy_desire') as string;
  
  if (recognitionMotivation <= 3) {
    insights.motivators.push('Internal satisfaction and personal growth');
    insights.motivators.push('Meaningful work aligned with personal values');
    insights.motivators.push('Mastery and continuous skill development');
  } else {
    insights.motivators.push('Recognition and appreciation from others');
    insights.motivators.push('Visible impact and achievement');
    insights.motivators.push('Status and professional advancement');
  }
  
  if (workPace && workPace <= 3) {
    insights.motivators.push('Sustainable work-life balance and steady progress');
  } else if (workPace && workPace >= 4) {
    insights.motivators.push('Challenging deadlines and high-energy projects');
  }
  
  if (legacyDesire === 'Building lasting systems, institutions, or works that outlive you') {
    insights.motivators.push('Creating lasting impact and meaningful legacy');
  } else if (legacyDesire === 'Helping others grow, succeed, and reach their potential') {
    insights.motivators.push('Mentoring others and contributing to their success');
  }

  return insights;
}