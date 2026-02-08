// utils/analysisEngine.ts

import {
    StartupInput,
    AnalysisResult,
    Assumption,
    RiskScore,
    ActionItem,
    Competitor,
    FailedStartup,
    TrendData,
    RiskSignal
} from '../types';

import {
    searchCompetitors,
    searchFailedStartups,
    getMarketTrends,
    checkTechnicalRisks,
    fetchIndustryNews,
} from '../services/api';

// =====================================================
// ASSUMPTION GENERATOR
// =====================================================

function generateAssumptions(
    input: StartupInput,
    competitors: Competitor[],
    trends: TrendData[]
): Assumption[] {
    const assumptions: Assumption[] = [];

    // 1. Target User Assumption
    const directCompetitors = competitors.filter(c => c.type === 'direct').length;
    assumptions.push({
        id: 'asm-1',
        text: `${formatTargetUsers(input.targetUsers)} are actively seeking solutions like ${input.name} and will switch from existing alternatives`,
        category: 'market',
        severity: directCompetitors > 3 ? 'high' : directCompetitors > 1 ? 'medium' : 'low',
        riskLevel: directCompetitors > 3 ? 'high' : directCompetitors > 1 ? 'medium' : 'low',
        source: 'Competitive Analysis',
        validated: false,
    });

    // 2. Revenue Model Assumption
    const revenueRisks: Record<string, { severity: 'high' | 'medium' | 'low'; text: string }> = {
        free: {
            severity: 'high',
            text: 'Users can be monetized later through ads, data, or premium features'
        },
        freemium: {
            severity: 'medium',
            text: 'Free users will convert to paid at sustainable rates (typically 2-5%)'
        },
        subscription: {
            severity: 'medium',
            text: 'Users will pay recurring fees and maintain low churn rates'
        },
        commission: {
            severity: 'medium',
            text: 'Transaction volume will be sufficient to generate meaningful revenue'
        },
        one_time: {
            severity: 'low',
            text: 'One-time purchase price justifies customer acquisition cost'
        },
    };

    const revenueInfo = revenueRisks[input.revenueModel] || revenueRisks.subscription;
    assumptions.push({
        id: 'asm-2',
        text: revenueInfo.text,
        category: 'market',
        severity: revenueInfo.severity,
        riskLevel: revenueInfo.severity,
        source: 'Business Model Analysis',
        validated: false,
    });

    // 3. Platform Assumption
    const platformAssumptions: Record<string, string> = {
        web: 'Users prefer web-based solutions and will access regularly via browser',
        app: 'Users will download, install, and regularly engage with a mobile app',
        saas: 'Businesses will integrate this into their workflow and pay monthly fees',
        api: 'Developers will adopt this API and build it into their products',
    };

    assumptions.push({
        id: 'asm-3',
        text: platformAssumptions[input.platform] || platformAssumptions.web,
        category: 'execution',
        severity: 'medium',
        riskLevel: 'medium',
        source: 'Platform Analysis',
        validated: false,
    });

    // 4. Competition Differentiation Assumption
    if (competitors.length > 0) {
        const topCompetitor = competitors[0];
        assumptions.push({
            id: 'asm-4',
            text: `${input.name} can meaningfully differentiate from ${topCompetitor.name} and capture market share`,
            category: 'market',
            severity: topCompetitor.threat === 'high' ? 'high' : 'medium',
            riskLevel: topCompetitor.threat === 'high' ? 'high' : 'medium',
            source: 'Competitive Analysis',
            validated: false,
        });
    }

    // 5. Dependency Assumption
    if (input.criticalDependency && input.criticalDependency !== 'none') {
        const dependencyRisks: Record<string, { severity: 'high' | 'medium' | 'low'; text: string }> = {
            api: {
                severity: 'high',
                text: 'Third-party API (e.g., OpenAI, Stripe) will remain accessible, stable, and affordably priced',
            },
            platform: {
                severity: 'high',
                text: 'Platform (iOS/Android/Shopify) policies will remain favorable and not block distribution',
            },
            regulation: {
                severity: 'high',
                text: 'Regulatory environment will remain stable or become more favorable',
            },
        };

        const depInfo = dependencyRisks[input.criticalDependency];
        if (depInfo) {
            assumptions.push({
                id: 'asm-5',
                text: depInfo.text,
                category: 'technical',
                severity: depInfo.severity,
                riskLevel: depInfo.severity,
                source: 'Dependency Analysis',
                validated: false,
            });
        }
    }

    // 6. Stage-based Assumption
    const stageAssumptions: Record<string, { text: string; severity: 'high' | 'medium' | 'low' }> = {
        idea: {
            text: 'The core problem hypothesis is validated and users urgently need a solution',
            severity: 'high',
        },
        mvp: {
            text: 'Current MVP features address the most critical user needs and pain points',
            severity: 'medium',
        },
        early_users: {
            text: 'Early users are representative of the broader target market',
            severity: 'low',
        },
    };

    const stageInfo = stageAssumptions[input.stage] || stageAssumptions.idea;
    assumptions.push({
        id: 'asm-6',
        text: stageInfo.text,
        category: 'execution',
        severity: stageInfo.severity,
        riskLevel: stageInfo.severity,
        source: 'Stage Analysis',
        validated: false,
    });

    // 7. Market Timing Assumption (based on trends)
    const risingTrends = trends.filter(t => t.trend === 'rising').length;
    const decliningTrends = trends.filter(t => t.trend === 'declining').length;

    assumptions.push({
        id: 'asm-7',
        text: `Market timing is favorable for ${input.industry} solutions right now`,
        category: 'market',
        severity: decliningTrends > risingTrends ? 'high' : risingTrends > decliningTrends ? 'low' : 'medium',
        riskLevel: decliningTrends > risingTrends ? 'high' : risingTrends > decliningTrends ? 'low' : 'medium',
        source: 'Trend Analysis',
        validated: false,
    });

    // 8. Team Execution Assumption
    assumptions.push({
        id: 'asm-8',
        text: 'The founding team can execute on this vision and adapt to market feedback',
        category: 'execution',
        severity: input.stage === 'idea' ? 'high' : 'medium',
        riskLevel: input.stage === 'idea' ? 'high' : 'medium',
        source: 'Execution Analysis',
        validated: false,
    });

    return assumptions;
}

