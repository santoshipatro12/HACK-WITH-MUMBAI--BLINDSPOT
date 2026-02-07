import { StartupInput, Assumption } from '../types';

export function extractAssumptions(input: StartupInput): Assumption[] {
  const assumptions: Assumption[] = [];
  let id = 1;

  // Revenue model assumptions
  if (input.revenueModel === 'free') {
    assumptions.push({
      id: `a${id++}`,
      text: "Users will eventually convert to paid without a clear monetization path",
      category: 'market',
      severity: 'high'
    });
  }

  if (input.revenueModel === 'subscription') {
    assumptions.push({
      id: `a${id++}`,
      text: "Users will pay recurring fees for this solution",
      category: 'market',
      severity: 'medium'
    });
  }

  if (input.revenueModel === 'commission') {
    assumptions.push({
      id: `a${id++}`,
      text: "Transaction volume will be sufficient to sustain commission-based revenue",
      category: 'market',
      severity: 'medium'
    });
  }

  // Platform assumptions
  if (input.platform === 'app') {
    assumptions.push({
      id: `a${id++}`,
      text: "Users will download and retain a dedicated mobile application",
      category: 'execution',
      severity: 'medium'
    });
  }

  if (input.platform === 'saas') {
    assumptions.push({
      id: `a${id++}`,
      text: "Enterprise customers will integrate this into their workflow",
      category: 'market',
      severity: 'medium'
    });
  }

  if (input.platform === 'api') {
    assumptions.push({
      id: `a${id++}`,
      text: "Developers will adopt and integrate this API into their products",
      category: 'technical',
      severity: 'high'
    });
  }

  // Stage assumptions
  if (input.stage === 'idea') {
    assumptions.push({
      id: `a${id++}`,
      text: "Problem-solution fit is assumed without validation",
      category: 'market',
      severity: 'high'
    });
    assumptions.push({
      id: `a${id++}`,
      text: "Target users actually experience this pain point frequently",
      category: 'market',
      severity: 'high'
    });
  }

  if (input.stage === 'mvp') {
    assumptions.push({
      id: `a${id++}`,
      text: "MVP features are sufficient for user adoption",
      category: 'execution',
      severity: 'medium'
    });
  }

  if (input.stage === 'early_users') {
    assumptions.push({
      id: `a${id++}`,
      text: "Early adopters represent the broader market behavior",
      category: 'market',
      severity: 'medium'
    });
  }

  // Dependency assumptions
  if (input.criticalDependency === 'api') {
    assumptions.push({
      id: `a${id++}`,
      text: "External API will remain stable, affordable, and accessible",
      category: 'technical',
      severity: 'high'
    });
    assumptions.push({
      id: `a${id++}`,
      text: "API provider won't become a competitor or change terms drastically",
      category: 'technical',
      severity: 'medium'
    });
  }

  if (input.criticalDependency === 'platform') {
    assumptions.push({
      id: `a${id++}`,
      text: "Platform policies will remain favorable for your business model",
      category: 'execution',
      severity: 'high'
    });
  }

  if (input.criticalDependency === 'regulation') {
    assumptions.push({
      id: `a${id++}`,
      text: "Regulatory environment will remain stable or become more favorable",
      category: 'execution',
      severity: 'high'
    });
  }

  // Target user assumptions
  if (input.targetUsers === 'consumers') {
    assumptions.push({
      id: `a${id++}`,
      text: "Consumer acquisition costs will be sustainable",
      category: 'market',
      severity: 'medium'
    });
  }

  if (input.targetUsers === 'smb') {
    assumptions.push({
      id: `a${id++}`,
      text: "SMBs have budget and decision-making speed for this solution",
      category: 'market',
      severity: 'medium'
    });
  }

  if (input.targetUsers === 'enterprise') {
    assumptions.push({
      id: `a${id++}`,
      text: "Enterprise sales cycles and procurement processes are manageable",
      category: 'execution',
      severity: 'high'
    });
  }

  // Industry-specific assumptions
  if (input.industry === 'fintech') {
    assumptions.push({
      id: `a${id++}`,
      text: "Trust and security requirements can be met cost-effectively",
      category: 'technical',
      severity: 'high'
    });
  }

  if (input.industry === 'healthtech') {
    assumptions.push({
      id: `a${id++}`,
      text: "Healthcare compliance (HIPAA, etc.) is achievable at current scale",
      category: 'execution',
      severity: 'high'
    });
  }

  if (input.industry === 'edtech') {
    assumptions.push({
      id: `a${id++}`,
      text: "Educational institutions will adopt new technology quickly",
      category: 'market',
      severity: 'medium'
    });
  }

  // Universal assumptions
  assumptions.push({
    id: `a${id++}`,
    text: "Team has the capability to execute on the technical vision",
    category: 'execution',
    severity: 'low'
  });

  assumptions.push({
    id: `a${id++}`,
    text: "Market timing is right for this solution",
    category: 'market',
    severity: 'medium'
  });

  return assumptions;
}
