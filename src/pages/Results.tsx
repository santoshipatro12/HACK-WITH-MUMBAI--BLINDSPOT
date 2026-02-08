import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RefreshCw, Shield, Cpu, TrendingUp, 
  Users, Target, Skull, CheckSquare, Lightbulb,
  Download, Share2
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import { RiskMeter } from '../components/modules/RiskMeter';
import { DecisionBadge } from '../components/modules/DecisionBadge';
import { AssumptionItem } from '../components/modules/AssumptionItem';
import { CompetitorItem } from '../components/modules/CompetitorItem';
import { FailedStartupItem } from '../components/modules/FailedStartupItem';
import { ActionItem } from '../components/modules/ActionItem';
import { AnalysisResult } from '../types';

export function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [showAllModules, setShowAllModules] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('blindspot_result');
    if (stored) {
      setResult(JSON.parse(stored));
      // Animate through modules
      const timer = setInterval(() => {
        setActiveModule(prev => {
          if (prev < 5) return prev + 1;
          clearInterval(timer);
          setShowAllModules(true);
          return prev;
        });
      }, 800);
      return () => clearInterval(timer);
    } else {
      navigate('/analyze');
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-steel-blue)',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  const modules = [
    { id: 'assumptions', label: 'Assumptions', icon: Lightbulb, count: result.assumptions.length },
    { id: 'risk', label: 'Risk Analysis', icon: Shield, count: 3 },
    { id: 'competitors', label: 'Competition', icon: Target, count: result.competitors.length },
    { id: 'autopsy', label: 'Startup Autopsy', icon: Skull, count: result.failedStartups.length },
    { id: 'decision', label: 'Decision', icon: Shield, count: 1 },
    { id: 'actions', label: 'Action Items', icon: CheckSquare, count: result.actionItems.length },
  ];

  const getRiskColor = (value: number) => {
    if (value < 30) return 'var(--color-success)';
    if (value < 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div className="results-page">
      <Navbar showAuthButtons={false} />

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <Button variant="ghost" onClick={() => navigate('/analyze')}>
            <ArrowLeft size={16} />
            New Analysis
          </Button>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Button variant="secondary" size="sm">
              <Share2 size={16} />
              Share
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={16} />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Startup Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="results-header"
        >
          <h1 className="startup-name">{result.input.name}</h1>
          <p className="startup-idea">{result.input.idea}</p>
          <div className="startup-tags">
            <span className="startup-tag">{result.input.industry}</span>
            <span className="startup-tag">{result.input.platform}</span>
            <span className="startup-tag">{result.input.stage}</span>
          </div>
        </motion.div>

        {/* Progress Pipeline */}
        {!showAllModules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-2xl)',
              flexWrap: 'wrap'
            }}
          >
            {modules.map((mod, index) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0.3, scale: 0.9 }}
                animate={{ 
                  opacity: index <= activeModule ? 1 : 0.3,
                  scale: index === activeModule ? 1.1 : 1,
                  background: index <= activeModule ? 'var(--color-steel-blue)' : 'var(--color-surface-secondary)'
                }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  padding: 'var(--space-sm) var(--space-md)',
                  borderRadius: 'var(--radius-full)',
                  color: index <= activeModule ? 'white' : 'var(--color-text-muted)',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                <mod.icon size={14} />
                {mod.label}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {showAllModules && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="results-grid"
            >
              {/* Left Sidebar */}
              <div className="results-sidebar">
                {/* Decision Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <DecisionBadge decision={result.decision} reason={result.decisionReason} />
                </motion.div>

                {/* Risk Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="risk-summary"
                >
                  <div className="risk-summary-header">
                    <Shield size={20} style={{ color: 'var(--color-steel-blue)' }} />
                    Risk Assessment
                  </div>
                  <div className="risk-meters">
                    <RiskMeter 
                      label="Technical Risk" 
                      value={result.riskScore.technical} 
                      icon={<Cpu size={16} />}
                      delay={0.3}
                    />
                    <RiskMeter 
                      label="Market Risk" 
                      value={result.riskScore.market} 
                      icon={<TrendingUp size={16} />}
                      delay={0.4}
                    />
                    <RiskMeter 
                      label="Execution Risk" 
                      value={result.riskScore.execution} 
                      icon={<Users size={16} />}
                      delay={0.5}
                    />
                  </div>
                  
                  <div className="total-score">
                    <span className="total-label">Overall Risk Score</span>
                    <div className="total-value">
                      <motion.span
                        className="total-number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: 'spring' }}
                        style={{ color: getRiskColor(result.riskScore.total) }}
                      >
                        {result.riskScore.total}
                      </motion.span>
                      <span className="total-max">/100</span>
                    </div>
                  </div>
                  <div 
                    className="total-label-text"
                    style={{ color: getRiskColor(result.riskScore.total) }}
                  >
                    {result.riskScore.label} Risk
                  </div>
                </motion.div>

                {/* Re-run Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/analyze')}
                    style={{ width: '100%' }}
                  >
                    <RefreshCw size={16} />
                    Run New Analysis
                  </Button>
                </motion.div>
              </div>

              {/* Main Content Area */}
              <div className="results-main">
                {/* Module 1: Assumptions */}
                <div className="pipeline-module">
                  <div className="module-header">
                    <div className="module-number">1</div>
                    <div>
                      <div className="module-title">Assumption Extraction</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        Hidden assumptions derived from your inputs
                      </div>
                    </div>
                  </div>
                  <div className="module-content">
                    {result.assumptions.map((assumption, index) => (
                      <AssumptionItem key={assumption.id} assumption={assumption} index={index} />
                    ))}
                  </div>
                </div>

                {/* Module 2: Competition */}
                <div className="pipeline-module">
                  <div className="module-header">
                    <div className="module-number">2</div>
                    <div>
                      <div className="module-title">Competition Reality</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        Your real competition — not just other startups
                      </div>
                    </div>
                  </div>
                  <div className="module-content">
                    {result.competitors.map((competitor, index) => (
                      <CompetitorItem key={competitor.name} competitor={competitor} index={index} />
                    ))}
                  </div>
                </div>

                {/* Module 3: Startup Autopsy */}
                <div className="pipeline-module">
                  <div className="module-header">
                    <div className="module-number">3</div>
                    <div>
                      <div className="module-title">Startup Autopsy</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        Similar startups that failed — learn from their mistakes
                      </div>
                    </div>
                  </div>
                  <div className="module-content">
                    {result.failedStartups.length > 0 ? (
                      result.failedStartups.map((startup, index) => (
                        <FailedStartupItem key={startup.name} startup={startup} index={index} />
                      ))
                    ) : (
                      <div className="empty-state">
                        <Skull size={48} />
                        <p>No matching failure patterns found. That's a good sign!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Module 4: Action Items */}
                <div className="pipeline-module">
                  <div className="module-header">
                    <div className="module-number">4</div>
                    <div>
                      <div className="module-title">Reality Checklist</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        Concrete next steps to validate and reduce risk
                      </div>
                    </div>
                  </div>
                  <div className="module-content">
                    {result.actionItems.map((action, index) => (
                      <ActionItem key={action.id} action={action} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showAllModules ? 1 : 0 }}
          transition={{ delay: 1 }}
          className="ai-disclaimer"
        >
          💡 This analysis uses rule-based logic — AI improves clarity, not decision-making.
        </motion.div>
      </div>
    </div>
  );
}
