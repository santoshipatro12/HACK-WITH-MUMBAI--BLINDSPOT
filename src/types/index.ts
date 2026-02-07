export interface StartupInput {
  name: string;
  idea: string;
  targetUsers: string;
  industry: string;
  platform: string;
  revenueModel: string;
  stage: string;
  criticalDependency: string;
}

export interface Assumption {
  id: string;
  text: string;
  category: 'market' | 'technical' | 'execution';
  severity: 'low' | 'medium' | 'high';
  riskLevel?: string;
}

export interface RiskScore {
  technical: number;
  market: number;
  execution: number;
  total: number;
  label: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Competitor {
  name: string;
  description: string;
  threat: 'low' | 'medium' | 'high';
  type?: string;
  url?: string;
}

export interface FailedStartup {
  name: string;
  year: string;
  failureReasons: string[];
  patternTags: string[];
  raised?: string;
  reason?: string;
  lesson?: string;
}

export interface ActionItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  category: 'validate' | 'avoid' | 'test' | 'measure';
}

export interface AnalysisResult {
  input: StartupInput;
  assumptions: Assumption[];
  riskScore: RiskScore;
  competitors: Competitor[];
  failedStartups: FailedStartup[];
  decision: 'BLOCK' | 'PROCEED_WITH_CONDITIONS' | 'SAFE_TO_BUILD';
  decisionReason: string;
  actionItems: ActionItem[];
}
