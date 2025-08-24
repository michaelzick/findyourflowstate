import { QuizAnswer, CareerPath, QuizResults, PersonalityInsight, AIAnalysis } from '../types/quiz';
import { quizQuestions } from '../data/quiz-questions';
import { careerPaths } from '../data/career-paths';
import { analyzeQuizWithAI } from '../services/aiAnalysis';

interface ScoringWeights {
  [careerId: string]: {
    [questionId: string]: number;
  };
}

// Enhanced scoring weights based on psychological research and personality patterns
const scoringWeights: ScoringWeights = {
  creative_artist: {
    childhood_play: 2.5,
    childhood_environment: 2, 
    flow_activities: 3,
    media_themes: 2,
    invisible_work: 3,
    perfect_world_contribution: 3,
    work_environment_energy: 1,
    decision_making: 1.5,
    hands_vs_knowledge: 1,
    personality_energy_source: 1.5,
    information_processing: 2,
    stress_response: 1.5,
    work_environment_drain: 2,
    legacy_desire: 2.5,
    recognition_motivation: 2,
    relationship_depth: 1,
    conflict_style: 1
  },
  analytical_problem_solver: {
    childhood_play: 3, // Taking apart/puzzles = very high
    childhood_environment: 2,
    flow_activities: 2.5,
    media_themes: 2,
    invisible_work: 2.5,
    perfect_world_contribution: 3, // Solving problems = very high
    work_environment_energy: -2, // NEGATIVE - prefers independent work
    decision_making: 3, // Data analysis = very high
    work_pace: 1.5,
    hands_vs_knowledge: 2.5, // Abstract concepts = high
    personality_energy_source: -1.5, // NEGATIVE - often introverted
    information_processing: 2.5, // Both facts AND patterns important
    stress_response: 3, // Research/break down = very high
    work_environment_drain: 1.5,
    legacy_desire: 2,
    recognition_motivation: -1, // NEGATIVE - often internally motivated
    relationship_depth: -1, // NEGATIVE - prefers fewer, deeper connections
    conflict_style: 2
  },
  people_catalyst: {
    childhood_play: 2.5,
    childhood_environment: 2.5,
    flow_activities: 2,
    media_themes: 1.5,
    invisible_work: 2,
    perfect_world_contribution: 3, // Helping people = very high
    work_environment_energy: 3, // Team-based = very high
    decision_making: 2.5, // Consensus building = high
    work_pace: 1.5,
    hands_vs_knowledge: 1,
    personality_energy_source: 2.5, // Often extroverted
    information_processing: 1,
    stress_response: 2, // Seek support = high
    work_environment_drain: 2,
    legacy_desire: 2.5,
    recognition_motivation: 1.5,
    relationship_depth: 2, // Many connections
    conflict_style: 2.5
  },
  systems_builder: {
    childhood_play: 2,
    childhood_environment: 2.5, // Structured environments = high
    flow_activities: 2,
    media_themes: 1.5,
    invisible_work: 2,
    perfect_world_contribution: 2.5, // Building systems = high
    work_environment_energy: 1,
    decision_making: 2.5, // Past examples/proven methods = high
    work_pace: 2.5, // Steady pace = high
    hands_vs_knowledge: 1.5,
    personality_energy_source: 1,
    information_processing: -2, // NEGATIVE - prefers facts over patterns
    stress_response: 3, // Break down into steps = very high
    work_environment_drain: 2,
    legacy_desire: 3, // Building lasting things = very high
    recognition_motivation: 1,
    relationship_depth: 1,
    conflict_style: 1.5
  },
  hands_on_builder: {
    childhood_play: 3, // Building with blocks/taking apart = very high
    childhood_environment: 2,
    flow_activities: 2.5,
    media_themes: 1,
    invisible_work: 2,
    perfect_world_contribution: 2, // Building/creating = high
    work_environment_energy: -1.5, // NEGATIVE - often prefer independent
    decision_making: 1.5,
    work_pace: 1.5,
    hands_vs_knowledge: 3, // Physical materials = very high
    personality_energy_source: -1, // NEGATIVE - often introverted
    information_processing: -1.5, // NEGATIVE - prefer concrete over abstract
    stress_response: 2,
    work_environment_drain: 1.5,
    legacy_desire: 2,
    recognition_motivation: 1,
    relationship_depth: -1,
    conflict_style: 1
  },
  knowledge_seeker: {
    childhood_play: 2.5, // Reading/puzzles = high
    childhood_environment: 2.5, // Libraries = high
    flow_activities: 3,
    media_themes: 2, // Mysteries/knowledge = high
    invisible_work: 3, // Research/learning = very high
    perfect_world_contribution: 3, // Discovering knowledge = very high
    work_environment_energy: -2, // NEGATIVE - prefer independent work
    decision_making: 2.5,
    work_pace: 1.5,
    hands_vs_knowledge: 2.5, // Abstract concepts = high
    personality_energy_source: -2, // NEGATIVE - strongly introverted
    information_processing: 2, // Both facts and patterns
    stress_response: 3, // Research = very high
    work_environment_drain: 2,
    legacy_desire: 2.5,
    recognition_motivation: -2, // NEGATIVE - strongly internally motivated
    relationship_depth: -1.5, // NEGATIVE - prefer deep connections
    conflict_style: 1.5
  },
  service_helper: {
    childhood_play: 1.5,
    childhood_environment: 2,
    flow_activities: 2,
    media_themes: 1.5,
    invisible_work: 2.5,
    perfect_world_contribution: 3, // Helping people = very high
    work_environment_energy: 2,
    decision_making: 2,
    work_pace: 1.5,
    hands_vs_knowledge: 1,
    personality_energy_source: 1.5,
    information_processing: 1,
    stress_response: 2,
    work_environment_drain: 3, // Meaningless work = very negative
    legacy_desire: 3, // Helping others grow = very high
    recognition_motivation: 1,
    relationship_depth: 1.5,
    conflict_style: 2.5 // Understanding perspectives = high
  },
  entrepreneur_innovator: {
    childhood_play: 2,
    childhood_environment: 1.5,
    flow_activities: 2.5,
    media_themes: 2.5, // Innovation/building = high
    invisible_work: 2.5, // Creating/building = high
    perfect_world_contribution: 2,
    work_environment_energy: 2,
    decision_making: 2, // Creative possibilities = high
    work_pace: 2.5, // Intense bursts = high
    hands_vs_knowledge: 1.5,
    personality_energy_source: 2, // Often extroverted
    information_processing: 2, // Patterns/possibilities = high
    stress_response: 2.5, // Jump in and act = high
    work_environment_drain: 2,
    legacy_desire: 2,
    recognition_motivation: 2.5, // Often motivated by recognition
    relationship_depth: 1.5,
    conflict_style: 2
  }
};

