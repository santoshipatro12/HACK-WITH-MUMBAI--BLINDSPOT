// pages/Results.tsx

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Shield, Cpu, TrendingUp,
  Users, Target, Skull, CheckSquare, Lightbulb,
  AlertTriangle, ExternalLink, Zap, ChevronRight,
  CheckCircle2, XCircle, AlertCircle,
  Globe, Database, Clock, TrendingDown, Minus
} from 'lucide-react';
import { AnalysisResult, RiskSignal, TrendData } from '../types';
import './Results.css';

// Animation variants
const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    transition: {
      duration: 0.3
    }
  }
};

const contentVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

// Module configuration
const moduleConfig = [
  {
    id: 'assumptions',
    number: '01',
    title: 'Assumption Extraction',
    subtitle: 'Key assumptions identified from your startup inputs',
    icon: Lightbulb,
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
  },
  {
    id: 'risk',
    number: '02',
    title: 'Risk Classification',
    subtitle: 'Technical, market, and execution risk assessment',
    icon: Shield,
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
  },
  {
    id: 'competition',
    number: '03',
    title: 'Competition Reality',
    subtitle: 'Real-world competitors and alternatives',
    icon: Target,
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)'
  },
  {
    id: 'autopsy',
    number: '04',
    title: 'Startup Autopsy',
    subtitle: 'Similar startups that failed and lessons learned',
    icon: Skull,
    gradient: 'linear-gradient(135deg, #EF4444, #F87171)'
  },
  {
    id: 'decision',
    number: '05',
    title: 'AI Review Board Decision',
    subtitle: 'Final verdict based on comprehensive analysis',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #10B981, #34D399)'
  },
  {
    id: 'actions',
    number: '06',
    title: 'Actionable Output',
    subtitle: 'Reality checklist and concrete next steps',
    icon: CheckSquare,
    gradient: 'linear-gradient(135deg, #6366F1, #818CF8)'
  }
];

// =====================================================
// HELPER COMPONENTS
// =====================================================

// Risk Bar Component
const RiskBar: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  delay?: number;
}> = ({ label, value, icon, delay = 0 }) => {
  const getColor = (v: number) => {
    if (v < 30) return '#10B981';
    if (v < 60) return '#F59E0B';
    return '#EF4444';
  };

  const getLabel = (v: number) => {
    if (v < 30) return 'Low';
    if (v < 60) return 'Medium';
    return 'High';
  };

  return (
    <motion.div className="risk-bar-item" variants={itemVariants}>
      <div className="risk-bar-header">
        <span className="risk-bar-icon">{icon}</span>
        <span className="risk-bar-label">{label}</span>
        <span className="risk-bar-value" style={{ color: getColor(value) }}>
          {value}%
        </span>
      </div>
      <div className="risk-bar-track">
        <motion.div
          className="risk-bar-fill"
          style={{ backgroundColor: getColor(value) }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="risk-bar-level" style={{ color: getColor(value) }}>
        {getLabel(value)} Risk
      </span>
    </motion.div>
  );
};

// Data Source Badge Component
const DataSourceBadge: React.FC<{ sources: string[] }> = ({ sources }) => (
  <motion.div
    className="data-source-badge"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Database size={12} />
    <span>Data from: {sources.slice(0, 3).join(', ')}</span>
  </motion.div>
);

// Risk Signal Component
const RiskSignalItem: React.FC<{ signal: RiskSignal }> = ({ signal }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp size={12} />;
      case 'negative': return <TrendingDown size={12} />;
      default: return <Minus size={12} />;
    }
  };

  return (
    <div className={`signal-item signal-${signal.impact}`}>
      <div className="signal-header">
        <span className="signal-source">{signal.source}</span>
        <span
          className="signal-impact"
          style={{ color: getImpactColor(signal.impact) }}
        >
          {getImpactIcon(signal.impact)}
          {signal.impact}
        </span>
      </div>
      <p className="signal-text">{signal.description}</p>
    </div>
  );
};