// =====================================================
// RISK SCORE CALCULATOR
// =====================================================

function calculateRiskScore(
    input: StartupInput,
    competitors: Competitor[],
    failures: FailedStartup[],
    trends: TrendData[],
    signals: RiskSignal[]
): RiskScore {
    let technical = 25;
    let market = 25;
    let execution = 25;

    // ===== TECHNICAL RISK FACTORS =====

    // Critical dependency risks
    const dependencyRisks: Record<string, number> = {
        api: 15,
        platform: 20,
        regulation: 30,
        none: 0,
    };
    technical += dependencyRisks[input.criticalDependency] || 0;

    // Platform complexity
    const platformRisks: Record<string, number> = {
        app: 15,
        saas: 10,
        api: 10,
        web: 5,
    };
    technical += platformRisks[input.platform] || 5;

    // Industry-specific technical risks
    const techIntensiveIndustries = ['healthtech', 'fintech', 'ai'];
    if (techIntensiveIndustries.includes(input.industry.toLowerCase())) {
        technical += 10;
    }

    // Adjust based on API signals
    signals.filter(s => s.type === 'technical').forEach(signal => {
        if (signal.impact === 'negative') technical += 5;
        if (signal.impact === 'positive') technical -= 5;
    });

    // ===== MARKET RISK FACTORS =====

    // Competition intensity
    const directCompetitors = competitors.filter(c => c.type === 'direct').length;
    const highThreatCompetitors = competitors.filter(c => c.threat === 'high').length;

    market += directCompetitors * 6;
    market += highThreatCompetitors * 4;

    // Trend analysis
    if (trends.length > 0) {
        const avgInterest = trends.reduce((sum, t) => sum + t.interest, 0) / trends.length;

        if (avgInterest < 30) market += 20;
        else if (avgInterest < 50) market += 10;
        else if (avgInterest > 70) market -= 10;

        const decliningTrends = trends.filter(t => t.trend === 'declining').length;
        const risingTrends = trends.filter(t => t.trend === 'rising').length;

        market += decliningTrends * 8;
        market -= risingTrends * 5;
    }

    // Target user risks
    const targetUserRisks: Record<string, number> = {
        enterprise: 15,
        smb: 10,
        consumers: 5,
        developers: 5,
        students: 10,
    };
    market += targetUserRisks[input.targetUsers] || 5;

    // Market signals from news
    signals.filter(s => s.type === 'market').forEach(signal => {
        if (signal.impact === 'negative') market += 4;
        if (signal.impact === 'positive') market -= 4;
    });

    // ===== EXECUTION RISK FACTORS =====

    // Stage risks
    const stageRisks: Record<string, number> = {
        idea: 30,
        mvp: 15,
        early_users: 5,
    };
    execution += stageRisks[input.stage] || 15;

    // Revenue model complexity
    const revenueRisks: Record<string, number> = {
        free: 20,
        freemium: 10,
        subscription: 5,
        commission: 10,
        one_time: 5,
    };
    execution += revenueRisks[input.revenueModel] || 10;

    // Failure pattern matching
    const highSimilarityFailures = failures.filter(f => f.similarity > 50).length;
    const veryHighSimilarityFailures = failures.filter(f => f.similarity > 70).length;

    execution += highSimilarityFailures * 8;
    execution += veryHighSimilarityFailures * 5;

    // Execution signals
    signals.filter(s => s.type === 'execution').forEach(signal => {
        if (signal.impact === 'negative') execution += 5;
        if (signal.impact === 'positive') execution -= 5;
    });

    // ===== NORMALIZE & CALCULATE TOTAL =====

    technical = Math.min(100, Math.max(0, technical));
    market = Math.min(100, Math.max(0, market));
    execution = Math.min(100, Math.max(0, execution));

    const total = Math.round((technical + market + execution) / 3);

    // Determine label
    let label: 'Low' | 'Medium' | 'High' | 'Critical';
    if (total < 25) label = 'Low';
    else if (total < 50) label = 'Medium';
    else if (total < 75) label = 'High';
    else label = 'Critical';

    return {
        technical: Math.round(technical),
        market: Math.round(market),
        execution: Math.round(execution),
        total,
        label,
        signals,
    };
}

