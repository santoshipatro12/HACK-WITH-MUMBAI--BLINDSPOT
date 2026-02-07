import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RefreshCw, Shield, Cpu, TrendingUp, 
  Users, Target, Skull, CheckSquare, Lightbulb,
  Download, Share2, Zap, AlertTriangle, ExternalLink
} from 'lucide-react';
import { AnalysisResult } from '../types';

// Styles object
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0B0B0F',
    color: '#F8FAFC',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: 'relative' as const,
  },
  loadingPage: {
    minHeight: '100vh',
    background: '#0B0B0F',
    color: '#F8FAFC',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(139, 92, 246, 0.2)',
    borderTopColor: '#8B5CF6',
    borderRadius: '50%',
  },
  orbsContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 0,
    overflow: 'hidden' as const,
  },
  orb: {
    position: 'absolute' as const,
    borderRadius: '50%',
    filter: 'blur(100px)',
  },
  orb1: {
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
    top: '-200px',
    right: '-150px',
  },
  orb2: {
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-150px',
  },
  orb3: {
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  header: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'rgba(11, 11, 15, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#94A3B8',
    background: 'rgba(30, 30, 46, 0.6)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    color: '#F8FAFC',
    fontSize: '20px',
    fontWeight: 700,
  },
  logoHighlight: {
    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#94A3B8',
    background: 'rgba(30, 30, 46, 0.6)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  container: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '40px',
    position: 'relative' as const,
    zIndex: 1,
  },
  startupInfo: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  startupName: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#F8FAFC',
    margin: '0 0 12px',
    letterSpacing: '-1px',
  },
  startupIdea: {
    fontSize: '17px',
    color: '#94A3B8',
    margin: '0 0 20px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tagsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  tag: {
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#A5B4FC',
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '100px',
    textTransform: 'capitalize' as const,
  },
  pipelineProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
    marginBottom: '50px',
  },
  pipelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#4B5563',
    background: 'rgba(30, 30, 46, 0.4)',
    borderRadius: '100px',
    transition: 'all 0.3s ease',
  },
  pipelineStepActive: {
    color: '#F8FAFC',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: '30px',
    alignItems: 'start',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    position: 'sticky' as const,
    top: '100px',
  },
  decisionBadge: {
    padding: '28px',
    background: 'rgba(30, 30, 46, 0.6)',
    borderRadius: '20px',
    textAlign: 'center' as const,
    backdropFilter: 'blur(10px)',
  },
  decisionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    color: '#8B5CF6',
    marginBottom: '16px',
  },
  decisionTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#F8FAFC',
    marginBottom: '12px',
  },
  decisionReason: {
    fontSize: '14px',
    color: '#94A3B8',
    lineHeight: 1.5,
    margin: 0,
  },
  riskCard: {
    padding: '24px',
    background: 'rgba(30, 30, 46, 0.6)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
  },
  riskCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#F8FAFC',
    marginBottom: '20px',
  },
  riskMeters: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    marginBottom: '24px',
  },
  riskMeter: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  riskMeterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
  },
  riskMeterLabel: {
    color: '#94A3B8',
    flex: 1,
  },
  riskMeterBar: {
    height: '6px',
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden' as const,
  },
  totalRisk: {
    textAlign: 'center' as const,
    paddingTop: '20px',
    borderTop: '1px solid rgba(139, 92, 246, 0.1)',
  },
  totalLabel: {
    fontSize: '12px',
    color: '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  totalValue: {
    fontSize: '48px',
    fontWeight: 700,
    margin: '8px 0',
  },
  totalMax: {
    fontSize: '20px',
    color: '#4B5563',
  },
  rerunBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#A5B4FC',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  moduleCard: {
    background: 'rgba(30, 30, 46, 0.6)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    borderRadius: '20px',
    overflow: 'hidden' as const,
    backdropFilter: 'blur(10px)',
  },
  moduleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
    background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.05), transparent)',
  },
  moduleNumber: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    color: '#8B5CF6',
    background: 'rgba(139, 92, 246, 0.15)',
    borderRadius: '12px',
    flexShrink: 0,
  },
  moduleTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#F8FAFC',
    margin: 0,
  },
  moduleSubtitle: {
    fontSize: '13px',
    color: '#64748B',
    margin: '4px 0 0',
  },
  moduleContent: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  assumptionItem: {
    display: 'flex',
    gap: '14px',
    padding: '16px',
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.1)',
  },
  assumptionIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(139, 92, 246, 0.15)',
    borderRadius: '10px',
    color: '#A78BFA',
    flexShrink: 0,
  },
  assumptionText: {
    fontSize: '14px',
    color: '#E2E8F0',
    margin: '0 0 8px',
    lineHeight: 1.5,
  },
  competitorItem: {
    padding: '16px',
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.1)',
  },
  competitorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  competitorName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#F8FAFC',
  },
  competitorThreat: {
    fontSize: '13px',
    color: '#94A3B8',
    margin: '0 0 10px',
    lineHeight: 1.5,
  },
  competitorLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#8B5CF6',
    textDecoration: 'none',
  },
  failedItem: {
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.15)',
  },
  failedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  failedName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#F8FAFC',
    flex: 1,
  },
  failedYear: {
    fontSize: '12px',
    color: '#64748B',
  },
  failedReason: {
    fontSize: '13px',
    color: '#94A3B8',
    margin: '0 0 8px',
    lineHeight: 1.5,
  },
  failedLesson: {
    fontSize: '13px',
    color: '#FCD34D',
    margin: 0,
    lineHeight: 1.5,
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.1)',
  },
  actionText: {
    fontSize: '14px',
    color: '#E2E8F0',
    margin: '0 0 6px',
    lineHeight: 1.5,
  },
  actionCategory: {
    fontSize: '11px',
    color: '#64748B',
    textTransform: 'capitalize' as const,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#4B5563',
  },
  disclaimer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '40px',
    padding: '16px',
    fontSize: '13px',
    color: '#64748B',
    background: 'rgba(30, 30, 46, 0.4)',
    borderRadius: '12px',
  },
};

