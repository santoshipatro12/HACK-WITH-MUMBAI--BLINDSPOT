import { StartupInput, RiskScore } from '../types';

export function calculateRiskScore(input: StartupInput): RiskScore {
  let technical = 0;
  let market = 0;
  let execution = 0;

  // Platform risk
  if (input.platform === 'api') {
    technical += 25;
  } else if (input.platform === 'saas') {
    technical += 15;
  } else if (input.platform === 'app') {
    technical += 20;
    execution += 10;
  } else if (input.platform === 'web') {
    technical += 10;
  }

  // Revenue model risk
  if (input.revenueModel === 'free') {
    market += 35;
    execution += 15;
  } else if (input.revenueModel === 'commission') {
    market += 20;
  } else if (input.revenueModel === 'subscription') {
    market += 15;
  }

  // Stage risk
  if (input.stage === 'idea') {
    execution += 35;
    market += 25;
  } else if (input.stage === 'mvp') {
    execution += 20;
    market += 15;
  } else if (input.stage === 'early_users') {
    execution += 10;
    market += 5;
  }

  // Dependency risk
  if (input.criticalDependency === 'api') {
    technical += 30;
  } else if (input.criticalDependency === 'platform') {
    execution += 25;
    technical += 15;
  } else if (input.criticalDependency === 'regulation') {
    execution += 30;
    market += 10;
  }

  // Target users risk
  if (input.targetUsers === 'consumers') {
    market += 20;
  } else if (input.targetUsers === 'enterprise') {
    execution += 20;
  } else if (input.targetUsers === 'smb') {
    market += 10;
    execution += 10;
  }

  // Industry risk
  if (input.industry === 'fintech') {
    technical += 15;
    execution += 15;
  } else if (input.industry === 'healthtech') {
    execution += 20;
    technical += 10;
  } else if (input.industry === 'marketplace') {
    execution += 25;
    market += 15;
  } else if (input.industry === 'social') {
    market += 25;
  }

  // Normalize scores to 0-100
  technical = Math.min(100, technical);
  market = Math.min(100, market);
  execution = Math.min(100, execution);

  // Calculate weighted total
  const total = Math.round((technical * 0.3) + (market * 0.4) + (execution * 0.3));

  // Determine label
  let label: 'Low' | 'Medium' | 'High' | 'Critical';
  if (total < 25) {
    label = 'Low';
  } else if (total < 50) {
    label = 'Medium';
  } else if (total < 75) {
    label = 'High';
  } else {
    label = 'Critical';
  }

  return { technical, market, execution, total, label };
}