// Trend Item Component
const TrendItem: React.FC<{ trend: TrendData }> = ({ trend }) => {
  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'rising': return <TrendingUp size={14} />;
      case 'declining': return <TrendingDown size={14} />;
      default: return <Minus size={14} />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'rising': return '#10B981';
      case 'declining': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  return (
    <div className={`trend-item trend-${trend.trend}`}>
      <span className="trend-keyword">{trend.keyword}</span>
      <div className="trend-stats">
        <span className="trend-interest">{trend.interest}%</span>
        <span
          className="trend-direction"
          style={{ color: getTrendColor(trend.trend) }}
        >
          {getTrendIcon(trend.trend)}
          {trend.trend}
        </span>
      </div>
    </div>
  );
};

// Loading Stage Component
const LoadingStage: React.FC<{
  icon: React.ReactNode;
  text: string;
  delay: number;
  isComplete: boolean;
}> = ({ icon, text, delay, isComplete }) => (
  <motion.div
    className="loading-stage"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    <span className="loading-stage-icon">{icon}</span>
    <span className="loading-stage-text">{text}</span>
    <motion.div
      className="loading-check"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isComplete ? 1 : 0, opacity: isComplete ? 1 : 0 }}
      transition={{ delay: delay + 0.5 }}
    >
      <CheckCircle2 size={16} />
    </motion.div>
  </motion.div>
);

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getDecisionIcon = (decision: string) => {
  const d = decision.toLowerCase();
  if (d.includes('block')) return <XCircle size={40} />;
  if (d.includes('go') && !d.includes('caution') && !d.includes('conditional')) {
    return <CheckCircle2 size={40} />;
  }
  return <AlertCircle size={40} />;
};

const getDecisionClass = (decision: string) => {
  const d = decision.toLowerCase();
  if (d.includes('block')) return 'decision-block';
  if (d === 'go') return 'decision-safe';
  return 'decision-caution';
};