export async function calculateQuizResults(answers: QuizAnswer[], includeAI: boolean = true): Promise<QuizResults> {
  console.log('🎯 Starting enhanced quiz scoring with', answers.length, 'answers');
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));
  const careerScores: { [key: string]: number } = {};
  const debugScoring: { [key: string]: { [key: string]: number } } = {};
  
  // Initialize scores and debug tracking
  careerPaths.forEach(career => {
    careerScores[career.id] = 0;
    debugScoring[career.id] = {};
  });

  // Calculate scores for each career path
  Object.entries(scoringWeights).forEach(([careerId, weights]) => {
    console.log(`\n📊 Calculating scores for ${careerId}:`);
    Object.entries(weights).forEach(([questionId, weight]) => {
      const answer = answerMap.get(questionId);
      if (answer !== undefined) {
        const score = calculateQuestionScore(questionId, answer, weight);
        careerScores[careerId] += score;
        debugScoring[careerId][questionId] = score;
        console.log(`   ${questionId}: ${answer} -> ${score.toFixed(2)} (weight: ${weight})`);
      }
    });
    console.log(`   Total for ${careerId}: ${careerScores[careerId].toFixed(2)}`);
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

  // Add AI analysis (non-blocking with detailed logging)
  let aiAnalysis = null;
  if (includeAI) {
    console.log('🔄 Starting AI analysis with enhanced logging...');
    console.log('📝 Input data for AI:', { 
      answersCount: answers.length, 
      topCareerPathsCount: rankedCareers.length,
      sampleAnswers: answers.slice(0, 3).map(a => ({ id: a.questionId, hasValue: !!a.value }))
    });
    
    try {
      console.log('🎯 Attempting AI analysis...');
      aiAnalysis = await analyzeQuizWithAI(answers, rankedCareers);
      console.log('✅ AI analysis successful!');
    } catch (error) {
      console.error('⚠️ AI analysis failed, continuing without it:', error);
      throw error; // Re-throw for proper handling in the UI
    }
  }

  return {
    careerPaths: rankedCareers,
    personalityInsight,
    confidence,
    completedAt: new Date(),
    aiAnalysis
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
  // Enhanced scoring logic for multiple choice questions
  const scoringRules: { [key: string]: { [key: string]: number } } = {
    childhood_play: {
      "Building things with blocks, Lego, or found objects": 4, // hands_on_builder, systems_builder
      "Creating stories, drawing, or imaginative role-play": 5, // creative_artist
      "Organizing games with friends or leading group activities": 4, // people_catalyst, entrepreneur
      "Taking things apart to see how they worked": 5, // analytical_problem_solver, knowledge_seeker
      "Performing for others - singing, dancing, or acting": 5, // creative_artist, people_catalyst
      "Reading books and getting lost in other worlds": 5, // knowledge_seeker
      "Competing in sports or physical challenges": 2, // lower for analytical careers
      "Solving puzzles, riddles, or brain teasers": 5 // analytical_problem_solver, knowledge_seeker
    },
    childhood_environment: {
      "Quiet spaces where I could focus deeply on projects": 5, // analytical, knowledge_seeker, creative_artist
      "Busy, social environments with lots of people around": 2, // negative for analytical
      "Outdoor spaces where I could explore and move freely": 3,
      "Structured environments with clear rules and expectations": 4, // systems_builder
      "Creative spaces with art supplies and materials to experiment": 5, // creative_artist
      "Libraries or places filled with books and knowledge": 5, // knowledge_seeker
      "Workshops or garages with tools and mechanical things": 5 // hands_on_builder
    },
    perfect_world_contribution: {
      "Creating beautiful things that inspire and move people": 5, // creative_artist
      "Solving complex problems that improve how things work": 5, // analytical_problem_solver
      "Helping people overcome challenges and reach their potential": 5, // people_catalyst, service_helper
      "Building systems and organizations that serve others": 5, // systems_builder
      "Discovering new knowledge or pushing boundaries of understanding": 5, // knowledge_seeker
      "Bringing people together and fostering community": 4, // people_catalyst
      "Protecting and preserving what's valuable for future generations": 3,
      "Teaching and sharing knowledge with others": 4 // service_helper, knowledge_seeker
    },
    decision_making: {
      "Analyze all available data and consider logical outcomes": 5, // analytical_problem_solver
      "Trust my intuition and gut feelings": 3, // creative_artist
      "Seek input from others and build consensus": 4, // people_catalyst
      "Consider the impact on people's feelings and relationships": 4, // service_helper
      "Look at past examples and proven methods": 5, // systems_builder
      "Think about creative possibilities and potential innovations": 4, // entrepreneur_innovator, creative_artist
      "Focus on what aligns with my core values and principles": 3
    },
    stress_response: {
      "Break it down into smaller, manageable steps": 5, // analytical_problem_solver, systems_builder
      "Seek support and advice from others": 4, // people_catalyst
      "Take time alone to think through all angles": 5, // knowledge_seeker, analytical_problem_solver
      "Jump in and start taking action immediately": 4, // entrepreneur_innovator
      "Look for creative or unconventional solutions": 4, // creative_artist
      "Research and gather as much information as possible": 5, // knowledge_seeker
      "Focus on how it affects the people involved": 4 // service_helper
    },
    legacy_desire: {
      "Having created something beautiful that continues to inspire others": 5, // creative_artist
      "Having solved important problems that made life better for many": 5, // analytical_problem_solver
      "Having helped people discover their potential and grow": 5, // service_helper
      "Having built something lasting that serves future generations": 5, // systems_builder
      "Having pushed the boundaries of human knowledge or capability": 5, // knowledge_seeker
      "Having brought people together across differences": 4, // people_catalyst
      "Having stood up for justice and equality": 4, // service_helper
      "Having been a source of wisdom and guidance for others": 4 // service_helper
    },
    conflict_style: {
      "Address it head-on and work through it directly": 4, // people_catalyst
      "Take time to process before engaging": 4, // analytical, introverted types
      "Seek to understand all perspectives first": 5, // service_helper, people_catalyst
      "Look for creative solutions that work for everyone": 4, // creative_artist
      "Focus on maintaining harmony and relationships": 4, // service_helper
      "Stick to logical facts and objective analysis": 5, // analytical_problem_solver
      "Avoid it if possible and hope it resolves naturally": 2 // generally negative
    },
    commitment_style: {
      "Deep, exclusive partnership with one person": 4, // introverted types
      "Multiple meaningful connections with different people": 3,
      "Close friendships with romantic connections as they develop naturally": 3,
      "Community-oriented with many caring relationships": 4, // people_catalyst
      "Independent with periodic deep connections": 4, // knowledge_seeker, analytical
      "Flexible arrangements based on life circumstances": 3
    }
  };

  return scoringRules[questionId]?.[answer] || 3; // Default neutral score
}

function getScaleScore(questionId: string, answer: number): number {
  // Enhanced scale scoring that considers what each direction means for different careers
  // Scale questions use 1-7 range, we need to map them appropriately
  
  const scaleScoring: { [key: string]: (score: number) => number } = {
    // Low scores (1-3) = introverted, high scores (5-7) = extroverted
    personality_energy_source: (score: number) => score, // Direct mapping
    
    // Low scores (1-3) = facts/details, high scores (5-7) = patterns/possibilities  
    information_processing: (score: number) => score, // Direct mapping
    
    // Low scores (1-3) = independent work, high scores (5-7) = collaborative work
    work_environment_energy: (score: number) => score, // Direct mapping
    
    // Low scores (1-3) = few deep connections, high scores (5-7) = many light connections
    relationship_depth: (score: number) => score, // Direct mapping
    
    // Low scores (1-3) = steady pace, high scores (5-7) = intense bursts
    work_pace: (score: number) => score, // Direct mapping
    
    // Low scores (1-3) = physical materials, high scores (5-7) = abstract concepts
    hands_vs_knowledge: (score: number) => score, // Direct mapping
    
    // Low scores (1-3) = internal satisfaction, high scores (5-7) = external recognition
    recognition_motivation: (score: number) => score // Direct mapping
  };
  
  const scoringFunction = scaleScoring[questionId];
  if (scoringFunction) {
    return scoringFunction(answer);
  }
  
  // Default: return normalized score (1-7 -> 1-5 range)
  return ((answer - 1) / 6) * 4 + 1;
}

function getMultiSelectScore(questionId: string, answers: string[]): number {
  // Average score for selected options
  return answers.length > 0 ? 3 : 1; // Basic implementation
}

function getTextScore(questionId: string, answer: string): number {
  if (!answer || answer.trim().length === 0) return 3;
  
  const lowerAnswer = answer.toLowerCase();
  
  // Career-specific keyword analysis with weighted scoring
  const careerKeywords = {
    analytical_problem_solver: {
      high: ['solve', 'analyze', 'data', 'logic', 'system', 'problem', 'research', 'math', 'science', 'algorithm', 'debug', 'figure out', 'understand', 'calculate', 'method', 'process', 'technical', 'engineering', 'programming', 'code', 'formula', 'theory'],
      medium: ['think', 'reason', 'study', 'learn', 'investigate', 'discover'],
      negative: ['feeling', 'emotion', 'intuition', 'creative', 'artistic']
    },
    knowledge_seeker: {
      high: ['learn', 'research', 'study', 'read', 'discover', 'understand', 'explore', 'investigate', 'knowledge', 'books', 'theory', 'academic', 'science', 'history', 'philosophy', 'literature'],
      medium: ['think', 'analyze', 'question', 'curious', 'wonder'],
      negative: ['practical', 'hands-on', 'physical']
    },
    creative_artist: {
      high: ['create', 'art', 'design', 'music', 'write', 'imagine', 'beautiful', 'aesthetic', 'visual', 'creative', 'artistic', 'express', 'beauty', 'inspiration', 'painting', 'drawing', 'story', 'novel'],
      medium: ['feel', 'emotion', 'passion', 'inspiration'],
      negative: ['data', 'logic', 'systematic', 'analytical']
    },
    people_catalyst: {
      high: ['help', 'teach', 'team', 'people', 'community', 'relationship', 'collaborate', 'mentor', 'coach', 'support', 'guide', 'connect', 'social', 'communication'],
      medium: ['share', 'discuss', 'group', 'together'],
      negative: ['alone', 'isolated', 'independent', 'solo']
    },
    service_helper: {
      high: ['help', 'serve', 'care', 'support', 'assist', 'volunteer', 'charity', 'community', 'people', 'healing', 'therapy', 'counseling', 'social work'],
      medium: ['contribute', 'give', 'share'],
      negative: ['profit', 'money', 'competition', 'win']
    },
    systems_builder: {
      high: ['build', 'organize', 'structure', 'system', 'process', 'manage', 'plan', 'coordinate', 'efficiency', 'workflow', 'framework', 'infrastructure'],
      medium: ['improve', 'optimize', 'standardize'],
      negative: ['chaos', 'random', 'unstructured']
    },
    hands_on_builder: {
      high: ['build', 'make', 'construct', 'fix', 'repair', 'tool', 'hands', 'physical', 'craft', 'mechanical', 'woodworking', 'engineering', 'hardware'],
      medium: ['create', 'work', 'practical'],
      negative: ['abstract', 'theoretical', 'conceptual']
    },
    entrepreneur_innovator: {
      high: ['business', 'startup', 'innovate', 'create', 'build', 'leadership', 'opportunity', 'venture', 'market', 'entrepreneurship', 'company'],
      medium: ['risk', 'challenge', 'growth', 'new'],
      negative: ['routine', 'predictable', 'stable']
    }
  };
  
  const scores: { [key: string]: number } = {};
  
  // Calculate scores for each career based on keyword matches
  Object.entries(careerKeywords).forEach(([career, keywords]) => {
    let careerScore = 3; // Base score
    
    // High-impact keywords (+1 each)
    keywords.high.forEach(keyword => {
      if (lowerAnswer.includes(keyword)) {
        careerScore += 1;
      }
    });
    
    // Medium-impact keywords (+0.5 each)
    keywords.medium.forEach(keyword => {
      if (lowerAnswer.includes(keyword)) {
        careerScore += 0.5;
      }
    });
    
    // Negative keywords (-0.5 each)
    keywords.negative.forEach(keyword => {
      if (lowerAnswer.includes(keyword)) {
        careerScore -= 0.5;
      }
    });
    
    scores[career] = Math.max(1, Math.min(7, careerScore));
  });
  
  // For questions that are career-agnostic, return a weighted average
  // But for flow_activities and invisible_work, we want to detect the career inclination
  if (questionId === 'flow_activities' || questionId === 'invisible_work' || questionId === 'favorite_stories') {
    // Return the score that best matches the detected career pattern
    const maxScore = Math.max(...Object.values(scores));
    return maxScore;
  }
  
  // For other text questions, return a moderate score
  return 4;
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