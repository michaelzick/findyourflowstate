import { QuizResults } from '@/types/quiz';

export const generateMarkdownContent = (results: QuizResults): string => {
  const markdown = `# Comprehensive Career Assessment Results

## Assessment Overview
- **Confidence Level:** ${results.confidence}%
- **Completed:** ${results.completedAt.toLocaleDateString()}

## Top Career Paths

${results.careerPaths.map((cp, i) => `
### ${i + 1}. ${cp.title} (${cp.score}% Match)

**Description:**
${cp.description}

**Key Traits:**
${cp.keyTraits.map(trait => `- ${trait}`).join('\n')}

**Typical Roles:**
${cp.typicalRoles.map(role => `- ${role}`).join('\n')}

${cp.specificOccupations ? `**Specific Occupations:**
${cp.specificOccupations.map(occ => `- ${occ}`).join('\n')}

` : ''}**Work Environment:**
${cp.workEnvironment}

**Strengths in This Path:**
${cp.strengths.map(strength => `- ${strength}`).join('\n')}

**Potential Challenges:**
${cp.challenges.map(challenge => `- ${challenge}`).join('\n')}

`).join('\n')}

${results.aiAnalysis?.specificOccupations ? `## Specific Career Recommendations (AI-Enhanced)

${results.aiAnalysis.specificOccupations.map((occ, i) => `
### ${i + 1}. ${occ.title} (${occ.fitScore}% Fit)
- **Category:** ${occ.category}
- **Reasoning:** ${occ.reasoning}

`).join('\n')}` : ''}

## Comprehensive Personality Profile

### Your Strengths
${results.personalityInsight.strengths.map(strength => `- ${strength}`).join('\n')}

### Areas for Growth
${results.personalityInsight.areasForGrowth.map(area => `- ${area}`).join('\n')}

### Your Working Style
${results.personalityInsight.workingStyle}

### What Motivates You
${results.personalityInsight.motivators.map(motivator => `- ${motivator}`).join('\n')}

### Your Natural Tendencies
${results.personalityInsight.naturalTendencies.map(tendency => `- ${tendency}`).join('\n')}

### Relationship Insights
${results.personalityInsight.relationshipStyles.map(style => `- ${style}`).join('\n')}

### Environments to Approach with Caution
${results.personalityInsight.avoidanceAreas.map(area => `- ${area}`).join('\n')}

${results.aiAnalysis?.hiddenBeliefs ? `## Hidden Beliefs & Psychological Patterns (AI Analysis)

### Success Blockers
${results.aiAnalysis.hiddenBeliefs.successBlockers.map(blocker => `- ${blocker}`).join('\n')}

### Money Beliefs
${results.aiAnalysis.hiddenBeliefs.moneyBeliefs.map(belief => `- ${belief}`).join('\n')}

### Fear Patterns
${results.aiAnalysis.hiddenBeliefs.fearPatterns.map(pattern => `- ${pattern}`).join('\n')}

### Core Psychological Insights
${results.aiAnalysis.hiddenBeliefs.coreInsights.map(insight => `- ${insight}`).join('\n')}` : ''}

${results.aiAnalysis?.enhancedPersonality ? `## Enhanced Personality Analysis (AI-Powered)

### Cognitive Style
${results.aiAnalysis.enhancedPersonality.cognitiveStyle}

### Motivational Drivers
${results.aiAnalysis.enhancedPersonality.motivationalDrivers.map(driver => `- ${driver}`).join('\n')}

### Relationship Style
${results.aiAnalysis.enhancedPersonality.relationshipStyle}

### Work Environment Needs
${results.aiAnalysis.enhancedPersonality.workEnvironmentNeeds}` : ''}

${results.aiAnalysis?.deepAnalysis ? `## Deep Behavioral Analysis (AI-Powered)

### Behavioral Patterns
${results.aiAnalysis.deepAnalysis.behavioralPatterns.map(pattern => `- ${pattern}`).join('\n')}

### Unconscious Drivers
${results.aiAnalysis.deepAnalysis.unconsciousDrivers.map(driver => `- ${driver}`).join('\n')}

### Blind Spots
${results.aiAnalysis.deepAnalysis.blindSpots.map(spot => `- ${spot}`).join('\n')}

### Self-Sabotage Patterns
${results.aiAnalysis.deepAnalysis.selfSabotagePatterns.map(pattern => `- ${pattern}`).join('\n')}

### Emotional Triggers
${results.aiAnalysis.deepAnalysis.emotionalTriggers.map(trigger => `- ${trigger}`).join('\n')}

### Decision-Making Style
${results.aiAnalysis.deepAnalysis.decisionMakingStyle}

### Communication Style
${results.aiAnalysis.deepAnalysis.communicationStyle}

### Leadership Style
${results.aiAnalysis.deepAnalysis.leadershipStyle}

### Stress Response
${results.aiAnalysis.deepAnalysis.stressResponse}

### Conflict Style
${results.aiAnalysis.deepAnalysis.conflictStyle}` : ''}

${results.aiAnalysis?.lifePurpose ? `## Life Purpose Analysis (AI-Powered)

### Core Contribution
${results.aiAnalysis.lifePurpose.coreContribution}

### Natural Gifts
${results.aiAnalysis.lifePurpose.naturalGifts.map(gift => `- ${gift}`).join('\n')}

### Meaningful Impact Areas
${results.aiAnalysis.lifePurpose.meaningfulImpact.map(impact => `- ${impact}`).join('\n')}

### What the World Needs from You
${results.aiAnalysis.lifePurpose.worldNeeds.map(need => `- ${need}`).join('\n')}

### Purpose Alignment
${results.aiAnalysis.lifePurpose.purposeAlignment}

### Fulfillment Factors
${results.aiAnalysis.lifePurpose.fulfillmentFactors.map(factor => `- ${factor}`).join('\n')}

### Legacy Vision
${results.aiAnalysis.lifePurpose.legacyVision}

### Service Orientation
${results.aiAnalysis.lifePurpose.serviceOrientation}

### Spiritual Dimension
${results.aiAnalysis.lifePurpose.spiritualDimension}` : ''}

---
*Generated by Comprehensive Career Assessment Quiz with AI Enhancement*  
*Assessment Date: ${results.completedAt.toLocaleDateString()}*
`;

  return markdown;
};