// Helper function for risk badge styles
const getRiskBadgeStyle = (level?: string) => {
  const base = {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    padding: '4px 10px',
    borderRadius: '100px',
  };
  
  const l = (level || '').toLowerCase();
  switch (l) {
    case 'high':
      return { ...base, color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.15)' };
    case 'medium':
      return { ...base, color: '#FCD34D', background: 'rgba(245, 158, 11, 0.15)' };
    case 'low':
      return { ...base, color: '#86EFAC', background: 'rgba(34, 197, 94, 0.15)' };
    default:
      return base;
  }
};

const getTypeBadgeStyle = (type?: string) => {
  const base = {
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    padding: '4px 10px',
    borderRadius: '100px',
  };
  
  const t = (type || '').toLowerCase();
  switch (t) {
    case 'direct':
      return { ...base, color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.15)' };
    case 'indirect':
      return { ...base, color: '#FCD34D', background: 'rgba(245, 158, 11, 0.15)' };
    case 'substitute':
      return { ...base, color: '#A5B4FC', background: 'rgba(139, 92, 246, 0.15)' };
    default:
      return base;
  }
};

const getPriorityBadgeStyle = (priority: string) => {
  const base = {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    padding: '6px 12px',
    borderRadius: '8px',
    flexShrink: 0,
  };
  
  switch (priority) {
    case 'high':
      return { ...base, color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.15)' };
    case 'medium':
      return { ...base, color: '#FCD34D', background: 'rgba(245, 158, 11, 0.15)' };
    case 'low':
      return { ...base, color: '#86EFAC', background: 'rgba(34, 197, 94, 0.15)' };
    default:
      return base;
  }
};

const getDecisionStyle = (decision: string) => {
  const isGo = decision.toLowerCase().includes('go');
  const isKill = decision.toLowerCase().includes('kill');
  
  if (isKill) {
    return {
      ...styles.decisionBadge,
      border: '2px solid rgba(239, 68, 68, 0.4)',
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(30, 30, 46, 0.6))',
    };
  } else if (isGo) {
    return {
      ...styles.decisionBadge,
      border: '2px solid rgba(34, 197, 94, 0.4)',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(30, 30, 46, 0.6))',
    };
  }
  return {
    ...styles.decisionBadge,
    border: '2px solid rgba(245, 158, 11, 0.4)',
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(30, 30, 46, 0.6))',
  };
};

const getRiskColor = (value: number) => {
  if (value < 30) return '#22C55E';
  if (value < 60) return '#F59E0B';
  return '#EF4444';
};

// Components
const GlowingOrbs = () => (
  <div style={styles.orbsContainer}>
    <div style={{ ...styles.orb, ...styles.orb1 }}></div>
    <div style={{ ...styles.orb, ...styles.orb2 }}></div>
    <div style={{ ...styles.orb, ...styles.orb3 }}></div>
  </div>
);

