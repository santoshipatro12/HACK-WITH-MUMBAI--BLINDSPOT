// services/api.ts

import {
    Competitor,
    FailedStartup,
    TrendData,
    RiskSignal
} from '../types';

// CORS Proxy for API calls
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// =====================================================
// COMPETITOR SEARCH - DuckDuckGo API
// =====================================================

export async function searchCompetitors(
    query: string,
    industry: string
): Promise<Competitor[]> {
    try {
        const searchQuery = encodeURIComponent(
            `${query} ${industry} startup competitors alternatives`
        );

        const response = await fetch(
            `${CORS_PROXY}${encodeURIComponent(
                `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1`
            )}`
        );

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        const competitors: Competitor[] = [];

        // Parse related topics from DuckDuckGo
        if (data.RelatedTopics) {
            data.RelatedTopics.slice(0, 8).forEach((topic: any, index: number) => {
                if (topic.Text && topic.FirstURL) {
                    competitors.push({
                        name: extractCompanyName(topic.Text),
                        url: topic.FirstURL,
                        description: topic.Text.substring(0, 150) + '...',
                        type: index < 3 ? 'direct' : index < 6 ? 'indirect' : 'substitute',
                        threat: calculateThreatLevel(topic.Text, query),
                        threatDescription: generateThreatDescription(topic.Text, query),
                        founded: extractYear(topic.Text),
                    });
                }

                // Handle nested topics
                if (topic.Topics) {
                    topic.Topics.slice(0, 2).forEach((subTopic: any) => {
                        if (subTopic.Text && subTopic.FirstURL) {
                            competitors.push({
                                name: extractCompanyName(subTopic.Text),
                                url: subTopic.FirstURL,
                                description: subTopic.Text.substring(0, 150) + '...',
                                type: 'indirect',
                                threat: 'medium',
                                threatDescription: 'Related player in the space',
                            });
                        }
                    });
                }
            });
        }

        // Add abstract result if available
        if (data.Abstract && data.AbstractURL) {
            competitors.unshift({
                name: data.Heading || 'Industry Leader',
                url: data.AbstractURL,
                description: data.Abstract.substring(0, 150) + '...',
                type: 'direct',
                threat: 'high',
                threatDescription: 'Major player in the space with established market presence',
            });
        }

        // Return results or fallback
        return competitors.length > 0
            ? competitors.slice(0, 10)
            : generateFallbackCompetitors(industry);

    } catch (error) {
        console.error('Competitor search error:', error);
        return generateFallbackCompetitors(industry);
    }
}

// =====================================================
// FAILED STARTUPS SEARCH - Hacker News API
// =====================================================

export async function searchFailedStartups(
    idea: string,
    industry: string
): Promise<FailedStartup[]> {
    try {
        const searchQuery = encodeURIComponent(
            `${industry} startup failed shutdown postmortem`
        );

        const response = await fetch(
            `https://hn.algolia.com/api/v1/search?query=${searchQuery}&tags=story&hitsPerPage=15`
        );

        if (!response.ok) throw new Error('HN search failed');

        const data = await response.json();
        const failures: FailedStartup[] = [];

        if (data.hits) {
            data.hits.forEach((hit: any) => {
                const failure = parseFailureFromHN(hit, idea, industry);
                if (failure) {
                    failures.push(failure);
                }
            });
        }

        // Sort by similarity score
        failures.sort((a, b) => b.similarity - a.similarity);

        return failures.length > 0
            ? failures.slice(0, 5)
            : generateFallbackFailures(industry);

    } catch (error) {
        console.error('Failed startup search error:', error);
        return generateFallbackFailures(industry);
    }
}

// =====================================================
// MARKET TRENDS - DuckDuckGo + Analysis
// =====================================================

