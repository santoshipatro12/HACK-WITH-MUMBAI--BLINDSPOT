// pages/Analyze.tsx

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Rocket, Users, Building2, Monitor, CreditCard,
  Layers, Link2, ArrowLeft, Zap, Sparkles, Shield,
  Lightbulb, AlertTriangle, CheckCircle2, Target,
  Globe, TrendingUp, Skull, Database
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import { FormSelect } from '../components/common/FormSelect';
import { StartupInput } from '../types';
import { runFullAnalysis } from '../utils/analysisEngine';
import './Analyze.css';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Dropdown options
const targetUsersOptions = [
  { value: 'consumers', label: 'Consumers (B2C)' },
  { value: 'smb', label: 'Small & Medium Businesses (SMB)' },
  { value: 'enterprise', label: 'Enterprise (B2B)' },
  { value: 'developers', label: 'Developers' },
  { value: 'students', label: 'Students' },
];

const industryOptions = [
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'edtech', label: 'Edtech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'social', label: 'Social' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'ai', label: 'AI / ML' },
  { value: 'saas', label: 'SaaS' },
  { value: 'other', label: 'Other' },
];

const platformOptions = [
  { value: 'web', label: 'Web Application' },
  { value: 'app', label: 'Mobile App' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'api', label: 'API / Developer Tool' },
];

const revenueOptions = [
  { value: 'free', label: 'Free (Monetize Later)' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'commission', label: 'Commission / Transaction Fee' },
  { value: 'one_time', label: 'One-time Purchase' },
  { value: 'freemium', label: 'Freemium' },
];

const stageOptions = [
  { value: 'idea', label: 'Just an Idea' },
  { value: 'mvp', label: 'Building MVP' },
  { value: 'early_users', label: 'Have Early Users' },
];

const dependencyOptions = [
  { value: 'none', label: 'None' },
  { value: 'api', label: 'External API (OpenAI, Stripe, etc.)' },
  { value: 'platform', label: 'Platform (iOS, Android, Shopify)' },
  { value: 'regulation', label: 'Regulatory Approval' },
];

// Pipeline steps data
const pipelineSteps = [
  { name: 'Assumptions', icon: Lightbulb },
  { name: 'Risks', icon: AlertTriangle },
  { name: 'Competition', icon: Target },
  { name: 'Autopsy', icon: Shield },
  { name: 'Decision', icon: CheckCircle2 },
  { name: 'Actions', icon: Zap },
];

// Analysis stages for loading
const analysisStages = [
  { id: 'competitors', text: 'Searching competitors...', icon: Globe },
  { id: 'trends', text: 'Analyzing market trends...', icon: TrendingUp },
  { id: 'failures', text: 'Finding failure patterns...', icon: Skull },
  { id: 'insights', text: 'Generating insights...', icon: Zap },
];