const RiskMeter = ({ label, value, icon, delay = 0 }: { 
  label: string; 
  value: number; 
  icon: React.ReactNode;
  delay?: number;
}) => (
  <motion.div 
    style={styles.riskMeter}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    <div style={styles.riskMeterHeader}>
      <span style={{ color: '#64748B', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={styles.riskMeterLabel}>{label}</span>
      <span style={{ fontWeight: 600, color: getRiskColor(value) }}>{value}%</span>
    </div>
    <div style={styles.riskMeterBar}>
      <motion.div 
        style={{ height: '100%', borderRadius: '3px', background: getRiskColor(value) }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
      />
    </div>
  </motion.div>
);

const ModuleCard = ({ number, title, subtitle, children, delay = 0 }: {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div 
    style={styles.moduleCard}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div style={styles.moduleHeader}>
      <div style={styles.moduleNumber}>{number}</div>
      <div style={{ flex: 1 }}>
        <h3 style={styles.moduleTitle}>{title}</h3>
        <p style={styles.moduleSubtitle}>{subtitle}</p>
      </div>
    </div>
    <div style={styles.moduleContent}>
      {children}
    </div>
  </motion.div>
);

export function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [showAllModules, setShowAllModules] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('blindspot_result');
    if (stored) {
      setResult(JSON.parse(stored));
      const timer = setInterval(() => {
        setActiveModule(prev => {
          if (prev < 5) return prev + 1;
          clearInterval(timer);
          setShowAllModules(true);
          return prev;
        });
      }, 600);
      return () => clearInterval(timer);
    } else {
      navigate('/analyze');
    }
  }, [navigate]);

  if (!result) {
    return (
      <div style={styles.loadingPage}>
        <motion.div
          style={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p>Loading analysis...</p>
      </div>
    );
  }

  const modules = [
    { id: 'assumptions', label: 'Assumptions', icon: Lightbulb },
    { id: 'risk', label: 'Risk Analysis', icon: Shield },
    { id: 'competitors', label: 'Competition', icon: Target },
    { id: 'autopsy', label: 'Startup Autopsy', icon: Skull },
    { id: 'decision', label: 'Decision', icon: Zap },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
  ];

  return (
    <div style={styles.page}>
      <GlowingOrbs />

      {/* Header */}
      <header style={styles.header}>
        <motion.button 
          style={styles.backBtn}
          onClick={() => navigate('/analyze')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <ArrowLeft size={18} />
          <span>New Analysis</span>
        </motion.button>

        <motion.div 
          style={styles.logo}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/')}
        >
          <Shield size={20} style={{ color: '#8B5CF6' }} />
          <span>Blind<span style={styles.logoHighlight}>Spot</span></span>
        </motion.div>

        <motion.div 
          style={styles.headerActions}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button style={styles.actionBtn}>
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button style={styles.actionBtn}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </motion.div>
      </header>

      <div style={styles.container}>
        {/* Startup Info */}
        <motion.div
          style={styles.startupInfo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 style={styles.startupName}>{result.input.name}</h1>
          <p style={styles.startupIdea}>{result.input.idea}</p>
          <div style={styles.tagsContainer}>
            <span style={styles.tag}>{result.input.industry}</span>
            <span style={styles.tag}>{result.input.platform}</span>
            <span style={styles.tag}>{result.input.stage}</span>
          </div>
        </motion.div>

        {/* Progress Pipeline */}
        {!showAllModules && (
          <motion.div 
            style={styles.pipelineProgress}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {modules.map((mod, index) => {
              const Icon = mod.icon;
              const isActive = index <= activeModule;
              const isCurrent = index === activeModule;
              return (
                <motion.div
                  key={mod.id}
                  style={{
                    ...styles.pipelineStep,
                    ...(isActive ? styles.pipelineStepActive : {}),
                  }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                >
                  <Icon size={16} />
                  <span>{mod.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Main Results Grid */}
        <AnimatePresence>
          {showAllModules && (
            <motion.div 
              style={styles.resultsGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Sidebar */}
              <div style={styles.sidebar}>
                {/* Decision Badge */}
                <motion.div 
                  style={getDecisionStyle(result.decision)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  <div style={styles.decisionHeader}>
                    <Shield size={24} />
                    <span>Verdict</span>
                  </div>
                  <div style={styles.decisionTitle}>{result.decision}</div>
                  <p style={styles.decisionReason}>{result.decisionReason}</p>
                </motion.div>

                {/* Risk Summary */}
                <motion.div 
                  style={styles.riskCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div style={styles.riskCardHeader}>
                    <Shield size={20} style={{ color: '#8B5CF6' }} />
                    <span>Risk Assessment</span>
                  </div>

                  <div style={styles.riskMeters}>
                    <RiskMeter 
                      label="Technical" 
                      value={result.riskScore.technical} 
                      icon={<Cpu size={14} />}
                      delay={0.3}
                    />
                    <RiskMeter 
                      label="Market" 
                      value={result.riskScore.market} 
                      icon={<TrendingUp size={14} />}
                      delay={0.4}
                    />
                    <RiskMeter 
                      label="Execution" 
                      value={result.riskScore.execution} 
                      icon={<Users size={14} />}
                      delay={0.5}
                    />
                  </div>

                  <div style={styles.totalRisk}>
                    <span style={styles.totalLabel}>Overall Risk</span>
                    <motion.div 
                      style={{ ...styles.totalValue, color: getRiskColor(result.riskScore.total) }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                    >
                      {result.riskScore.total}
                      <span style={styles.totalMax}>/100</span>
                    </motion.div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: getRiskColor(result.riskScore.total) }}>
                      {result.riskScore.label} Risk
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  style={styles.rerunBtn}
                  onClick={() => navigate('/analyze')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <RefreshCw size={18} />
                  <span>Run New Analysis</span>
                </motion.button>
              </div>

              {/* Main Content */}
              <div style={styles.mainContent}>
                {/* Module 1: Assumptions */}
                <ModuleCard
                  number="01"
                  title="Assumption Extraction"
                  subtitle="Hidden assumptions derived from your inputs"
                  delay={0.2}
                >
                  {result.assumptions.map((assumption, index) => (
                    <motion.div 
                      key={assumption.id}
                      style={styles.assumptionItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div style={styles.assumptionIcon}>
                        <Lightbulb size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={styles.assumptionText}>{assumption.text}</p>
                        <span style={getRiskBadgeStyle(assumption.riskLevel)}>
                          {assumption.riskLevel} risk
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </ModuleCard>

                {/* Module 2: Competition */}
                <ModuleCard
                  number="02"
                  title="Competition Reality"
                  subtitle="Your real competition — not just other startups"
                  delay={0.3}
                >
                  {result.competitors.map((competitor, index) => (
                    <motion.div 
                      key={competitor.name}
                      style={styles.competitorItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div style={styles.competitorHeader}>
                        <span style={styles.competitorName}>{competitor.name}</span>
                        <span style={getTypeBadgeStyle(competitor.type)}>{competitor.type}</span>
                      </div>
                      <p style={styles.competitorThreat}>{competitor.threat}</p>
                      {competitor.url && (
                        <a href={competitor.url} target="_blank" rel="noopener noreferrer" style={styles.competitorLink}>
                          Visit <ExternalLink size={12} />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </ModuleCard>

                {/* Module 3: Startup Autopsy */}
                <ModuleCard
                  number="03"
                  title="Startup Autopsy"
                  subtitle="Similar startups that failed — learn from their mistakes"
                  delay={0.4}
                >
                  {result.failedStartups.length > 0 ? (
                    result.failedStartups.map((startup, index) => (
                      <motion.div 
                        key={startup.name}
                        style={styles.failedItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div style={styles.failedHeader}>
                          <Skull size={18} style={{ color: '#EF4444' }} />
                          <span style={styles.failedName}>{startup.name}</span>
                          <span style={styles.failedYear}>{startup.year}</span>
                        </div>
                        <p style={styles.failedReason}>{startup.reason}</p>
                        <p style={styles.failedLesson}><strong>Lesson:</strong> {startup.lesson}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div style={styles.emptyState}>
                      <Skull size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontSize: '14px' }}>No matching failure patterns found. That's a good sign!</p>
                    </div>
                  )}
                </ModuleCard>

                {/* Module 4: Action Items */}
                <ModuleCard
                  number="04"
                  title="Reality Checklist"
                  subtitle="Concrete next steps to validate and reduce risk"
                  delay={0.5}
                >
                  {result.actionItems.map((action, index) => (
                    <motion.div 
                      key={action.id}
                      style={styles.actionItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div style={getPriorityBadgeStyle(action.priority)}>
                        {action.priority}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={styles.actionText}>{action.text}</p>
                        <span style={styles.actionCategory}>{action.category}</span>
                      </div>
                      <CheckSquare size={18} style={{ color: '#4B5563', cursor: 'pointer' }} />
                    </motion.div>
                  ))}
                </ModuleCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.div 
          style={styles.disclaimer}
          initial={{ opacity: 0 }}
          animate={{ opacity: showAllModules ? 1 : 0 }}
          transition={{ delay: 1 }}
        >
          <AlertTriangle size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
          <span>This analysis uses rule-based logic — AI improves clarity, not decision-making.</span>
        </motion.div>
      </div>
    </div>
  );
}