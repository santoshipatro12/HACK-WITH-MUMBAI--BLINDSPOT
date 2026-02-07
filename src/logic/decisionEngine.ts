import { RiskScore, ActionItem, StartupInput } from '../types';

export function makeDecision(riskScore: RiskScore): { decision: 'BLOCK' | 'PROCEED_WITH_CONDITIONS' | 'SAFE_TO_BUILD'; reason: string } {
  const { total, technical, market, execution } = riskScore;

  // BLOCK conditions
  if (total >= 70) {
    return {
      decision: 'BLOCK',
      reason: `Critical risk level detected (${total}/100). Multiple high-risk factors make this venture extremely risky at this stage.`
    };
  }

  if (market >= 70 && execution >= 50) {
    return {
      decision: 'BLOCK',
      reason: 'Market risk is critically high with significant execution challenges. Validate market demand before proceeding.'
    };
  }

  if (technical >= 80) {
    return {
      decision: 'BLOCK',
      reason: 'Technical dependencies create unacceptable risk. Reduce external dependencies before building.'
    };
  }

  // PROCEED WITH CONDITIONS
  if (total >= 40 || market >= 50 || technical >= 50 || execution >= 50) {
    let conditions: string[] = [];
    
    if (market >= 50) conditions.push('validate market demand first');
    if (technical >= 50) conditions.push('reduce technical dependencies');
    if (execution >= 50) conditions.push('de-risk execution with smaller scope');
    
    return {
      decision: 'PROCEED_WITH_CONDITIONS',
      reason: `Moderate risk detected (${total}/100). ${conditions.length > 0 ? 'Recommended: ' + conditions.join(', ') + '.' : 'Address key risks before full commitment.'}`
    };
  }

  // SAFE TO BUILD
  return {
    decision: 'SAFE_TO_BUILD',
    reason: `Risk levels are manageable (${total}/100). Proceed with standard validation practices and monitor key assumptions.`
  };
}

export function generateActionItems(input: StartupInput, riskScore: RiskScore): ActionItem[] {
  const actions: ActionItem[] = [];
  let id = 1;

  // High priority actions based on risk
  if (riskScore.market >= 50 || input.revenueModel === 'free') {
    actions.push({
      id: `action${id++}`,
      text: 'Test willingness to pay with landing page + payment intent',
      priority: 'high',
      category: 'validate'
    });
  }

  if (input.stage === 'idea') {
    actions.push({
      id: `action${id++}`,
      text: 'Interview 20 potential users about this specific pain point',
      priority: 'high',
      category: 'validate'
    });
    actions.push({
      id: `action${id++}`,
      text: 'Avoid building any premium features until core is validated',
      priority: 'high',
      category: 'avoid'
    });
  }

  if (input.criticalDependency === 'api') {
    actions.push({
      id: `action${id++}`,
      text: 'Create fallback plan for API dependency - identify 2 alternatives',
      priority: 'high',
      category: 'validate'
    });
  }

  if (input.targetUsers === 'consumers') {
    actions.push({
      id: `action${id++}`,
      text: 'Run small paid ad experiment (₹5k-10k) to test acquisition cost',
      priority: 'high',
      category: 'test'
    });
    actions.push({
      id: `action${id++}`,
      text: 'Measure 7-day and 30-day retention from first users',
      priority: 'high',
      category: 'measure'
    });
  }

  if (input.platform === 'app') {
    actions.push({
      id: `action${id++}`,
      text: 'Build web MVP first to validate before mobile investment',
      priority: 'medium',
      category: 'avoid'
    });
  }

  if (input.revenueModel === 'subscription') {
    actions.push({
      id: `action${id++}`,
      text: 'Pre-sell annual plans to validate commitment level',
      priority: 'medium',
      category: 'test'
    });
  }

  if (input.industry === 'marketplace') {
    actions.push({
      id: `action${id++}`,
      text: 'Manually match first 50 transactions to understand both sides',
      priority: 'high',
      category: 'validate'
    });
    actions.push({
      id: `action${id++}`,
      text: 'Avoid building automated matching until manual process works',
      priority: 'medium',
      category: 'avoid'
    });
  }

  // Standard actions
  actions.push({
    id: `action${id++}`,
    text: 'Define your "kill metric" - what number would make you stop?',
    priority: 'medium',
    category: 'measure'
  });

  actions.push({
    id: `action${id++}`,
    text: 'Set 4-week validation deadline before any major build',
    priority: 'medium',
    category: 'test'
  });

  if (input.criticalDependency === 'platform') {
    actions.push({
      id: `action${id++}`,
      text: 'Review platform ToS for business model compatibility',
      priority: 'high',
      category: 'validate'
    });
  }

  if (input.industry === 'fintech' || input.industry === 'healthtech') {
    actions.push({
      id: `action${id++}`,
      text: 'Map compliance requirements before building features',
      priority: 'high',
      category: 'validate'
    });
  }

  // Sort by priority and return top actions
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return actions.slice(0, 8);
}
