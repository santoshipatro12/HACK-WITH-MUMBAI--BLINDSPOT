// types/index.ts

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
  riskLevel: 'low' | 'medium' | 'high';
  source: string;
  validated: boolean;
}

export interface RiskSignal {
  type: 'technical' | 'market' | 'execution';
  source: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RiskScore {
  technical: number;
  market: number;
  execution: number;
  total: number;
  label: 'Low' | 'Medium' | 'High' | 'Critical';
  signals: RiskSignal[];
}

export interface Competitor {
  name: string;
  description: string;
  threat: 'low' | 'medium' | 'high';
  type: 'direct' | 'indirect' | 'substitute';
  url?: string;
  funding?: string;
  founded?: string;
  threatDescription?: string;
}

export interface FailedStartup {
  name: string;
  year: string;
  failureReasons: string[];
  patternTags: string[];
  raised?: string;
  reason: string;
  lesson: string;
  similarity: number;
  source: string;
}

export interface ActionItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  category: 'validate' | 'avoid' | 'test' | 'measure';
  timeframe: string;
  completed: boolean;
}

export interface TrendData {
  keyword: string;
  interest: number;
  trend: 'rising' | 'stable' | 'declining';
  relatedQueries: string[];
}

export interface AnalysisResult {
  input: StartupInput;
  assumptions: Assumption[];
  riskScore: RiskScore;
  competitors: Competitor[];
  failedStartups: FailedStartup[];
  decision: 'BLOCK' | 'PROCEED_WITH_CAUTION' | 'CONDITIONAL_GO' | 'GO';
  decisionReason: string;
  actionItems: ActionItem[];
  trends: TrendData[];
  analyzedAt: string;
  dataSourcesUsed: string[];
}

// API Response types
export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Module configuration type
export interface ModuleConfig {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number }>;
  gradient: string;
}