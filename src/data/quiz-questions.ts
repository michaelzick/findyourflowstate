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
  // VARIATION: Childhood avoidance patterns (reverse psychology)
  {
    id: 'childhood_avoidance',
    category: 'childhood_patterns',
    type: 'multiple_choice',
    question: "As a child, which activities did you consistently avoid or find boring?",
    options: [
      "Sitting still for long periods like reading or studying",
      "Team sports or competitive group activities",
      "Arts and crafts or creative projects",
      "Being the center of attention or performing",
      "Complex games with lots of rules",
      "Physical activities that required coordination",
      "Social gatherings with many other children",
      "Quiet, solitary activities"
    ],
    weight: 1.5
  },
  {
    id: 'flow_activities',
    category: 'flow_states',
    type: 'text',
    question: "Describe a time when you completely lost track of time because you were so absorbed in what you were doing. What were you doing and what made it so engaging?"
  },
  // VARIATION: Energy drain activities (reverse flow)
  {
    id: 'energy_drain_activities',
    category: 'flow_states',
    type: 'text',
    question: "Describe an activity or situation that consistently drains your energy or makes time feel like it's crawling. What specifically makes it so difficult for you?",
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
    ],
  },

  // Media Preferences & Values
  {
    id: 'favorite_stories',
    category: 'media_preferences',
    type: 'text',
    question: "What types of stories (books, movies, TV shows) do you find most compelling? Describe the themes, characters, or conflicts that draw you in.",
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
    ],
  },

  // Philosophical & Values Questions
  {
    id: 'invisible_work',
    category: 'values_philosophy',
    type: 'text',
    question: "If no one could see what you were doing and every job paid the same, what would you choose to do with your time? What draws you to that activity?",
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
    ],
  },

  // Work Environment & Style
  {
    id: 'work_environment_energy',
    category: 'work_environment',
    type: 'scale',
    question: "Where do you feel most energized and productive?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Quiet, independent work", "Collaborative, team-based work"],
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
    ],
  },
  {
    id: 'work_pace',
    category: 'work_style',
    type: 'scale',
    question: "What work rhythm suits you best?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Steady, consistent pace over time", "Intense bursts with recovery periods"],
  },
  {
    id: 'hands_vs_knowledge',
    category: 'work_style',
    type: 'scale',
    question: "What type of work feels most natural to you?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Working with my hands and physical materials", "Working with ideas and abstract concepts"],
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
  },
  {
    id: "money_beliefs_1",
    category: "values_philosophy",
    type: "text",
    question: "Describe your relationship with money. What does financial success mean to you, and what fears or beliefs about money have influenced your life choices?",
    weight: 1.0
  },
  {
    id: "success_definition_1",
    category: "motivations",
    type: "text",
    question: "How do you define personal and professional success? What fears or beliefs about achievement have shaped your goals and decisions?",
    weight: 1.0
  },

  // NEW PSYCHOLOGY-BASED QUESTIONS

  // Envy-based self-discovery
  {
    id: "envy_analysis",
    category: "motivations",
    type: "text",
    question: "Who are you envious of? What do they have? What have they accomplished? What do you think it says about you?",
    weight: 2.5
  },

  // Magic wand idealization
  {
    id: "magic_wand_life",
    category: "values_philosophy",
    type: "text",
    question: "If you could wave a magic wand and have any life you want, what would it look like? What would you have? What would you be doing? Where would you be living? Who is in your life?",
    weight: 2.5
  },

  // VALUES CONFLICT QUESTIONS

  {
    id: "wealth_vs_fame",
    category: "values_philosophy",
    type: "multiple_choice",
    question: "If you had to choose, would you rather be:",
    options: [
      "Wealthy but completely unknown",
      "Famous but struggling financially",
      "Moderately successful in both areas",
      "Neither - I value other things more"
    ],
    weight: 2
  },

  {
    id: "fame_vs_impact",
    category: "values_philosophy",
    type: "multiple_choice",
    question: "Which would bring you more satisfaction?",
    options: [
      "Being famous and recognized by millions",
      "Helping the greatest number of people anonymously",
      "Being respected by a small group of experts in your field",
      "Making a significant impact that few people know about"
    ],
    weight: 2
  },

  {
    id: "passion_vs_security",
    category: "work_style",
    type: "multiple_choice",
    question: "Which scenario appeals to you more?",
    options: [
      "High-paying job doing work you find boring or meaningless",
      "Financially struggling while pursuing work you're passionate about",
      "Stable income with work that's moderately interesting",
      "Variable income doing different types of work that excite you"
    ],
    weight: 2
  },

  {
    id: "growth_vs_stability",
    category: "work_environment",
    type: "multiple_choice",
    question: "In your career, which would you prioritize?",
    options: [
      "Job security with limited growth potential",
      "High potential for advancement with significant uncertainty",
      "Consistent work-life balance with average pay",
      "Intense periods of work with extended time off"
    ],
    weight: 2
  },

  // QUESTION VARIATIONS (to detect bias and increase accuracy)

  // VARIATION: Decision making under uncertainty
  {
    id: "uncertainty_response",
    category: "work_style",
    type: "multiple_choice",
    question: "When facing uncertainty, your natural response is to:",
    options: [
      "Gather more information until you feel confident",
      "Make the best decision with available information and adjust as needed",
      "Seek advice from trusted advisors or mentors",
      "Trust your instincts and act quickly",
      "Consider multiple scenarios and prepare contingency plans",
      "Focus on what you can control and adapt to what you can't",
      "Delay the decision until more clarity emerges"
    ],
    weight: 1.5
  },

  // VARIATION: Work environment drain (opposite of energy)
  {
    id: "workplace_stress_triggers",
    category: "work_environment",
    type: "multi_select",
    question: "Which workplace situations create the most stress for you? (Select all that apply)",
    options: [
      "Being micromanaged or closely supervised",
      "Having to work in complete isolation",
      "Dealing with office politics and interpersonal drama",
      "Working under tight deadlines with little flexibility",
      "Being expected to multitask constantly",
      "Having unclear role expectations or responsibilities",
      "Working in a highly competitive, win-lose environment",
      "Being in an environment where creativity is discouraged"
    ],
    weight: 1.5
  },

  // VARIATION: Legacy from negative perspective
  {
    id: "legacy_avoidance",
    category: "motivations",
    type: "multiple_choice",
    question: "What would you most want to avoid being remembered for?",
    options: [
      "Having lived a life without taking meaningful risks",
      "Never having created anything of lasting value",
      "Being someone who hurt or disappointed others",
      "Having wasted my talents and potential",
      "Being remembered as selfish or self-centered",
      "Never having stood up for what I believed in",
      "Being someone who played it safe and never truly lived",
      "Having prioritized material success over relationships"
    ],
    weight: 1.5
  },

  // ADVANCED PSYCHOLOGY QUESTIONS

  // Cognitive bias detection
  {
    id: "risk_perception",
    category: "personality",
    type: "multiple_choice",
    question: "When evaluating a new opportunity, you typically:",
    options: [
      "Focus on what could go wrong and prepare for challenges",
      "Get excited about the potential positive outcomes",
      "Carefully weigh both the risks and benefits equally",
      "Trust your gut feeling about whether it feels right",
      "Research similar situations and outcomes extensively",
      "Consider how it aligns with your long-term goals",
      "Think about how it might affect others in your life"
    ],
    weight: 1.5
  },

  // Temporal orientation
  {
    id: "time_focus",
    category: "personality",
    type: "scale",
    question: "When making decisions, where do you naturally focus your attention?",
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Learning from past experiences", "Planning for future possibilities"],
    weight: 1.5
  },

  // Social comparison patterns
  {
    id: "comparison_triggers",
    category: "relationships",
    type: "text",
    question: "Describe a time when comparing yourself to others motivated you to change or improve something about yourself. What did that reveal about your values?"
  },

  // Fear-based motivation detection
  {
    id: "fear_motivators",
    category: "motivations",
    type: "multi_select",
    question: "Which fears, if any, drive some of your major life decisions? (Select all that apply)",
    options: [
      "Fear of not being good enough or competent",
      "Fear of being alone or abandoned by others",
      "Fear of financial insecurity or poverty",
      "Fear of wasting my life or potential",
      "Fear of being judged or criticized by others",
      "Fear of failure or making mistakes",
      "Fear of success and the responsibilities it brings",
      "Fear of being ordinary or unremarkable",
      "None of these fears significantly influence my decisions"
    ],
    weight: 2
  },

  // Hidden beliefs about success
  {
    id: "success_barriers",
    category: "motivations",
    type: "text",
    question: "What beliefs about success, failure, or achievement do you think might be limiting you? What messages about 'success' did you learn growing up?"
  },

  // Values hierarchy under pressure
  {
    id: "values_under_pressure",
    category: "values_philosophy",
    type: "multiple_choice",
    question: "When under significant pressure or stress, which value becomes most important to you?",
    options: [
      "Maintaining integrity and authenticity",
      "Protecting relationships and connections with others",
      "Achieving the goal regardless of personal cost",
      "Preserving my physical and mental well-being",
      "Being fair and just to everyone involved",
      "Following through on commitments and responsibilities",
      "Staying true to my creative vision or principles",
      "Ensuring financial security and stability"
    ],
    weight: 2
  },

  // Motivational drives variation
  {
    id: "intrinsic_motivators",
    category: "motivations",
    type: "multi_select",
    question: "Which internal experiences are most rewarding for you? (Select all that apply)",
    options: [
      "The satisfaction of mastering a difficult skill",
      "The joy of creative expression and artistic creation",
      "The fulfillment of helping others grow and succeed",
      "The excitement of solving complex problems",
      "The peace of deep connection with nature or spirituality",
      "The thrill of competition and winning",
      "The pleasure of learning and discovering new knowledge",
      "The contentment of building something lasting and meaningful"
    ],
    weight: 2
  },

  // Final Assessment Question
  {
    id: "personal_superpower",
    category: "motivations",
    type: "text",
    question: "What is your superpower? Describe one skill or ability that you believe you are better at than almost everyone you meet.",
    weight: 2.5
  }
];