// =====================================================
// DECISION GENERATOR
// =====================================================

function generateDecision(
    riskScore: RiskScore,
    competitors: Competitor[],
    failures: FailedStartup[],
    input: StartupInput
): { decision: AnalysisResult['decision']; reason: string } {
    const { total, technical, market, execution } = riskScore;

    const directCompetitors = competitors.filter(c => c.type === 'direct').length;
    const highThreatCompetitors = competitors.filter(c => c.threat === 'high').length;
    const highSimilarityFailures = failures.filter(f => f.similarity > 60).length;

    // Critical conditions for BLOCK
    const criticalConditions = [
        total >= 75,
        (directCompetitors >= 5 && highThreatCompetitors >= 3),
        highSimilarityFailures >= 3,
        (technical >= 80 || market >= 80 || execution >= 80),
    ];

    const criticalCount = criticalConditions.filter(Boolean).length;

    // Decision logic
    if (criticalCount >= 2 || total >= 80) {
        return {
            decision: 'BLOCK',
            reason: generateBlockReason(riskScore, competitors, failures),
        };
    }

    if (total >= 55 || criticalCount >= 1) {
        return {
            decision: 'PROCEED_WITH_CAUTION',
            reason: generateCautionReason(riskScore, competitors, failures, input),
        };
    }

    if (total >= 35) {
        return {
            decision: 'CONDITIONAL_GO',
            reason: generateConditionalReason(competitors, input),
        };
    }

    return {
        decision: 'GO',
        reason: generateGoReason(riskScore, competitors),
    };
}

function generateBlockReason(
    riskScore: RiskScore,
    competitors: Competitor[],
    failures: FailedStartup[]
): string {
    const issues: string[] = [];

    if (riskScore.technical >= 70) {
        issues.push('critical technical risks');
    }
    if (riskScore.market >= 70) {
        issues.push('severe market competition');
    }
    if (riskScore.execution >= 70) {
        issues.push('significant execution challenges');
    }

    const directCompetitors = competitors.filter(c => c.type === 'direct').length;
    if (directCompetitors >= 5) {
        issues.push(`${directCompetitors} direct competitors already established`);
    }

    const highSimilarityFailures = failures.filter(f => f.similarity > 60);
    if (highSimilarityFailures.length >= 2) {
        issues.push(`${highSimilarityFailures.length} similar startups have failed`);
    }

    const issueText = issues.length > 0
        ? issues.join(', ')
        : 'multiple high-risk factors';

    return `High risk detected: ${issueText}. Recommend significant pivot, deeper validation, or exploring alternative opportunities before investing more resources.`;
}