export const generateRichTextContent = (results: QuizResults): string => {
  const rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 

{\\b\\fs32 COMPREHENSIVE CAREER ASSESSMENT RESULTS}
\\par\\par

{\\b Assessment Overview:}
\\par
Confidence Level: ${results.confidence}%
\\par
Completed: ${results.completedAt.toLocaleDateString()}
\\par\\par

{\\b\\fs28 TOP CAREER PATHS}
\\par\\par

${results.careerPaths.map((cp, i) => `
{\\b ${i + 1}. ${cp.title.toUpperCase()} (${cp.score}% MATCH)}
\\par
${'-'.repeat(50)}
\\par\\par

{\\b Description:}
\\par
${cp.description}
\\par\\par

{\\b Key Traits:}
\\par
${cp.keyTraits.map(trait => `• ${trait}`).join('\\par\n')}
\\par\\par

{\\b Typical Roles:}
\\par
${cp.typicalRoles.map(role => `• ${role}`).join('\\par\n')}
\\par\\par

${cp.specificOccupations ? `{\\b Specific Occupations:}
\\par
${cp.specificOccupations.map(occ => `• ${occ}`).join('\\par\n')}
\\par\\par` : ''}

{\\b Work Environment:}
\\par
${cp.workEnvironment}
\\par\\par

{\\b Strengths in This Path:}
\\par
${cp.strengths.map(strength => `• ${strength}`).join('\\par\n')}
\\par\\par

{\\b Potential Challenges:}
\\par
${cp.challenges.map(challenge => `• ${challenge}`).join('\\par\n')}
\\par\\par

`).join('\n')}

${results.aiAnalysis?.specificOccupations ? `
{\\b\\fs28 SPECIFIC CAREER RECOMMENDATIONS (AI-ENHANCED)}
\\par\\par

${results.aiAnalysis.specificOccupations.map((occ, i) => `
{\\b ${i + 1}. ${occ.title.toUpperCase()} (${occ.fitScore}% FIT)}
\\par
Category: ${occ.category}
\\par
Reasoning: ${occ.reasoning}
\\par\\par

`).join('\n')}` : ''}

{\\b\\fs28 COMPREHENSIVE PERSONALITY PROFILE}
\\par\\par

{\\b YOUR STRENGTHS:}
\\par
${results.personalityInsight.strengths.map(strength => `• ${strength}`).join('\\par\n')}
\\par\\par

{\\b AREAS FOR GROWTH:}
\\par
${results.personalityInsight.areasForGrowth.map(area => `• ${area}`).join('\\par\n')}
\\par\\par

{\\b YOUR WORKING STYLE:}
\\par
${results.personalityInsight.workingStyle}
\\par\\par

{\\b WHAT MOTIVATES YOU:}
\\par
${results.personalityInsight.motivators.map(motivator => `• ${motivator}`).join('\\par\n')}
\\par\\par

{\\b YOUR NATURAL TENDENCIES:}
\\par
${results.personalityInsight.naturalTendencies.map(tendency => `• ${tendency}`).join('\\par\n')}
\\par\\par

{\\b RELATIONSHIP INSIGHTS:}
\\par
${results.personalityInsight.relationshipStyles.map(style => `• ${style}`).join('\\par\n')}
\\par\\par

{\\b ENVIRONMENTS TO APPROACH WITH CAUTION:}
\\par
${results.personalityInsight.avoidanceAreas.map(area => `• ${area}`).join('\\par\n')}
\\par\\par

${results.aiAnalysis?.hiddenBeliefs ? `
{\\b\\fs28 HIDDEN BELIEFS & PSYCHOLOGICAL PATTERNS (AI ANALYSIS)}
\\par\\par

{\\b SUCCESS BLOCKERS:}
\\par
${results.aiAnalysis.hiddenBeliefs.successBlockers.map(blocker => `• ${blocker}`).join('\\par\n')}
\\par\\par

{\\b MONEY BELIEFS:}
\\par
${results.aiAnalysis.hiddenBeliefs.moneyBeliefs.map(belief => `• ${belief}`).join('\\par\n')}
\\par\\par

{\\b FEAR PATTERNS:}
\\par
${results.aiAnalysis.hiddenBeliefs.fearPatterns.map(pattern => `• ${pattern}`).join('\\par\n')}
\\par\\par

{\\b CORE PSYCHOLOGICAL INSIGHTS:}
\\par
${results.aiAnalysis.hiddenBeliefs.coreInsights.map(insight => `• ${insight}`).join('\\par\n')}
\\par\\par` : ''}

${results.aiAnalysis?.enhancedPersonality ? `
{\\b\\fs28 ENHANCED PERSONALITY ANALYSIS (AI-POWERED)}
\\par\\par

{\\b COGNITIVE STYLE:}
\\par
${results.aiAnalysis.enhancedPersonality.cognitiveStyle}
\\par\\par

{\\b MOTIVATIONAL DRIVERS:}
\\par
${results.aiAnalysis.enhancedPersonality.motivationalDrivers.map(driver => `• ${driver}`).join('\\par\n')}
\\par\\par

{\\b RELATIONSHIP STYLE:}
\\par
${results.aiAnalysis.enhancedPersonality.relationshipStyle}
\\par\\par

{\\b WORK ENVIRONMENT NEEDS:}
\\par
${results.aiAnalysis.enhancedPersonality.workEnvironmentNeeds}
\\par\\par` : ''}

${results.aiAnalysis?.deepAnalysis ? `
{\\b\\fs28 DEEP BEHAVIORAL ANALYSIS (AI-POWERED)}
\\par\\par

{\\b BEHAVIORAL PATTERNS:}
\\par
${results.aiAnalysis.deepAnalysis.behavioralPatterns.map(pattern => `• ${pattern}`).join('\\par\n')}
\\par\\par

{\\b UNCONSCIOUS DRIVERS:}
\\par
${results.aiAnalysis.deepAnalysis.unconsciousDrivers.map(driver => `• ${driver}`).join('\\par\n')}
\\par\\par

{\\b BLIND SPOTS:}
\\par
${results.aiAnalysis.deepAnalysis.blindSpots.map(spot => `• ${spot}`).join('\\par\n')}
\\par\\par

{\\b SELF-SABOTAGE PATTERNS:}
\\par
${results.aiAnalysis.deepAnalysis.selfSabotagePatterns.map(pattern => `• ${pattern}`).join('\\par\n')}
\\par\\par

{\\b EMOTIONAL TRIGGERS:}
\\par
${results.aiAnalysis.deepAnalysis.emotionalTriggers.map(trigger => `• ${trigger}`).join('\\par\n')}
\\par\\par

{\\b DECISION-MAKING STYLE:}
\\par
${results.aiAnalysis.deepAnalysis.decisionMakingStyle}
\\par\\par

{\\b COMMUNICATION STYLE:}
\\par
${results.aiAnalysis.deepAnalysis.communicationStyle}
\\par\\par

{\\b LEADERSHIP STYLE:}
\\par
${results.aiAnalysis.deepAnalysis.leadershipStyle}
\\par\\par

{\\b STRESS RESPONSE:}
\\par
${results.aiAnalysis.deepAnalysis.stressResponse}
\\par\\par

{\\b CONFLICT STYLE:}
\\par
${results.aiAnalysis.deepAnalysis.conflictStyle}
\\par\\par` : ''}

${results.aiAnalysis?.lifePurpose ? `
{\\b\\fs28 LIFE PURPOSE ANALYSIS (AI-POWERED)}
\\par\\par

{\\b CORE CONTRIBUTION:}
\\par
${results.aiAnalysis.lifePurpose.coreContribution}
\\par\\par

{\\b NATURAL GIFTS:}
\\par
${results.aiAnalysis.lifePurpose.naturalGifts.map(gift => `• ${gift}`).join('\\par\n')}
\\par\\par

{\\b MEANINGFUL IMPACT AREAS:}
\\par
${results.aiAnalysis.lifePurpose.meaningfulImpact.map(impact => `• ${impact}`).join('\\par\n')}
\\par\\par

{\\b WHAT THE WORLD NEEDS FROM YOU:}
\\par
${results.aiAnalysis.lifePurpose.worldNeeds.map(need => `• ${need}`).join('\\par\n')}
\\par\\par

{\\b PURPOSE ALIGNMENT:}
\\par
${results.aiAnalysis.lifePurpose.purposeAlignment}
\\par\\par

{\\b FULFILLMENT FACTORS:}
\\par
${results.aiAnalysis.lifePurpose.fulfillmentFactors.map(factor => `• ${factor}`).join('\\par\n')}
\\par\\par

{\\b LEGACY VISION:}
\\par
${results.aiAnalysis.lifePurpose.legacyVision}
\\par\\par

{\\b SERVICE ORIENTATION:}
\\par
${results.aiAnalysis.lifePurpose.serviceOrientation}
\\par\\par

{\\b SPIRITUAL DIMENSION:}
\\par
${results.aiAnalysis.lifePurpose.spiritualDimension}
\\par\\par` : ''}

---
\\par
Generated by Comprehensive Career Assessment Quiz with AI Enhancement
\\par
Assessment Date: ${results.completedAt.toLocaleDateString()}
\\par
}`;

  return rtf;
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up object URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
};