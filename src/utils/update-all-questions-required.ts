// Batch script to add required: true to all quiz questions that don't have it
// This is a utility script to systematically update the quiz questions

export const questionsToUpdate = [
  'childhood_environment',
  'favorite_stories', 
  'media_themes',
  'perfect_world_contribution',
  'work_environment_energy',
  'decision_making',
  'work_pace',
  'hands_vs_knowledge',
  'personality_energy_source',
  'information_processing', 
  'stress_response',
  'energy_drain_activities',
  'disappointing_expectations',
  'work_environment_drain',
  'failed_attempts',
  'legacy_desire',
  'recognition_motivation',
  'relationship_depth',
  'conflict_style',
  'commitment_style',
  'money_beliefs_1',
  'success_definition_1',
  'wealth_vs_fame',
  'fame_vs_impact',
  'passion_vs_security',
  'growth_vs_stability',
  'uncertainty_response',
  'workplace_stress_triggers',
  'legacy_avoidance',
  'risk_perception',
  'time_focus',
  'comparison_triggers',
  'external_validation',
  'fear_motivators',
  'success_barriers',
  'values_under_pressure',
  'intrinsic_motivators'
];

// All these questions should be marked as required: true
export const shouldAllBeRequired = true;