function generateCautionReason(
    riskScore: RiskScore,
    competitors: Competitor[],
    failures: FailedStartup[],
    input: StartupInput
): string {
    const concerns: string[] = [];

    if (riskScore.market >= 50) {
        const directCompetitors = competitors.filter(c => c.type === 'direct').length;
        concerns.push(`competitive pressure from ${directCompetitors} direct players`);
    }

    if (riskScore.technical >= 50) {
        concerns.push('technical complexity requiring validation');
    }

    if (riskScore.execution >= 50) {
        concerns.push('execution challenges at current stage');
    }

    const failureLessons = failures.slice(0, 2).map(f => f.lesson).join('; ');

    return `Moderate risk level with notable concerns: ${concerns.join(', ')}. ${input.name} shows potential but requires careful validation. Key lessons from similar failures: ${failureLessons || 'validate core assumptions before scaling'}.`;
}

function generateConditionalReason(
    competitors: Competitor[],
    input: StartupInput
): string {
    const topCompetitor = competitors[0];
    const differentiator = topCompetitor
        ? `clear differentiation from ${topCompetitor.name}`
        : 'unique value proposition';

    return `Acceptable risk profile with manageable challenges. Key success factors for ${input.name}: validate ${input.revenueModel} model viability with paying customers, establish ${differentiator}, and build defensible moat before scaling.`;
}

function generateGoReason(
    riskScore: RiskScore,
    competitors: Competitor[]
): string {
    const positives: string[] = [];

    if (riskScore.technical < 30) {
        positives.push('low technical risk');
    }
    if (riskScore.market < 30) {
        positives.push('favorable market conditions');
    }
    if (riskScore.execution < 30) {
        positives.push('strong execution position');
    }

    const directCompetitors = competitors.filter(c => c.type === 'direct').length;
    if (directCompetitors < 3) {
        positives.push('limited direct competition');
    }

    const positiveText = positives.length > 0
        ? positives.join(', ')
        : 'favorable overall assessment';

    return `Favorable risk assessment with ${positiveText}. Recommend rapid prototyping, user validation, and iterative development. Move quickly to establish market position while conditions are favorable.`;
}

// =====================================================
// ACTION ITEMS GENERATOR
// =====================================================

