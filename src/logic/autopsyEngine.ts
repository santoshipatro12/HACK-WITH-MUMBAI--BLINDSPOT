import { StartupInput, FailedStartup } from '../types';

const failedStartupsDatabase: FailedStartup[] = [
  {
    name: 'Quibi',
    year: '2020',
    raised: '$1.75B',
    failureReasons: ['Wrong timing (pandemic)', 'Misread user behavior', 'Too expensive content'],
    patternTags: ['timing_mismatch', 'high_cac', 'product_market_fit']
  },
  {
    name: 'MoviePass',
    year: '2019',
    raised: '$68M',
    failureReasons: ['Unsustainable unit economics', 'Burned through cash', 'No path to profitability'],
    patternTags: ['unit_economics', 'cash_burn', 'pricing_failure']
  },
  {
    name: 'Theranos',
    year: '2018',
    raised: '$700M',
    failureReasons: ['Technology didnt work', 'Fraudulent claims', 'No real product'],
    patternTags: ['technical_failure', 'over_promise', 'vaporware']
  },
  {
    name: 'WeWork',
    year: '2019',
    raised: '$12B',
    failureReasons: ['Overvaluation', 'Governance issues', 'Unsustainable growth model'],
    patternTags: ['unit_economics', 'governance', 'overexpansion']
  },
  {
    name: 'Homejoy',
    year: '2015',
    raised: '$40M',
    failureReasons: ['High CAC, low retention', 'Worker classification issues', 'Leakage to direct booking'],
    patternTags: ['high_cac', 'low_retention', 'marketplace_leakage']
  },
  {
    name: 'Fab.com',
    year: '2015',
    raised: '$336M',
    failureReasons: ['Pivoted too many times', 'Lost product focus', 'High burn rate'],
    patternTags: ['pivot_fatigue', 'cash_burn', 'product_market_fit']
  },
  {
    name: 'Jawbone',
    year: '2017',
    raised: '$930M',
    failureReasons: ['Hardware manufacturing issues', 'Fierce competition from Fitbit/Apple', 'Quality problems'],
    patternTags: ['technical_failure', 'competition', 'hardware_complexity']
  },
  {
    name: 'Yik Yak',
    year: '2017',
    raised: '$73M',
    failureReasons: ['Cyberbullying problems', 'Lost college demographic', 'Failed to grow beyond niche'],
    patternTags: ['distribution', 'content_moderation', 'niche_trap']
  },
  {
    name: 'Rdio',
    year: '2015',
    raised: '$126M',
    failureReasons: ['Lost to Spotify', 'Couldnt match funding', 'Slower feature development'],
    patternTags: ['competition', 'funding_gap', 'execution_speed']
  },
  {
    name: 'Secret',
    year: '2015',
    raised: '$35M',
    failureReasons: ['Anonymous social didnt scale', 'Toxicity issues', 'No retention'],
    patternTags: ['low_retention', 'content_moderation', 'social_dynamics']
  },
  {
    name: 'Beepi',
    year: '2017',
    raised: '$149M',
    failureReasons: ['High operational costs', 'Complex logistics', 'Thin margins'],
    patternTags: ['unit_economics', 'operational_complexity', 'thin_margins']
  },
  {
    name: 'ScaleFactor',
    year: '2020',
    raised: '$100M',
    failureReasons: ['Over-promised AI capabilities', 'Required too much human labor', 'Customer churn'],
    patternTags: ['over_promise', 'ai_washing', 'churn']
  },
];

export const patternLabels: Record<string, string> = {
  high_cac: 'High Customer Acquisition Cost',
  low_retention: 'Low User Retention',
  timing_mismatch: 'Timing Mismatch',
  unit_economics: 'Broken Unit Economics',
  cash_burn: 'Unsustainable Cash Burn',
  product_market_fit: 'Poor Product-Market Fit',
  technical_failure: 'Technical Failure',
  over_promise: 'Over-promised Capabilities',
  competition: 'Crushed by Competition',
  marketplace_leakage: 'Marketplace Leakage',
  operational_complexity: 'Operational Complexity',
  distribution: 'Weak Distribution',
  governance: 'Governance Issues',
  overexpansion: 'Over-expansion',
};

function matchPatterns(input: StartupInput): string[] {
  const patterns: string[] = [];

  // Revenue model patterns
  if (input.revenueModel === 'free') {
    patterns.push('unit_economics');
    patterns.push('cash_burn');
  }
  if (input.revenueModel === 'commission') {
    patterns.push('marketplace_leakage');
  }

  // Platform patterns
  if (input.platform === 'app') {
    patterns.push('high_cac');
    patterns.push('low_retention');
  }
  if (input.platform === 'saas') {
    patterns.push('churn');
  }

  // Stage patterns
  if (input.stage === 'idea') {
    patterns.push('product_market_fit');
    patterns.push('over_promise');
  }

  // Dependency patterns
  if (input.criticalDependency === 'api') {
    patterns.push('technical_failure');
  }
  if (input.criticalDependency === 'platform') {
    patterns.push('distribution');
  }

  // Industry patterns
  if (input.industry === 'social') {
    patterns.push('low_retention');
    patterns.push('content_moderation');
  }
  if (input.industry === 'marketplace') {
    patterns.push('marketplace_leakage');
    patterns.push('operational_complexity');
  }
  if (input.industry === 'ai') {
    patterns.push('over_promise');
    patterns.push('ai_washing');
  }

  // Target user patterns
  if (input.targetUsers === 'consumers') {
    patterns.push('high_cac');
  }

  return [...new Set(patterns)];
}

export function findSimilarFailures(input: StartupInput): FailedStartup[] {
  const matchedPatterns = matchPatterns(input);
  
  // Score each failed startup by pattern match
  const scored = failedStartupsDatabase.map(startup => {
    const matchCount = startup.patternTags.filter(tag => 
      matchedPatterns.includes(tag)
    ).length;
    return { startup, matchCount };
  });

  // Sort by match count and return top matches
  scored.sort((a, b) => b.matchCount - a.matchCount);
  
  return scored
    .filter(s => s.matchCount > 0)
    .slice(0, 4)
    .map(s => s.startup);
}
