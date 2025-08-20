import { QuizQuestion } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  // Childhood Patterns & Flow States
  {
    id: 'childhood_play',
    category: 'childhood_patterns',
    type: 'multiple_choice',
    question: "As a child, what type of play brought you the most joy?",
    options: [
      "Building things with blocks, Lego, or found objects",
      "Creating stories, drawing, or imaginative role-play",
      "Organizing games with friends or leading group activities",
      "Taking things apart to see how they worked",
      "Performing for others - singing, dancing, or acting",
      "Reading books and getting lost in other worlds",
      "Competing in sports or physical challenges",
      "Solving puzzles, riddles, or brain teasers"
    ],
    weight: 2
  },
  {
    id: 'flow_activities',
    category: 'flow_states',
    type: 'text',
    question: "Describe a time when you completely lost track of time because you were so absorbed in what you were doing. What were you doing and what made it so engaging?",
    required: true
  },
  {
    id: 'childhood_environment',
    category: 'childhood_patterns',
    type: 'multiple_choice',
    question: "Which childhood environment made you feel most alive and energized?",
    options: [
      "Quiet spaces where I could focus deeply on projects",
      "Busy, social environments with lots of people around",
      "Outdoor spaces where I could explore and move freely",
      "Structured environments with clear rules and expectations",
      "Creative spaces with art supplies and materials to experiment",
      "Libraries or places filled with books and knowledge",
      "Workshops or garages with tools and mechanical things"
    ]
  },

  // Media Preferences & Values
  {
    id: 'favorite_stories',
    category: 'media_preferences',
    type: 'text',
    question: "What types of stories (books, movies, TV shows) do you find most compelling? Describe the themes, characters, or conflicts that draw you in."
  },
  {
    id: 'media_themes',
    category: 'media_preferences',
    type: 'multi_select',
    question: "Which themes in media resonate most with you? (Select all that apply)",
    options: [
      "Underdog overcoming impossible odds",
      "Complex moral dilemmas and ethical questions",
      "Innovation and technological advancement",
      "Human relationships and emotional connections",
      "Adventure and exploration of unknown territories",
      "Mysteries and puzzles to be solved",
      "Social justice and fighting for the marginalized",
      "Personal transformation and growth",
      "Building something from nothing",
      "Artistic expression and beauty"
    ]
  },

  // Philosophical & Values Questions
  {
    id: 'invisible_work',
    category: 'values_philosophy',
    type: 'text',
    question: "If no one could see what you were doing and every job paid the same, what would you choose to do with your time? What draws you to that activity?",
    required: true
  },
  {
    id: 'perfect_world_contribution',
    category: 'values_philosophy',
    type: 'multiple_choice',
    question: "In your ideal world, what would be your primary contribution to society?",
    options: [
      "Creating beautiful things that inspire and move people",
      "Solving complex problems that improve how things work",
      "Helping people overcome challenges and reach their potential",
      "Building systems and organizations that serve others",
      "Discovering new knowledge or pushing boundaries of understanding",
      "Bringing people together and fostering community",
      "Protecting and preserving what's valuable for future generations",
      "Teaching and sharing knowledge with others"
    ]
  },

  // Work Environment & Style
  {
    id: 'work_environment_energy',
    category: 'work_environment',
    type: 'scale',
    question: "Where do you feel most energized and productive?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Quiet, independent work", "Collaborative, team-based work"]
  },
  {
    id: 'decision_making',
    category: 'work_style',
    type: 'multiple_choice',
    question: "How do you prefer to make important decisions?",
    options: [
      "Analyze all available data and consider logical outcomes",
      "Trust my intuition and gut feelings",
      "Seek input from others and build consensus",
      "Consider the impact on people's feelings and relationships",
      "Look at past examples and proven methods",
      "Think about creative possibilities and potential innovations",
      "Focus on what aligns with my core values and principles"
    ]
  },
  {
    id: 'work_pace',
    category: 'work_style',
    type: 'scale',
    question: "What work rhythm suits you best?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Steady, consistent pace over time", "Intense bursts with recovery periods"]
  },
  {
    id: 'hands_vs_knowledge',
    category: 'work_style',
    type: 'scale',
    question: "What type of work feels most natural to you?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Working with my hands and physical materials", "Working with ideas and abstract concepts"]
  },

  // Personality & Behavioral Patterns
  {
    id: 'personality_energy_source',
    category: 'personality',
    type: 'scale',
    question: "After a long day, what restores your energy?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Quiet time alone to recharge", "Social interaction and connection with others"]
  },
  {
    id: 'information_processing',
    category: 'personality',
    type: 'scale',
    question: "How do you prefer to take in information?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Focus on concrete facts and details", "Focus on patterns and future possibilities"]
  },
  {
    id: 'stress_response',
    category: 'personality',
    type: 'multiple_choice',
    question: "When facing a significant challenge or stress, your first instinct is to:",
    options: [
      "Break it down into smaller, manageable steps",
      "Seek support and advice from others",
      "Take time alone to think through all angles",
      "Jump in and start taking action immediately",
      "Look for creative or unconventional solutions",
      "Research and gather as much information as possible",
      "Focus on how it affects the people involved"
    ]
  },

  // Failures & Dislikes (Reverse Psychology)
  {
    id: 'disappointing_expectations',
    category: 'failures_dislikes',
    type: 'text',
    question: "Describe something you thought you would enjoy but ended up disliking. What specifically didn't work for you?"
  },
  {
    id: 'work_environment_drain',
    category: 'failures_dislikes',
    type: 'multi_select',
    question: "Which work environments or situations drain your energy? (Select all that apply)",
    options: [
      "Open offices with constant interruptions",
      "Highly competitive, cutthroat atmospheres",
      "Rigid hierarchies with micromanagement",
      "Isolation with minimal human interaction",
      "Constant pressure to multitask",
      "Unclear expectations or goals",
      "Work that feels meaningless or disconnected from impact",
      "Environments that discourage creativity or new ideas"
    ]
  },
  {
    id: 'failed_attempts',
    category: 'failures_dislikes',
    type: 'text',
    question: "Tell me about a time you tried something and weren't successful. What did you learn about yourself from that experience?"
  },

  // Motivations & Values Deep Dive
  {
    id: 'legacy_desire',
    category: 'motivations',
    type: 'multiple_choice',
    question: "What kind of legacy would you most want to leave behind?",
    options: [
      "Having created something beautiful that continues to inspire others",
      "Having solved important problems that made life better for many",
      "Having helped people discover their potential and grow",
      "Having built something lasting that serves future generations",
      "Having pushed the boundaries of human knowledge or capability",
      "Having brought people together across differences",
      "Having stood up for justice and equality",
      "Having been a source of wisdom and guidance for others"
    ]
  },
  {
    id: 'recognition_motivation',
    category: 'motivations',
    type: 'scale',
    question: "How important is external recognition and praise for your motivation?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["I'm motivated primarily by internal satisfaction", "External recognition significantly motivates me"]
  },

  // Relationship Patterns
  {
    id: 'relationship_depth',
    category: 'relationships',
    type: 'scale',
    question: "In relationships, do you prefer:",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Few deep, intense connections", "Many lighter, varied connections"]
  },
  {
    id: 'conflict_style',
    category: 'relationships',
    type: 'multiple_choice',
    question: "When there's conflict or disagreement, you tend to:",
    options: [
      "Address it head-on and work through it directly",
      "Take time to process before engaging",
      "Seek to understand all perspectives first",
      "Look for creative solutions that work for everyone",
      "Focus on maintaining harmony and relationships",
      "Stick to logical facts and objective analysis",
      "Avoid it if possible and hope it resolves naturally"
    ]
  },
  {
    id: 'commitment_style',
    category: 'relationships',
    type: 'multiple_choice',
    question: "Which relationship style feels most natural to you?",
    options: [
      "Deep, exclusive partnership with one person",
      "Multiple meaningful connections with different people",
      "Close friendships with romantic connections as they develop naturally",
      "Community-oriented with many caring relationships",
      "Independent with periodic deep connections",
      "Flexible arrangements based on life circumstances"
    ]
  }
];