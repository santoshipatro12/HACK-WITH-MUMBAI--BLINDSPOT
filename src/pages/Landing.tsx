import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Target, Skull, Zap, ArrowRight, Eye, 
  Radar, AlertTriangle, ChevronRight 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import { AuthModal } from '../components/auth/AuthModal';

export function Landing() {
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login'
  });

  const features = [
    {
      icon: Eye,
      title: 'Assumption Extraction',
      description: 'Uncover hidden assumptions that could derail your startup',
      color: '#3B82F6',
    },
    {
      icon: Radar,
      title: 'Risk Detection',
      description: 'Identify technical, market, and execution risks before they hurt',
      color: '#F59E0B',
    },
    {
      icon: Target,
      title: 'Real Competition',
      description: 'See who you really compete with — not just other startups',
      color: '#8B5CF6',
    },
    {
      icon: Skull,
      title: 'Startup Autopsy',
      description: 'Learn from similar failed startups and avoid their mistakes',
      color: '#EF4444',
    },
  ];

  const steps = [
    { num: '01', title: 'Input Your Idea', desc: 'Structured intake form captures key decisions' },
    { num: '02', title: 'Run Analysis', desc: 'Rule-based engine identifies risks & patterns' },
    { num: '03', title: 'Get Decision', desc: 'Clear verdict with actionable next steps' },
  ];

  return (
    <div className="landing-page">
      <Navbar 
        onLogin={() => setAuthModal({ open: true, mode: 'login' })}
        onSignup={() => setAuthModal({ open: true, mode: 'signup' })}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="hero-logo"
        >
          <Shield size={40} />
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Blind<span>Spot</span>
        </motion.h1>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          AI Review Board for Startup Decisions
        </motion.p>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          We block risky startup decisions before they destroy companies.
          <br />
          <span style={{ opacity: 0.7 }}>Identify risks, competition, and failure patterns before building.</span>
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <Button size="lg" onClick={() => navigate('/analyze')}>
            <Zap size={20} />
            Run Reality Check
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight size={20} />
            </motion.span>
          </Button>
        </motion.div>

        <motion.div
          className="hero-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <AlertTriangle size={16} />
          <span>Rule-based analysis • No AI hallucinations • Explainable decisions</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What BlindSpot Reveals
        </motion.h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div 
                className="feature-icon"
                style={{ background: `${feature.color}15`, color: feature.color }}
              >
                <feature.icon size={28} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="pipeline-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How BlindSpot Works
        </motion.h2>

        <div className="pipeline-steps">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              className="pipeline-step"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="step-number"
                whileHover={{ scale: 1.1 }}
              >
                {step.num}
              </motion.div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              {index < steps.length - 1 && (
                <ChevronRight 
                  className="step-arrow" 
                  size={24} 
                  style={{ 
                    position: 'absolute', 
                    right: '-36px', 
                    top: '16px',
                    display: 'none'
                  }} 
                />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        style={{ 
          textAlign: 'center', 
          padding: 'var(--space-3xl) var(--space-lg)',
          background: 'var(--color-surface)'
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          marginBottom: 'var(--space-md)',
          color: 'var(--color-text-primary)'
        }}>
          Ready to find your blind spots?
        </h2>
        <p style={{ 
          color: 'var(--color-text-muted)', 
          marginBottom: 'var(--space-xl)' 
        }}>
          Get instant, rule-based analysis of your startup idea
        </p>
        <Button size="lg" onClick={() => navigate('/analyze')}>
          Start Analysis
          <ArrowRight size={20} />
        </Button>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>BlindSpot — Built for Hackathon 2024</p>
        <p style={{ marginTop: '4px', opacity: 0.7 }}>
          💡 AI improves clarity, not decision-making.
        </p>
      </footer>

      <AuthModal 
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialMode={authModal.mode}
      />
    </div>
  );
}