export async function getMarketTrends(
    keywords: string[]
): Promise<TrendData[]> {
    const trends: TrendData[] = [];

    try {
        for (const keyword of keywords.slice(0, 5)) {
            const searchQuery = encodeURIComponent(`${keyword} market trend 2024`);

            const response = await fetch(
                `${CORS_PROXY}${encodeURIComponent(
                    `https://api.duckduckgo.com/?q=${searchQuery}&format=json`
                )}`
            );

            if (response.ok) {
                const data = await response.json();
                trends.push({
                    keyword,
                    interest: calculateInterestScore(data),
                    trend: determineTrend(data),
                    relatedQueries: extractRelatedQueries(data),
                });
            } else {
                // Add fallback trend data
                trends.push(generateFallbackTrendItem(keyword));
            }
        }

        return trends.length > 0 ? trends : generateFallbackTrends(keywords);

    } catch (error) {
        console.error('Trends error:', error);
        return generateFallbackTrends(keywords);
    }
}

// =====================================================
// TECHNICAL RISK CHECK - GitHub API
// =====================================================

export async function checkTechnicalRisks(
    dependencies: string[],
    platform: string
): Promise<RiskSignal[]> {
    const signals: RiskSignal[] = [];

    // Filter out 'none' and empty dependencies
    const validDependencies = dependencies.filter(
        dep => dep && dep.toLowerCase() !== 'none'
    );

    // Check GitHub for dependency health
    for (const dep of validDependencies.slice(0, 3)) {
        try {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(dep)}&sort=stars&per_page=1`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();

                if (data.items && data.items[0]) {
                    const repo = data.items[0];
                    const lastUpdate = new Date(repo.updated_at);
                    const daysSinceUpdate = Math.floor(
                        (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    signals.push({
                        type: 'technical',
                        source: 'GitHub API',
                        description: `${dep}: ${repo.stargazers_count.toLocaleString()} stars, last updated ${daysSinceUpdate} days ago`,
                        impact: repo.stargazers_count > 1000 && daysSinceUpdate < 30
                            ? 'positive'
                            : daysSinceUpdate > 180
                                ? 'negative'
                                : 'neutral',
                    });

                    // Check for recent issues (potential instability)
                    if (repo.open_issues_count > 100) {
                        signals.push({
                            type: 'technical',
                            source: 'GitHub API',
                            description: `${dep} has ${repo.open_issues_count} open issues - may indicate instability`,
                            impact: 'negative',
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`GitHub check failed for ${dep}:`, error);
        }
    }

    // Add platform-specific risks
    signals.push(...getPlatformRisks(platform));

    return signals;
}

// =====================================================
// INDUSTRY NEWS & SENTIMENT - Hacker News API
// =====================================================

export async function fetchIndustryNews(
    industry: string
): Promise<RiskSignal[]> {
    try {
        const searchQuery = encodeURIComponent(`${industry} startup 2024`);

        const response = await fetch(
            `https://hn.algolia.com/api/v1/search?query=${searchQuery}&tags=story&hitsPerPage=10`
        );

        if (!response.ok) throw new Error('News fetch failed');

        const data = await response.json();
        const signals: RiskSignal[] = [];

        if (data.hits) {
            data.hits.slice(0, 5).forEach((hit: any) => {
                if (hit.title) {
                    const sentiment = analyzeSentiment(hit.title);
                    signals.push({
                        type: 'market',
                        source: 'Hacker News',
                        description: hit.title.substring(0, 100),
                        impact: sentiment,
                    });
                }
            });
        }

        return signals;

    } catch (error) {
        console.error('News fetch error:', error);
        return [];
    }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function extractCompanyName(text: string): string {
    // Try to extract company name from text
    const patterns = [
        /^([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)?)\s*[-–—]/,
        /^([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)?)\s+is/,
        /^([A-Z][a-zA-Z0-9]+(?:\.[a-zA-Z]+)?)\s/,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
    }

    // Fallback: first 2-3 words
    return text.split(' ').slice(0, 2).join(' ').replace(/[^a-zA-Z0-9\s]/g, '');
}

function extractYear(text: string): string | undefined {
    const match = text.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : undefined;
}

function calculateThreatLevel(
    description: string,
    query: string
): 'low' | 'medium' | 'high' {
    const queryWords = query.toLowerCase().split(/\s+/);
    const descLower = description.toLowerCase();
    const matchCount = queryWords.filter(word =>
        word.length > 3 && descLower.includes(word)
    ).length;

    if (matchCount >= 3) return 'high';
    if (matchCount >= 2) return 'medium';
    return 'low';
}

function generateThreatDescription(description: string, query: string): string {
    const threat = calculateThreatLevel(description, query);

    switch (threat) {
        case 'high':
            return 'High overlap with your value proposition. Direct competition expected.';
        case 'medium':
            return 'Moderate overlap. May compete for same user segments.';
        default:
            return 'Indirect competition. Different approach to similar problems.';
    }
}

function calculateInterestScore(data: any): number {
    const baseScore = 50;
    const abstractBonus = data.Abstract ? 20 : 0;
    const topicsBonus = Math.min((data.RelatedTopics?.length || 0) * 3, 25);
    const definitionBonus = data.Definition ? 10 : 0;

    return Math.min(100, Math.max(0, baseScore + abstractBonus + topicsBonus + definitionBonus));
}

function determineTrend(data: any): 'rising' | 'stable' | 'declining' {
    const topicsCount = data.RelatedTopics?.length || 0;
    const hasAbstract = !!data.Abstract;

    if (topicsCount > 5 && hasAbstract) return 'rising';
    if (topicsCount > 2 || hasAbstract) return 'stable';
    return 'declining';
}

function extractRelatedQueries(data: any): string[] {
    if (!data.RelatedTopics) return [];

    return data.RelatedTopics
        .slice(0, 5)
        .map((topic: any) => {
            if (topic.Text) {
                return topic.Text.split(' ').slice(0, 4).join(' ');
            }
            return '';
        })
        .filter(Boolean);
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
        'success', 'growth', 'funding', 'launch', 'milestone',
        'profitable', 'breakthrough', 'innovation', 'raises', 'valued',
        'expansion', 'revenue', 'growing', 'unicorn', 'ipo'
    ];

    const negativeWords = [
        'fail', 'shutdown', 'layoff', 'struggle', 'decline',
        'bankrupt', 'closes', 'downturn', 'crash', 'bust',
        'cuts', 'losses', 'struggling', 'shutting', 'failed'
    ];

    const textLower = text.toLowerCase();
    const posCount = positiveWords.filter(w => textLower.includes(w)).length;
    const negCount = negativeWords.filter(w => textLower.includes(w)).length;

    if (posCount > negCount) return 'positive';
    if (negCount > posCount) return 'negative';
    return 'neutral';
}

function parseFailureFromHN(
    hit: any,
    idea: string,
    industry: string
): FailedStartup | null {
    if (!hit.title) return null;

    const title = hit.title;
    const similarity = calculateSimilarity(title + ' ' + industry, idea);

    // Only include if somewhat relevant
    if (similarity < 10) return null;

    return {
        name: extractCompanyName(title) || 'Startup',
        year: new Date(hit.created_at).getFullYear().toString(),
        reason: title,
        failureReasons: extractFailureReasons(title),
        patternTags: extractPatternTags(title, industry),
        lesson: generateLesson(title),
        similarity,
        source: `news.ycombinator.com/item?id=${hit.objectID}`,
    };
}

function calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(
        text1.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );
    const words2 = new Set(
        text2.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );

    const intersection = [...words1].filter(w => words2.has(w)).length;
    const union = new Set([...words1, ...words2]).size;

    return union > 0 ? Math.round((intersection / union) * 100) : 0;
}

function extractFailureReasons(text: string): string[] {
    const reasons: string[] = [];
    const textLower = text.toLowerCase();

    if (textLower.includes('funding') || textLower.includes('money')) {
        reasons.push('Ran out of funding');
    }
    if (textLower.includes('market') || textLower.includes('demand')) {
        reasons.push('Insufficient market demand');
    }
    if (textLower.includes('competition') || textLower.includes('competitor')) {
        reasons.push('Outcompeted');
    }
    if (textLower.includes('pivot') || textLower.includes('product')) {
        reasons.push('Product-market fit issues');
    }
    if (textLower.includes('team') || textLower.includes('founder')) {
        reasons.push('Team issues');
    }

    return reasons.length > 0 ? reasons : ['Business model challenges'];
}

function extractPatternTags(text: string, industry: string): string[] {
    const tags: string[] = [industry];
    const textLower = text.toLowerCase();

    if (textLower.includes('b2b')) tags.push('B2B');
    if (textLower.includes('b2c') || textLower.includes('consumer')) tags.push('B2C');
    if (textLower.includes('saas')) tags.push('SaaS');
    if (textLower.includes('marketplace')) tags.push('Marketplace');
    if (textLower.includes('ai') || textLower.includes('ml')) tags.push('AI/ML');

    return tags;
}

function generateLesson(failureTitle: string): string {
    const lessons = [
        'Validate market demand with paying customers before scaling',
        'Focus on unit economics from day one',
        'Build a sustainable competitive moat early',
        'Ensure strong product-market fit before raising large rounds',
        'Maintain healthy cash runway of 18+ months',
        'Avoid premature scaling before finding PMF',
        'Listen to customer feedback and iterate quickly',
        'Build a diverse and complementary founding team',
    ];

    // Try to match lesson to failure context
    const titleLower = failureTitle.toLowerCase();

    if (titleLower.includes('funding') || titleLower.includes('money')) {
        return 'Maintain healthy cash runway and focus on capital efficiency';
    }
    if (titleLower.includes('market') || titleLower.includes('demand')) {
        return 'Validate market demand with paying customers before scaling';
    }
    if (titleLower.includes('competition')) {
        return 'Build a sustainable competitive moat early';
    }

    return lessons[Math.floor(Math.random() * lessons.length)];
}

function getPlatformRisks(platform: string): RiskSignal[] {
    const platformRisks: Record<string, RiskSignal[]> = {
        app: [
            {
                type: 'technical',
                source: 'Platform Analysis',
                description: 'App Store approval process can delay launches by 1-2 weeks',
                impact: 'negative'
            },
            {
                type: 'technical',
                source: 'Platform Analysis',
                description: 'Mobile-first approach aligns with current user behavior trends',
                impact: 'positive'
            },
            {
                type: 'execution',
                source: 'Platform Analysis',
                description: 'Requires development for both iOS and Android platforms',
                impact: 'negative'
            },
        ],
        web: [
            {
                type: 'technical',
                source: 'Platform Analysis',
                description: 'Lower distribution barriers compared to app stores',
                impact: 'positive'
            },
            {
                type: 'technical',
                source: 'Platform Analysis',
                description: 'Browser compatibility requires ongoing maintenance',
                impact: 'neutral'
            },
            {
                type: 'market',
                source: 'Platform Analysis',
                description: 'SEO can provide organic acquisition channel',
                impact: 'positive'
            },
        ],
        saas: [
            {
                type: 'market',
                source: 'Platform Analysis',
                description: 'Recurring revenue model provides predictable income',
                impact: 'positive'
            },
            {
                type: 'execution',
                source: 'Platform Analysis',
                description: 'Enterprise sales cycles can be 6-12 months',
                impact: 'negative'
            },
            {
                type: 'technical',
                source: 'Platform Analysis',
                description: 'Multi-tenancy architecture requires careful planning',
                impact: 'neutral'
            },
        ],
        api: [
            {
                type: 'market',
                source: 'Platform Analysis',
                description: 'Developer-focused products benefit from word-of-mouth',
                impact: 'positive'
            },
            {
                type: 'technical',
                source: 'Platform Analysis',
                description: 'API stability and versioning expectations are high',
                impact: 'neutral'
            },
            {
                type: 'execution',
                source: 'Platform Analysis',
                description: 'Documentation and developer experience are critical',
                impact: 'neutral'
            },
        ],
    };

    return platformRisks[platform.toLowerCase()] || platformRisks.web;
}

// =====================================================
// FALLBACK DATA GENERATORS
// =====================================================

export function generateFallbackCompetitors(
    industry: string
): Competitor[] {
    const industryCompetitors: Record<string, Competitor[]> = {
        fintech: [
            {
                name: 'Stripe',
                url: 'https://stripe.com',
                description: 'Payment processing infrastructure for the internet',
                type: 'indirect',
                threat: 'high',
                threatDescription: 'Dominant payment infrastructure provider',
                funding: '$2.2B',
                founded: '2010'
            },
            {
                name: 'Square',
                url: 'https://squareup.com',
                description: 'Financial services and digital payments company',
                type: 'indirect',
                threat: 'high',
                threatDescription: 'Expanding into multiple financial verticals',
                funding: 'Public',
                founded: '2009'
            },
            {
                name: 'Plaid',
                url: 'https://plaid.com',
                description: 'Financial data connectivity platform',
                type: 'substitute',
                threat: 'medium',
                threatDescription: 'Critical infrastructure for fintech apps',
                funding: '$734M',
                founded: '2013'
            },
            {
                name: 'Robinhood',
                url: 'https://robinhood.com',
                description: 'Commission-free investing platform',
                type: 'indirect',
                threat: 'medium',
                threatDescription: 'Strong brand with retail investors',
                funding: 'Public',
                founded: '2013'
            },
        ],
        healthtech: [
            {
                name: 'Teladoc',
                url: 'https://teladoc.com',
                description: 'Virtual healthcare services platform',
                type: 'direct',
                threat: 'high',
                threatDescription: 'Market leader in telehealth',
                funding: 'Public',
                founded: '2002'
            },
            {
                name: 'Headspace',
                url: 'https://headspace.com',
                description: 'Mental health and meditation app',
                type: 'indirect',
                threat: 'medium',
                threatDescription: 'Strong brand in wellness space',
                funding: '$215M',
                founded: '2010'
            },
            {
                name: 'Ro',
                url: 'https://ro.co',
                description: 'Direct-to-patient healthcare company',
                type: 'direct',
                threat: 'high',
                threatDescription: 'Fast-growing telehealth platform',
                funding: '$876M',
                founded: '2017'
            },
        ],
        saas: [
            {
                name: 'Notion',
                url: 'https://notion.so',
                description: 'All-in-one workspace for notes and docs',
                type: 'indirect',
                threat: 'medium',
                threatDescription: 'Rapidly expanding feature set',
                funding: '$343M',
                founded: '2016'
            },
            {
                name: 'Airtable',
                url: 'https://airtable.com',
                description: 'Flexible database and spreadsheet hybrid',
                type: 'substitute',
                threat: 'medium',
                threatDescription: 'Low-code tool adoption growing',
                funding: '$1.4B',
                founded: '2012'
            },
            {
                name: 'Monday.com',
                url: 'https://monday.com',
                description: 'Work operating system and project management',
                type: 'direct',
                threat: 'high',
                threatDescription: 'Strong marketing and sales motion',
                funding: 'Public',
                founded: '2012'
            },
        ],
        edtech: [
            {
                name: 'Coursera',
                url: 'https://coursera.org',
                description: 'Online learning platform with university courses',
                type: 'direct',
                threat: 'high',
                threatDescription: 'Established partnerships with top universities',
                funding: 'Public',
                founded: '2012'
            },
            {
                name: 'Duolingo',
                url: 'https://duolingo.com',
                description: 'Gamified language learning app',
                type: 'indirect',
                threat: 'medium',
                threatDescription: 'Best-in-class gamification expertise',
                funding: 'Public',
                founded: '2011'
            },
            {
                name: 'Udemy',
                url: 'https://udemy.com',
                description: 'Marketplace for online courses',
                type: 'direct',
                threat: 'high',
                threatDescription: 'Massive course library and instructor base',
                funding: 'Public',
                founded: '2010'
            },
        ],
        ecommerce: [
            {
                name: 'Shopify',
                url: 'https://shopify.com',
                description: 'E-commerce platform for online stores',
                type: 'direct',
                threat: 'high',
                threatDescription: 'Dominant SMB e-commerce platform',
                funding: 'Public',
                founded: '2006'
            },
            {
                name: 'BigCommerce',
                url: 'https://bigcommerce.com',
                description: 'Enterprise e-commerce platform',
                type: 'direct',
                threat: 'medium',
                threatDescription: 'Strong enterprise features',
                funding: 'Public',
                founded: '2009'
            },
        ],
        ai: [
            {
                name: 'OpenAI',
                url: 'https://openai.com',
                description: 'AI research and deployment company',
                type: 'indirect',
                threat: 'high',
                threatDescription: 'Leading AI research with GPT models',
                funding: '$11B+',
                founded: '2015'
            },
            {
                name: 'Anthropic',
                url: 'https://anthropic.com',
                description: 'AI safety company building reliable AI',
                type: 'indirect',
                threat: 'high',
                threatDescription: 'Strong focus on AI safety',
                funding: '$1.5B+',
                founded: '2021'
            },
            {
                name: 'Hugging Face',
                url: 'https://huggingface.co',
                description: 'Platform for ML models and datasets',
                type: 'substitute',
                threat: 'medium',
                threatDescription: 'Open-source ML community leader',
                funding: '$235M',
                founded: '2016'
            },
        ],
    };

    // Default competitors if industry not found
    const defaultCompetitors: Competitor[] = [
        {
            name: 'Established Incumbent',
            url: '#',
            description: `Major player in the ${industry} space with significant market share`,
            type: 'direct',
            threat: 'high',
            threatDescription: 'Market presence and resources pose significant threat'
        },
        {
            name: 'Venture-backed Startup',
            url: '#',
            description: 'Well-funded startup pursuing similar opportunity',
            type: 'direct',
            threat: 'medium',
            threatDescription: 'Aggressive growth strategy with strong funding'
        },
        {
            name: 'Tech Giant Initiative',
            url: '#',
            description: 'Big tech company exploring this space',
            type: 'indirect',
            threat: 'medium',
            threatDescription: 'Unlimited resources if they decide to prioritize'
        },
        {
            name: 'International Player',
            url: '#',
            description: 'Successful company from another market expanding globally',
            type: 'indirect',
            threat: 'low',
            threatDescription: 'May enter your market with proven playbook'
        },
    ];

    const industryKey = industry.toLowerCase().replace(/\s+/g, '');
    return industryCompetitors[industryKey] || defaultCompetitors;
}

export function generateFallbackFailures(industry: string): FailedStartup[] {
    const industryFailures: Record<string, FailedStartup[]> = {
        fintech: [
            {
                name: 'Digit',
                year: '2023',
                reason: 'Struggled with customer acquisition costs in competitive market',
                failureReasons: ['High CAC', 'Market competition'],
                patternTags: ['Fintech', 'Consumer', 'Savings'],
                lesson: 'Unit economics must work before scaling acquisition',
                similarity: 65,
                source: 'TechCrunch',
                raised: '$118M'
            },
            {
                name: 'Simple Bank',
                year: '2021',
                reason: 'Acquired by BBVA then shut down due to integration challenges',
                failureReasons: ['Acquisition integration', 'Strategic misalignment'],
                patternTags: ['Fintech', 'Neobank', 'B2C'],
                lesson: 'Acquisition is not always the win it seems - maintain independence if possible',
                similarity: 55,
                source: 'The Verge',
                raised: '$27M'
            },
            {
                name: 'Moven',
                year: '2020',
                reason: 'Pioneer in mobile banking but ran out of runway',
                failureReasons: ['Ran out of funding', 'Early to market'],
                patternTags: ['Fintech', 'Mobile Banking', 'Pioneer'],
                lesson: 'Being first to market means educating customers - expensive and slow',
                similarity: 50,
                source: 'Finextra',
                raised: '$44M'
            },
        ],
        healthtech: [
            {
                name: 'Theranos',
                year: '2018',
                reason: 'Technology never worked as claimed, fraudulent claims',
                failureReasons: ['Technology failure', 'Fraud'],
                patternTags: ['Healthtech', 'Diagnostics', 'Hardware'],
                lesson: 'Validate core technology rigorously before making claims',
                similarity: 40,
                source: 'WSJ',
                raised: '$700M'
            },
            {
                name: 'Pear Therapeutics',
                year: '2023',
                reason: 'Regulatory approval achieved but reimbursement challenges',
                failureReasons: ['Reimbursement issues', 'Sales challenges'],
                patternTags: ['Healthtech', 'Digital Therapeutics', 'FDA'],
                lesson: 'Healthcare sales cycles and reimbursement are extremely complex',
                similarity: 70,
                source: 'STAT News',
                raised: '$134M'
            },
        ],
        saas: [
            {
                name: 'Quibi',
                year: '2020',
                reason: 'Misread market demand for short-form premium content',
                failureReasons: ['Product-market fit', 'Timing'],
                patternTags: ['Media', 'Streaming', 'Mobile'],
                lesson: 'Validate demand before massive investment - even with star founders',
                similarity: 45,
                source: 'Variety',
                raised: '$1.75B'
            },
            {
                name: 'Katerra',
                year: '2021',
                reason: 'Construction tech startup failed to achieve promised efficiencies',
                failureReasons: ['Operational challenges', 'Overexpansion'],
                patternTags: ['Proptech', 'Construction', 'Vertically Integrated'],
                lesson: 'Vertical integration is capital-intensive - validate before scaling',
                similarity: 40,
                source: 'Bloomberg',
                raised: '$2B'
            },
        ],
        edtech: [
            {
                name: 'Udacity',
                year: '2023',
                reason: 'Struggled to compete after tech layoffs reduced demand',
                failureReasons: ['Market timing', 'Demand shift'],
                patternTags: ['Edtech', 'Tech Skills', 'Nanodegrees'],
                lesson: 'B2B education is cyclical - diversify customer base',
                similarity: 60,
                source: 'Business Insider',
                raised: '$160M'
            },
        ],
        ecommerce: [
            {
                name: 'Fab',
                year: '2015',
                reason: 'Scaled too fast, pivoted too often, burned cash',
                failureReasons: ['Overexpansion', 'Multiple pivots', 'Burn rate'],
                patternTags: ['Ecommerce', 'Flash Sales', 'Design'],
                lesson: 'Focus and discipline matter more than growth at all costs',
                similarity: 50,
                source: 'Fast Company',
                raised: '$336M'
            },
        ],
        ai: [
            {
                name: 'Anki',
                year: '2019',
                reason: 'Consumer robotics company failed to reach profitability',
                failureReasons: ['Consumer hardware margins', 'Funding gap'],
                patternTags: ['AI', 'Robotics', 'Consumer'],
                lesson: 'Consumer hardware is brutal - software margins are much better',
                similarity: 55,
                source: 'The Verge',
                raised: '$200M'
            },
        ],
    };

    const defaultFailures: FailedStartup[] = [
        {
            name: 'Generic Startup A',
            year: '2022',
            reason: 'Failed to achieve product-market fit before running out of runway',
            failureReasons: ['No PMF', 'Ran out of funding'],
            patternTags: ['Startup', 'Seed Stage'],
            lesson: 'Talk to users early and often - validate before building',
            similarity: 50,
            source: 'CB Insights',
            raised: '$5M'
        },
        {
            name: 'Generic Startup B',
            year: '2021',
            reason: 'Ran out of runway before generating meaningful revenue',
            failureReasons: ['Burn rate', 'Slow revenue growth'],
            patternTags: ['Startup', 'Series A'],
            lesson: 'Monitor burn rate carefully - default alive > default dead',
            similarity: 45,
            source: 'Startup Graveyard'
        },
        {
            name: 'Generic Startup C',
            year: '2023',
            reason: 'Competition from well-funded incumbents',
            failureReasons: ['Competition', 'Distribution disadvantage'],
            patternTags: ['Startup', 'Competitive Market'],
            lesson: 'Find an unfair advantage or niche before going broad',
            similarity: 40,
            source: 'TechCrunch'
        },
    ];

    const industryKey = industry.toLowerCase().replace(/\s+/g, '');
    return industryFailures[industryKey] || defaultFailures;
}

function generateFallbackTrendItem(keyword: string): TrendData {
    return {
        keyword,
        interest: Math.floor(Math.random() * 40) + 40,
        trend: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)] as 'rising' | 'stable' | 'declining',
        relatedQueries: [
            `${keyword} software`,
            `${keyword} app`,
            `best ${keyword}`,
            `${keyword} for business`,
        ],
    };
}

export function generateFallbackTrends(keywords: string[]): TrendData[] {
    return keywords.slice(0, 5).map(keyword => generateFallbackTrendItem(keyword));
}