const formatDecisionText = (decision: string) => {
  const formatted: Record<string, string> = {
    'BLOCK': '🛑 BLOCK',
    'PROCEED_WITH_CAUTION': '⚠️ PROCEED WITH CAUTION',
    'CONDITIONAL_GO': '🟡 CONDITIONAL GO',
    'GO': '✅ GO'
  };
  return formatted[decision] || decision;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'validate': return '🔍';
    case 'avoid': return '🚫';
    case 'test': return '🧪';
    case 'measure': return '📊';
    default: return '📋';
  }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStages, setLoadingStages] = useState<boolean[]>([false, false, false, false]);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const stored = sessionStorage.getItem('blindspot_result');
    if (stored) {
      // Simulate loading stages for better UX
      const stages = [500, 1000, 1500, 2000];
      stages.forEach((delay, index) => {
        setTimeout(() => {
          setLoadingStages(prev => {
            const newStages = [...prev];
            newStages[index] = true;
            return newStages;
          });
        }, delay);
      });

      setTimeout(() => {
        setResult(JSON.parse(stored));
        setIsLoading(false);
      }, 2500);
    } else {
      navigate('/analyze');
    }
  }, [navigate]);

  const handleContinue = () => {
    if (currentModule < moduleConfig.length - 1) {
      setDirection(1);
      setCurrentModule(prev => prev + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentModule > 0) {
      setDirection(-1);
      setCurrentModule(prev => prev - 1);
    }
  };

  const handleModuleClick = (index: number) => {
    setDirection(index > currentModule ? 1 : -1);
    setCurrentModule(index);
  };

  // Loading state
  if (isLoading || !result) {
    return (
      <div className="results-page loading">
        <div className="loading-container">
          <motion.div
            className="loading-icon-wrapper"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity }
            }}
          >
            <Shield size={48} />
          </motion.div>

          <motion.h2
            className="loading-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Analyzing Your Startup
          </motion.h2>

          <div className="loading-stages">
            <LoadingStage
              icon={<Globe size={16} />}
              text="Searching competitors..."
              delay={0}
              isComplete={loadingStages[0]}
            />
            <LoadingStage
              icon={<TrendingUp size={16} />}
              text="Analyzing market trends..."
              delay={0.3}
              isComplete={loadingStages[1]}
            />
            <LoadingStage
              icon={<Skull size={16} />}
              text="Finding failure patterns..."
              delay={0.6}
              isComplete={loadingStages[2]}
            />
            <LoadingStage
              icon={<Zap size={16} />}
              text="Generating insights..."
              delay={0.9}
              isComplete={loadingStages[3]}
            />
          </div>

          <motion.div
            className="loading-progress-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="loading-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  const currentConfig = moduleConfig[currentModule];
  const ModuleIcon = currentConfig.icon;
  const isLastModule = currentModule === moduleConfig.length - 1;
  const isFirstModule = currentModule === 0;

  // Render module content based on current module
  const renderModuleContent = () => {
    switch (currentConfig.id) {
      case 'assumptions':
        return (
          <motion.div
            className="module-items"
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            {result.dataSourcesUsed && result.dataSourcesUsed.length > 0 && (
              <DataSourceBadge sources={result.dataSourcesUsed} />
            )}

            {result.assumptions.map((assumption) => (
              <motion.div
                key={assumption.id}
                className="assumption-card"
                variants={itemVariants}
              >
                <div className="assumption-icon-wrapper">
                  <Lightbulb size={20} />
                </div>
                <div className="assumption-body">
                  <p className="assumption-text">{assumption.text}</p>
                  <div className="assumption-meta">
                    <span className={`risk-tag risk-${assumption.riskLevel?.toLowerCase() || assumption.severity}`}>
                      {assumption.riskLevel || assumption.severity} risk
                    </span>
                    {assumption.source && (
                      <span className="source-tag">
                        <Database size={10} /> {assumption.source}
                      </span>
                    )}
                    <span className="category-tag">
                      {assumption.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'risk':
        return (
          <motion.div
            className="risk-content"
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            <div className="risk-bars">
              <RiskBar
                label="Technical Risk"
                value={result.riskScore.technical}
                icon={<Cpu size={18} />}
                delay={0}
              />
              <RiskBar
                label="Market Risk"
                value={result.riskScore.market}
                icon={<TrendingUp size={18} />}
                delay={0.1}
              />
              <RiskBar
                label="Execution Risk"
                value={result.riskScore.execution}
                icon={<Users size={18} />}
                delay={0.2}
              />
            </div>

            {/* Risk Signals */}
            {result.riskScore.signals && result.riskScore.signals.length > 0 && (
              <motion.div
                className="risk-signals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="signals-title">
                  <AlertTriangle size={14} />
                  Risk Signals Detected
                </h4>
                <div className="signals-grid">
                  {result.riskScore.signals.slice(0, 4).map((signal, index) => (
                    <RiskSignalItem key={index} signal={signal} />
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              className="total-risk-display"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <span className="total-risk-label">Overall Risk Score</span>
              <div className="total-risk-score">
                <span
                  className="total-risk-number"
                  style={{
                    color: result.riskScore.total < 30 ? '#10B981' :
                      result.riskScore.total < 60 ? '#F59E0B' : '#EF4444'
                  }}
                >
                  {result.riskScore.total}
                </span>
                <span className="total-risk-max">/100</span>
              </div>
              <span
                className="total-risk-text"
                style={{
                  color: result.riskScore.total < 30 ? '#10B981' :
                    result.riskScore.total < 60 ? '#F59E0B' : '#EF4444'
                }}
              >
                {result.riskScore.label} Risk Level
              </span>
            </motion.div>
          </motion.div>
        );

      case 'competition':
        return (
          <motion.div
            className="module-items"
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            {result.dataSourcesUsed && (
              <DataSourceBadge sources={['DuckDuckGo API', 'Market Analysis']} />
            )}

            {result.competitors.length > 0 ? (
              result.competitors.map((competitor, index) => (
                <motion.div
                  key={`${competitor.name}-${index}`}
                  className="competitor-card"
                  variants={itemVariants}
                >
                  <div className="competitor-top">
                    <Target size={18} className="competitor-icon" />
                    <span className="competitor-name">{competitor.name}</span>
                    <span className={`type-tag type-${competitor.type?.toLowerCase()}`}>
                      {competitor.type}
                    </span>
                    <span className={`threat-tag threat-${competitor.threat}`}>
                      {competitor.threat} threat
                    </span>
                  </div>

                  <p className="competitor-description">{competitor.description}</p>

                  {competitor.threatDescription && (
                    <p className="competitor-threat">
                      <AlertTriangle size={14} />
                      {competitor.threatDescription}
                    </p>
                  )}

                  <div className="competitor-footer">
                    {competitor.founded && (
                      <span className="competitor-meta">
                        <Clock size={12} /> Founded {competitor.founded}
                      </span>
                    )}
                    {competitor.funding && (
                      <span className="competitor-meta">
                        💰 {competitor.funding}
                      </span>
                    )}
                    {competitor.url && competitor.url !== '#' && (
                      <a
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="competitor-link"
                      >
                        Visit <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div className="empty-state" variants={itemVariants}>
                <div className="empty-icon">
                  <Target size={48} />
                </div>
                <h3>No Direct Competitors Found</h3>
                <p>This could indicate a unique opportunity or an unproven market.</p>
              </motion.div>
            )}
          </motion.div>
        );

      case 'autopsy':
        return (
          <motion.div
            className="module-items"
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            {result.dataSourcesUsed && (
              <DataSourceBadge sources={['Hacker News API', 'Startup Database']} />
            )}

            {result.failedStartups.length > 0 ? (
              result.failedStartups.map((startup, index) => (
                <motion.div
                  key={`${startup.name}-${index}`}
                  className="autopsy-card"
                  variants={itemVariants}
                >
                  <div className="autopsy-top">
                    <Skull size={20} className="autopsy-icon" />
                    <span className="autopsy-name">{startup.name}</span>
                    <span className="autopsy-year">{startup.year}</span>
                    {startup.similarity && (
                      <span className="similarity-badge">
                        {startup.similarity}% similar
                      </span>
                    )}
                  </div>

                  <p className="autopsy-reason">{startup.reason}</p>

                  {startup.failureReasons && startup.failureReasons.length > 0 && (
                    <div className="failure-tags">
                      {startup.failureReasons.map((reason, i) => (
                        <span key={i} className="failure-tag">{reason}</span>
                      ))}
                    </div>
                  )}

                  {startup.lesson && (
                    <div className="autopsy-lesson">
                      <Lightbulb size={14} />
                      <span><strong>Lesson:</strong> {startup.lesson}</span>
                    </div>
                  )}

                  {startup.raised && (
                    <span className="autopsy-raised">
                      💸 Raised: {startup.raised}
                    </span>
                  )}

                  {startup.source && (
                    <a
                      href={`https://${startup.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="autopsy-source"
                    >
                      Source: {startup.source} <ExternalLink size={10} />
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div className="empty-state" variants={itemVariants}>
                <div className="empty-icon success">
                  <CheckCircle2 size={48} />
                </div>
                <h3>No Matching Failures Found</h3>
                <p>We couldn't find similar startups that failed. This is a positive signal!</p>
              </motion.div>
            )}
          </motion.div>
        );

      case 'decision':
        return (
          <motion.div
            className="decision-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`decision-display ${getDecisionClass(result.decision)}`}>
              <div className="decision-icon-large">
                {getDecisionIcon(result.decision)}
              </div>
              <h2 className="decision-verdict">
                {formatDecisionText(result.decision)}
              </h2>
              <div className="decision-divider"></div>
              <p className="decision-reasoning">{result.decisionReason}</p>

              {/* Market Trends in Decision */}
              {result.trends && result.trends.length > 0 && (
                <div className="decision-trends">
                  <h4 className="trends-title">
                    <TrendingUp size={14} />
                    Market Signals
                  </h4>
                  <div className="trends-grid">
                    {result.trends.slice(0, 3).map((trend, index) => (
                      <TrendItem key={index} trend={trend} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'actions':
        return (
          <motion.div
            className="module-items"
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            <div className="actions-summary">
              <span className="actions-count">
                {result.actionItems.filter(a => a.priority === 'high').length} high priority
              </span>
              <span className="actions-count">
                {result.actionItems.filter(a => a.priority === 'medium').length} medium priority
              </span>
              <span className="actions-count">
                {result.actionItems.filter(a => a.priority === 'low').length} low priority
              </span>
            </div>

            {result.actionItems.map((action) => (
              <motion.div
                key={action.id}
                className="action-card"
                variants={itemVariants}
              >
                <div className={`action-priority-badge priority-${action.priority}`}>
                  {action.priority}
                </div>
                <div className="action-body">
                  <p className="action-text">
                    <span className="action-category-icon">
                      {getCategoryIcon(action.category)}
                    </span>
                    {action.text}
                  </p>
                  <div className="action-meta">
                    <span className="action-category">{action.category}</span>
                    {action.timeframe && (
                      <span className="action-timeframe">
                        <Clock size={12} /> {action.timeframe}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`action-checkbox ${action.completed ? 'checked' : ''}`}>
                  <CheckSquare size={20} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="results-page">
      {/* Background Effects */}
      <div className="results-bg">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      {/* Header */}
      <header className="results-header">
        <motion.button
          className="header-back-btn"
          onClick={() => navigate('/analyze')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={18} />
          <span>New Analysis</span>
        </motion.button>

        <motion.div
          className="header-logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/')}
        >
          <div className="logo-icon">
            <Shield size={20} />
          </div>
          <span className="logo-text">
            Blind<span>Spot</span>
          </span>
        </motion.div>

        <motion.div
          className="header-step-indicator"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="step-current">{currentModule + 1}</span>
          <span className="step-divider">/</span>
          <span className="step-total">{moduleConfig.length}</span>
        </motion.div>
      </header>

      {/* Startup Info */}
      <motion.div
        className="startup-banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="startup-name">{result.input.name}</h1>
        <p className="startup-idea">{result.input.idea}</p>
        <div className="startup-tags">
          <span className="startup-tag">{result.input.industry}</span>
          <span className="startup-tag">{result.input.platform}</span>
          <span className="startup-tag">{result.input.stage}</span>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {moduleConfig.map((mod, index) => {
          const StepIcon = mod.icon;
          const isActive = index === currentModule;
          const isCompleted = index < currentModule;

          return (
            <motion.button
              key={mod.id}
              className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => handleModuleClick(index)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="step-icon-wrapper"
                style={{ background: isActive || isCompleted ? mod.gradient : undefined }}
              >
                <StepIcon size={16} />
              </div>
              <span className="step-label">{mod.title.split(' ')[0]}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Main Module Card */}
      <div className="module-container">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentConfig.id}
            className="module-card"
            custom={direction}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Module Header */}
            <div className="module-header">
              <div
                className="module-number"
                style={{ background: currentConfig.gradient }}
              >
                {currentConfig.number}
              </div>
              <div className="module-icon-wrapper">
                <ModuleIcon
                  size={28}
                  style={{
                    color: currentConfig.gradient.includes('#8B5CF6') ? '#8B5CF6' :
                      currentConfig.gradient.includes('#F59E0B') ? '#F59E0B' :
                        currentConfig.gradient.includes('#EC4899') ? '#EC4899' :
                          currentConfig.gradient.includes('#EF4444') ? '#EF4444' :
                            currentConfig.gradient.includes('#10B981') ? '#10B981' : '#6366F1'
                  }}
                />
              </div>
              <div className="module-title-section">
                <h2 className="module-title">{currentConfig.title}</h2>
                <p className="module-subtitle">{currentConfig.subtitle}</p>
              </div>
            </div>

            {/* Module Content */}
            <div className="module-body">
              {renderModuleContent()}
            </div>

            {/* Module Footer */}
            <div className="module-footer">
              <button
                className={`nav-btn nav-btn-back ${isFirstModule ? 'hidden' : ''}`}
                onClick={handleBack}
                disabled={isFirstModule}
              >
                <ArrowLeft size={18} />
                <span>Previous</span>
              </button>

              <div className="footer-progress">
                {moduleConfig.map((_, index) => (
                  <div
                    key={index}
                    className={`progress-dot ${index === currentModule ? 'active' : ''} ${index < currentModule ? 'completed' : ''}`}
                  />
                ))}
              </div>

              <motion.button
                className="nav-btn nav-btn-continue"
                onClick={handleContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{isLastModule ? 'View Dashboard' : 'Continue'}</span>
                {isLastModule ? <ChevronRight size={18} /> : <ArrowRight size={18} />}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Analysis Meta Info */}
      {result.analyzedAt && (
        <motion.div
          className="analysis-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Clock size={12} />
          <span>Analyzed {new Date(result.analyzedAt).toLocaleString()}</span>
          {result.dataSourcesUsed && (
            <>
              <span className="meta-divider">•</span>
              <Database size={12} />
              <span>{result.dataSourcesUsed.length} data sources</span>
            </>
          )}
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        className="results-disclaimer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AlertTriangle size={14} />
        <span>Analysis combines real-time API data with rule-based logic</span>
      </motion.div>
    </div>
  );
}