// Section Card Component
interface SectionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sectionNumber: number;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon,
  sectionNumber,
  children,
}) => {
  return (
    <motion.div variants={cardVariants} className="section-card">
      <div className="section-header">
        <div className="section-number">{sectionNumber}</div>
        <div className="section-icon">{icon}</div>
        <div className="section-title-group">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
      </div>
      <motion.div
        className="section-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Progress Indicator Component
interface ProgressIndicatorProps {
  formData: StartupInput;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ formData }) => {
  const fields = Object.values(formData);
  const filledFields = fields.filter(field => field.trim() !== '').length;
  const progress = (filledFields / fields.length) * 100;

  return (
    <motion.div
      className="progress-container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="progress-info">
        <span className="progress-text">
          <CheckCircle2 size={14} />
          Form Progress
        </span>
        <span className="progress-percentage">{filledFields}/{fields.length} fields</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

// Pipeline Preview Component
const PipelinePreview: React.FC = () => {
  return (
    <motion.div
      className="pipeline-preview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <h3 className="pipeline-title">Analysis Pipeline</h3>
      <div className="pipeline-steps">
        {pipelineSteps.map((step, index) => (
          <motion.div
            key={step.name}
            className="pipeline-step-wrapper"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.08 }}
          >
            <div className="pipeline-step">
              <div className="pipeline-step-icon">
                <step.icon size={12} />
              </div>
              {step.name}
            </div>
            {index < pipelineSteps.length - 1 && (
              <span className="pipeline-arrow">→</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Loading Overlay Component
interface LoadingOverlayProps {
  isVisible: boolean;
  stages: { id: string; text: string; icon: React.ComponentType<{ size?: number }> }[];
  completedStages: string[];
  startupName: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  stages,
  completedStages,
  startupName
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-content">
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Analyzing {startupName || 'Your Startup'}
        </motion.h2>

        <motion.p
          className="loading-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Fetching real-time data from multiple sources...
        </motion.p>

        <div className="loading-stages">
          {stages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isCompleted = completedStages.includes(stage.id);

            return (
              <motion.div
                key={stage.id}
                className={`loading-stage ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.15 }}
              >
                <div className="loading-stage-icon">
                  <StageIcon size={16} />
                </div>
                <span className="loading-stage-text">{stage.text}</span>
                {isCompleted && (
                  <motion.div
                    className="loading-stage-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle2 size={16} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
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
            animate={{ width: `${(completedStages.length / stages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.div
          className="loading-sources"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Database size={12} />
          <span>Sources: DuckDuckGo, Hacker News, GitHub</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main Component
export function Analyze() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StartupInput>({
    name: '',
    idea: '',
    targetUsers: '',
    industry: '',
    platform: '',
    revenueModel: '',
    stage: '',
    criticalDependency: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCompletedStages([]);

    try {
      // Simulate stage completion for visual feedback
      const stageDelays = [
        { id: 'competitors', delay: 800 },
        { id: 'trends', delay: 1600 },
        { id: 'failures', delay: 2400 },
        { id: 'insights', delay: 3200 },
      ];

      // Start stage completion timers
      stageDelays.forEach(({ id, delay }) => {
        setTimeout(() => {
          setCompletedStages(prev => [...prev, id]);
        }, delay);
      });

      // Run the REAL analysis with API calls
      console.log('🚀 Starting BlindSpot analysis for:', formData.name);
      const result = await runFullAnalysis(formData);
      console.log('✅ Analysis complete:', result.decision);

      // Ensure minimum loading time for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Store result in sessionStorage
      sessionStorage.setItem('blindspot_result', JSON.stringify(result));

      // Navigate to results
      navigate('/results');
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setIsLoading(false);
      setCompletedStages([]);
    }
  };

  const isFormValid = Object.values(formData).every(v => v.trim() !== '');

  return (
    <div className="analyze-page">
      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isLoading}
        stages={analysisStages}
        completedStages={completedStages}
        startupName={formData.name}
      />

      {/* Header */}
      <motion.div
        className="analyze-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="logo-group" onClick={() => navigate('/')}>
          <div className="logo-icon-box">
            <Shield size={20} />
          </div>
          <span className="logo-text">
            Blind<span>Spot</span>
          </span>
        </div>
      </motion.div>

      <div className="analyze-container">
        {/* Page Introduction */}
        <motion.div
          className="page-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="page-intro-icon"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          >
            <Sparkles size={32} />
          </motion.div>
          <h1>Startup Analysis Intake</h1>
          <p>
            Tell us about your startup idea. Our AI will analyze potential
            blindspots, risks, and competition patterns using real-time data.
          </p>
          <div className="data-sources-badge">
            <Database size={14} />
            <span>Powered by live data from multiple sources</span>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="error-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </motion.div>
        )}

        {/* Progress Indicator */}
        <ProgressIndicator formData={formData} />

        {/* Form with Section Cards */}
        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Section 1: Startup Basics */}
            <SectionCard
              sectionNumber={1}
              title="Startup Basics"
              subtitle="What's your startup called and what does it do?"
              icon={<Rocket size={20} />}
            >
              <motion.div variants={inputVariants}>
                <FormInput
                  label="Startup Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Inc"
                  icon={<Rocket size={16} />}
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <FormInput
                  label="One-line Idea"
                  name="idea"
                  value={formData.idea}
                  onChange={handleChange}
                  placeholder="Describe your startup in one compelling line..."
                  icon={<Lightbulb size={16} />}
                  multiline
                />
              </motion.div>
            </SectionCard>

            {/* Section 2: Business Details */}
            <SectionCard
              sectionNumber={2}
              title="Business Details"
              subtitle="Help us understand your business model and target market"
              icon={<Building2 size={20} />}
            >
              <div className="form-grid">
                <motion.div variants={inputVariants}>
                  <FormSelect
                    label="Target Users"
                    name="targetUsers"
                    value={formData.targetUsers}
                    onChange={handleChange}
                    options={targetUsersOptions}
                    icon={<Users size={16} />}
                  />
                </motion.div>
                <motion.div variants={inputVariants}>
                  <FormSelect
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    options={industryOptions}
                    icon={<Building2 size={16} />}
                  />
                </motion.div>
              </div>
              <div className="form-grid">
                <motion.div variants={inputVariants}>
                  <FormSelect
                    label="Platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    options={platformOptions}
                    icon={<Monitor size={16} />}
                  />
                </motion.div>
                <motion.div variants={inputVariants}>
                  <FormSelect
                    label="Revenue Model"
                    name="revenueModel"
                    value={formData.revenueModel}
                    onChange={handleChange}
                    options={revenueOptions}
                    icon={<CreditCard size={16} />}
                  />
                </motion.div>
              </div>
              <motion.div variants={inputVariants}>
                <FormSelect
                  label="Stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  options={stageOptions}
                  icon={<Layers size={16} />}
                />
              </motion.div>
            </SectionCard>

            {/* Section 3: Dependencies */}
            <SectionCard
              sectionNumber={3}
              title="Dependencies & Risks"
              subtitle="Identify critical dependencies that could impact your startup"
              icon={<Link2 size={20} />}
            >
              <motion.div variants={inputVariants}>
                <FormSelect
                  label="Critical Dependency"
                  name="criticalDependency"
                  value={formData.criticalDependency}
                  onChange={handleChange}
                  options={dependencyOptions}
                  icon={<Link2 size={16} />}
                />
              </motion.div>
            </SectionCard>
          </motion.div>

          {/* Submit Section */}
          <motion.div
            className="submit-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="submit-button-wrapper">
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid || isLoading}
                isLoading={isLoading}
                style={{ width: '100%' }}
              >
                <Zap size={20} />
                {isLoading ? 'Analyzing...' : 'Run BlindSpot Analysis'}
              </Button>
            </div>
            {!isFormValid && (
              <motion.p
                className="submit-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <AlertTriangle size={14} />
                Please fill in all fields to continue
              </motion.p>
            )}
            {isFormValid && !isLoading && (
              <motion.p
                className="submit-ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CheckCircle2 size={14} />
                Ready to analyze with live data
              </motion.p>
            )}
          </motion.div>
        </form>

        {/* Pipeline Preview */}
        <PipelinePreview />
      </div>
    </div>
  );
}