function generateActionItems(
    input: StartupInput,
    riskScore: RiskScore,
    competitors: Competitor[],
    assumptions: Assumption[],
    failures: FailedStartup[]
): ActionItem[] {
    const actions: ActionItem[] = [];
    let actionId = 1;

    // ===== HIGH PRIORITY: Validate riskiest assumptions =====

    const highRiskAssumptions = assumptions.filter(a => a.riskLevel === 'high');
    highRiskAssumptions.slice(0, 2).forEach((assumption) => {
        actions.push({
            id: `action-${actionId++}`,
            text: `Validate assumption: "${assumption.text}" through 10+ user interviews`,
            priority: 'high',
            category: 'validate',
            timeframe: 'Week 1-2',
            completed: false,
        });
    });

    // ===== COMPETITION ACTIONS =====

    if (competitors.length > 0) {
        const topCompetitor = competitors[0];
        actions.push({
            id: `action-${actionId++}`,
            text: `Deep-dive analysis: Study ${topCompetitor.name}'s user reviews, complaints, and churned customers`,
            priority: 'high',
            category: 'validate',
            timeframe: 'Week 1',
            completed: false,
        });

        if (competitors.filter(c => c.type === 'direct').length >= 3) {
            actions.push({
                id: `action-${actionId++}`,
                text: 'Create competitive positioning matrix showing clear differentiation',
                priority: 'medium',
                category: 'validate',
                timeframe: 'Week 2',
                completed: false,
            });
        }
    }

    // ===== RISK-SPECIFIC ACTIONS =====

    if (riskScore.technical >= 50) {
        actions.push({
            id: `action-${actionId++}`,
            text: 'Build technical proof-of-concept for riskiest component before full development',
            priority: 'high',
            category: 'test',
            timeframe: 'Week 2-3',
            completed: false,
        });
    }

    if (riskScore.market >= 50) {
        actions.push({
            id: `action-${actionId++}`,
            text: 'Conduct 20+ user interviews to validate problem urgency and willingness to pay',
            priority: 'high',
            category: 'validate',
            timeframe: 'Week 1-2',
            completed: false,
        });

        actions.push({
            id: `action-${actionId++}`,
            text: 'Create landing page to test messaging and measure conversion rates',
            priority: 'medium',
            category: 'test',
            timeframe: 'Week 2',
            completed: false,
        });
    }

    if (riskScore.execution >= 50) {
        actions.push({
            id: `action-${actionId++}`,
            text: 'Define MVP scope with maximum 3 core features - cut everything else',
            priority: 'high',
            category: 'avoid',
            timeframe: 'Week 1',
            completed: false,
        });
    }

    // ===== STAGE-SPECIFIC ACTIONS =====

    if (input.stage === 'idea') {
        actions.push({
            id: `action-${actionId++}`,
            text: 'Talk to 30+ potential users before writing any code',
            priority: 'high',
            category: 'validate',
            timeframe: 'Week 1-3',
            completed: false,
        });

        actions.push({
            id: `action-${actionId++}`,
            text: 'Avoid: Building features without validated user demand',
            priority: 'high',
            category: 'avoid',
            timeframe: 'Ongoing',
            completed: false,
        });
    }

    if (input.stage === 'mvp') {
        actions.push({
            id: `action-${actionId++}`,
            text: 'Get 5 paying customers or signed LOIs before adding features',
            priority: 'high',
            category: 'validate',
            timeframe: 'Week 2-4',
            completed: false,
        });
    }

    if (input.stage === 'early_users') {
        actions.push({
            id: `action-${actionId++}`,
            text: 'Measure and optimize key metrics: activation, retention, referral rates',
            priority: 'high',
            category: 'measure',
            timeframe: 'Week 1-2',
            completed: false,
        });
    }

    // ===== REVENUE MODEL ACTIONS =====

    const revenueActions: Record<string, ActionItem> = {
        free: {
            id: `action-${actionId++}`,
            text: 'Define clear monetization path before launch - avoid "we\'ll figure it out later"',
            priority: 'high',
            category: 'validate',
            timeframe: 'Week 1',
            completed: false,
        },
        freemium: {
            id: `action-${actionId++}`,
            text: 'Test price points and premium features with target users before building',
            priority: 'medium',
            category: 'test',
            timeframe: 'Week 2-3',
            completed: false,
        },
        subscription: {
            id: `action-${actionId++}`,
            text: 'Validate willingness to pay monthly with 10+ target customers',
            priority: 'medium',
            category: 'validate',
            timeframe: 'Week 2',
            completed: false,
        },
        commission: {
            id: `action-${actionId++}`,
            text: 'Model unit economics at different transaction volumes',
            priority: 'medium',
            category: 'measure',
            timeframe: 'Week 2',
            completed: false,
        },
    };

    if (revenueActions[input.revenueModel]) {
        actions.push(revenueActions[input.revenueModel]);
    }

    // ===== DEPENDENCY ACTIONS =====

    if (input.criticalDependency && input.criticalDependency !== 'none') {
        actions.push({
            id: `action-${actionId++}`,
            text: `Identify 2-3 backup alternatives for ${input.criticalDependency} dependency`,
            priority: 'medium',
            category: 'avoid',
            timeframe: 'Week 2',
            completed: false,
        });

        if (input.criticalDependency === 'api') {
            actions.push({
                id: `action-${actionId++}`,
                text: 'Review API terms of service and pricing - model costs at scale',
                priority: 'medium',
                category: 'validate',
                timeframe: 'Week 1',
                completed: false,
            });
        }

        if (input.criticalDependency === 'regulation') {
            actions.push({
                id: `action-${actionId++}`,
                text: 'Consult with regulatory expert before significant investment',
                priority: 'high',
                category: 'validate',
                timeframe: 'Week 1-2',
                completed: false,
            });
        }
    }

    // ===== FAILURE PATTERN ACTIONS =====

    if (failures.length > 0) {
        const topFailure = failures[0];
        actions.push({
            id: `action-${actionId++}`,
            text: `Learn from ${topFailure.name}'s failure: ${topFailure.lesson}`,
            priority: 'medium',
            category: 'avoid',
            timeframe: 'Week 1',
            completed: false,
        });
    }

    // ===== GENERAL BEST PRACTICES =====

    actions.push({
        id: `action-${actionId++}`,
        text: 'Set up weekly metrics review to track progress against key assumptions',
        priority: 'low',
        category: 'measure',
        timeframe: 'Week 2',
        completed: false,
    });

    // Sort by priority and return
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return actions.slice(0, 12); // Limit to 12 actions
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function formatTargetUsers(targetUsers: string): string {
    const formatMap: Record<string, string> = {
        consumers: 'Consumers',
        smb: 'Small and medium businesses',
        enterprise: 'Enterprise companies',
        developers: 'Developers',
        students: 'Students',
    };

    return formatMap[targetUsers] || targetUsers;
}

// =====================================================
// MAIN ANALYSIS FUNCTION
// =====================================================

export async function runFullAnalysis(input: StartupInput): Promise<AnalysisResult> {
    const dataSourcesUsed: string[] = [];
    const startTime = Date.now();

    console.log('🔍 Starting BlindSpot analysis for:', input.name);

    // ===== PARALLEL API CALLS =====

    const [competitors, failures, trends, technicalSignals, newsSignals] = await Promise.all([
        searchCompetitors(input.idea, input.industry)
            .then(data => {
                dataSourcesUsed.push('DuckDuckGo Search API');
                console.log(`✅ Found ${data.length} competitors`);
                return data;
            })
            .catch(err => {
                console.error('❌ Competitor search failed:', err);
                return [];
            }),

        searchFailedStartups(input.idea, input.industry)
            .then(data => {
                dataSourcesUsed.push('Hacker News API');
                console.log(`✅ Found ${data.length} failure patterns`);
                return data;
            })
            .catch(err => {
                console.error('❌ Failure search failed:', err);
                return [];
            }),

        getMarketTrends([input.industry, ...input.idea.split(' ').slice(0, 3)])
            .then(data => {
                dataSourcesUsed.push('Trend Analysis');
                console.log(`✅ Analyzed ${data.length} trends`);
                return data;
            })
            .catch(err => {
                console.error('❌ Trend analysis failed:', err);
                return [];
            }),

        checkTechnicalRisks([input.criticalDependency], input.platform)
            .then(data => {
                if (data.length > 0) dataSourcesUsed.push('GitHub API');
                console.log(`✅ Found ${data.length} technical signals`);
                return data;
            })
            .catch(err => {
                console.error('❌ Technical risk check failed:', err);
                return [];
            }),

        fetchIndustryNews(input.industry)
            .then(data => {
                if (data.length > 0) dataSourcesUsed.push('News Sentiment Analysis');
                console.log(`✅ Found ${data.length} news signals`);
                return data;
            })
            .catch(err => {
                console.error('❌ News fetch failed:', err);
                return [];
            }),
    ]);

    // ===== COMBINE SIGNALS =====

    const allSignals: RiskSignal[] = [...technicalSignals, ...newsSignals];

    // ===== GENERATE ANALYSIS =====

    const assumptions = generateAssumptions(input, competitors, trends);
    console.log(`✅ Generated ${assumptions.length} assumptions`);

    const riskScore = calculateRiskScore(input, competitors, failures, trends, allSignals);
    console.log(`✅ Risk score calculated: ${riskScore.total}/100 (${riskScore.label})`);

    const { decision, reason } = generateDecision(riskScore, competitors, failures, input);
    console.log(`✅ Decision: ${decision}`);

    const actionItems = generateActionItems(input, riskScore, competitors, assumptions, failures);
    console.log(`✅ Generated ${actionItems.length} action items`);

    const analysisTime = Date.now() - startTime;
    console.log(`🎉 Analysis completed in ${analysisTime}ms`);

    // ===== RETURN RESULT =====

    return {
        input,
        assumptions,
        riskScore,
        competitors,
        failedStartups: failures,
        decision,
        decisionReason: reason,
        actionItems,
        trends,
        analyzedAt: new Date().toISOString(),
        dataSourcesUsed: [...new Set(dataSourcesUsed)], // Remove duplicates
    };
}

// =====================================================
// QUICK ANALYSIS (for testing/demo)
// =====================================================

export function runQuickAnalysis(input: StartupInput): AnalysisResult {
    // Synchronous version with fallback data for demos
    const { generateFallbackCompetitors, generateFallbackFailures, generateFallbackTrends } = require('../services/api');

    const competitors = generateFallbackCompetitors(input.idea, input.industry);
    const failures = generateFallbackFailures(input.industry);
    const trends = generateFallbackTrends([input.industry, input.idea.split(' ')[0]]);
    const signals: RiskSignal[] = [];

    const assumptions = generateAssumptions(input, competitors, trends);
    const riskScore = calculateRiskScore(input, competitors, failures, trends, signals);
    const { decision, reason } = generateDecision(riskScore, competitors, failures, input);
    const actionItems = generateActionItems(input, riskScore, competitors, assumptions, failures);

    return {
        input,
        assumptions,
        riskScore,
        competitors,
        failedStartups: failures,
        decision,
        decisionReason: reason,
        actionItems,
        trends,
        analyzedAt: new Date().toISOString(),
        dataSourcesUsed: ['Fallback Data'],
    };
}
