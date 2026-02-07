import { StartupInput, AnalysisResult } from '../types';
import { extractAssumptions } from './assumptionEngine';
import { calculateRiskScore } from './riskEngine';
import { findCompetitors } from './competitorEngine';
import { findSimilarFailures } from './autopsyEngine';
import { makeDecision, generateActionItems } from './decisionEngine';

export function runBlindSpotAnalysis(input: StartupInput): AnalysisResult {
  // Module 1: Extract hidden assumptions
  const assumptions = extractAssumptions(input);

  // Module 2: Calculate risk scores
  const riskScore = calculateRiskScore(input);

  // Module 3: Find real competitors
  const competitors = findCompetitors(input);

  // Module 4: Match with failed startups
  const failedStartups = findSimilarFailures(input);

  // Module 5: Make decision
  const { decision, reason } = makeDecision(riskScore);

  // Module 6: Generate action items
  const actionItems = generateActionItems(input, riskScore);

  return {
    input,
    assumptions,
    riskScore,
    competitors,
    failedStartups,
    decision,
    decisionReason: reason,
    actionItems
  };
}

export { extractAssumptions } from './assumptionEngine';
export { calculateRiskScore } from './riskEngine';
export { findCompetitors } from './competitorEngine';
export { findSimilarFailures, patternLabels } from './autopsyEngine';
export { makeDecision, generateActionItems } from './decisionEngine';
