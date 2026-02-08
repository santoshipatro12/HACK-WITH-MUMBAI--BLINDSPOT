import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, Users, Building2, Monitor, CreditCard, 
  Layers, Link2, ArrowLeft, Zap, Sparkles, Shield
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import { FormSelect } from '../components/common/FormSelect';
import { StartupInput } from '../types';
import { runBlindSpotAnalysis } from '../logic';

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

export function Analyze() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate processing time for effect
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Run analysis
    const result = runBlindSpotAnalysis(formData);
    
    // Store result and navigate
    sessionStorage.setItem('blindspot_result', JSON.stringify(result));
    navigate('/results');
  };

  const isFormValid = Object.values(formData).every(v => v.trim() !== '');

  return (
    <div className="analyze-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '700px',
          margin: '0 auto var(--space-xl)'
        }}
      >
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-sm)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-steel-blue), var(--color-blue-slate))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Shield size={18} />
          </div>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 700,
            fontSize: '20px'
          }}>
            Blind<span style={{ color: 'var(--color-steel-blue)' }}>Spot</span>
          </span>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        className="analyze-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="form-card">
          <div className="form-header">
            <motion.div
              className="form-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Sparkles size={32} />
            </motion.div>
            <h1 className="form-title">Startup Intake Form</h1>
            <p className="form-subtitle">
              Tell us about your startup idea. We'll identify the blind spots.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormInput
                label="Startup Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Acme Inc"
                icon={<Rocket size={16} />}
              />
              <FormSelect
                label="Target Users"
                name="targetUsers"
                value={formData.targetUsers}
                onChange={handleChange}
                options={targetUsersOptions}
                icon={<Users size={16} />}
              />
            </div>

            <div style={{ marginTop: 'var(--space-lg)' }} className="form-full">
              <FormInput
                label="One-line Idea"
                name="idea"
                value={formData.idea}
                onChange={handleChange}
                placeholder="Describe your startup in one line..."
                icon={<Sparkles size={16} />}
                multiline
              />
            </div>

            <div className="form-grid" style={{ marginTop: 'var(--space-lg)' }}>
              <FormSelect
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                options={industryOptions}
                icon={<Building2 size={16} />}
              />
              <FormSelect
                label="Platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                options={platformOptions}
                icon={<Monitor size={16} />}
              />
            </div>

            <div className="form-grid" style={{ marginTop: 'var(--space-lg)' }}>
              <FormSelect
                label="Revenue Model"
                name="revenueModel"
                value={formData.revenueModel}
                onChange={handleChange}
                options={revenueOptions}
                icon={<CreditCard size={16} />}
              />
              <FormSelect
                label="Stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                options={stageOptions}
                icon={<Layers size={16} />}
              />
            </div>

            <div style={{ marginTop: 'var(--space-lg)' }}>
              <FormSelect
                label="Critical Dependency"
                name="criticalDependency"
                value={formData.criticalDependency}
                onChange={handleChange}
                options={dependencyOptions}
                icon={<Link2 size={16} />}
              />
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid}
                isLoading={isLoading}
                style={{ width: '100%' }}
              >
                <Zap size={20} />
                Run BlindSpot Analysis
              </Button>
              {!isFormValid && (
                <p className="form-hint">
                  Please fill in all fields to continue
                </p>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
