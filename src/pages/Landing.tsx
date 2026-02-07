import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Target, Skull, Zap, ArrowRight, Eye, 
  Radar, AlertTriangle, ChevronRight, Sparkles
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

// Fixed Animated Rocket Component
const AnimatedRocket = () => {
  return (
    <motion.div 
      className="rocket-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Orbital Rings - Behind Rocket */}
      <motion.div 
        className="orbital-ring ring-1"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="orbital-ring ring-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="orbital-ring ring-3"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="floating-star"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Rocket Wrapper with Float Animation */}
      <motion.div
        className="rocket-wrapper"
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {/* Complete Rocket SVG with Integrated Flame */}
        <svg 
          viewBox="0 0 200 420" 
          className="rocket-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rocket Body Gradient */}
            <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            
            {/* Rocket Tip Gradient */}
            <linearGradient id="rocketTipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            
            {/* Fin Gradient */}
            <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            
            {/* Window Gradient */}
            <linearGradient id="windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            
            {/* Flame Gradient */}
            <linearGradient id="flameGradMain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="30%" stopColor="#F97316" />
              <stop offset="60%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
            
            {/* Inner Flame Gradient */}
            <linearGradient id="flameGradInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FCD34D" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </linearGradient>
            
            {/* Glow Filter */}
            <filter id="rocketGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Strong Glow for Flame */}
            <filter id="flameGlow" x="-100%" y="-50%" width="300%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Window Shine */}
            <radialGradient id="windowShine" cx="30%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* === FLAME SECTION (Behind Rocket) === */}
          <g className="flame-group">
            {/* Outer Flame */}
            <motion.path
              d="M100 280 
                 C70 310, 55 360, 75 420 
                 C85 390, 95 370, 100 340
                 C105 370, 115 390, 125 420
                 C145 360, 130 310, 100 280Z"
              fill="url(#flameGradMain)"
              filter="url(#flameGlow)"
              animate={{
                d: [
                  "M100 280 C70 310, 55 360, 75 420 C85 390, 95 370, 100 340 C105 370, 115 390, 125 420 C145 360, 130 310, 100 280Z",
                  "M100 280 C65 315, 50 365, 70 430 C82 395, 93 375, 100 345 C107 375, 118 395, 130 430 C150 365, 135 315, 100 280Z",
                  "M100 280 C70 310, 55 360, 75 420 C85 390, 95 370, 100 340 C105 370, 115 390, 125 420 C145 360, 130 310, 100 280Z"
                ]
              }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Inner Flame */}
            <motion.path
              d="M100 285 
                 C80 305, 70 340, 85 390 
                 C92 365, 97 350, 100 330
                 C103 350, 108 365, 115 390
                 C130 340, 120 305, 100 285Z"
              fill="url(#flameGradInner)"
              filter="url(#flameGlow)"
              animate={{
                d: [
                  "M100 285 C80 305, 70 340, 85 390 C92 365, 97 350, 100 330 C103 350, 108 365, 115 390 C130 340, 120 305, 100 285Z",
                  "M100 285 C78 308, 68 345, 82 400 C90 370, 96 352, 100 335 C104 352, 110 370, 118 400 C132 345, 122 308, 100 285Z",
                  "M100 285 C80 305, 70 340, 85 390 C92 365, 97 350, 100 330 C103 350, 108 365, 115 390 C130 340, 120 305, 100 285Z"
                ]
              }}
              transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>

          {/* === ROCKET BODY === */}
          {/* Left Fin */}
          <path 
            d="M55 200 L20 270 L55 255 L60 200 Z" 
            fill="url(#finGrad)"
            filter="url(#rocketGlow)"
          />
          
          {/* Right Fin */}
          <path 
            d="M145 200 L180 270 L145 255 L140 200 Z" 
            fill="url(#finGrad)"
            filter="url(#rocketGlow)"
          />
          
          {/* Rocket Base */}
          <path
            d="M70 260 L70 280 L100 285 L130 280 L130 260 Z"
            fill="#4F46E5"
            filter="url(#rocketGlow)"
          />
          
          {/* Main Body */}
          <ellipse 
            cx="100" cy="160" rx="45" ry="110" 
            fill="url(#rocketBodyGrad)"
            filter="url(#rocketGlow)"
          />
          
          {/* Body Stripe 1 */}
          <ellipse 
            cx="100" cy="220" rx="42" ry="15" 
            fill="#4F46E5"
            opacity="0.6"
          />
          
          {/* Body Stripe 2 */}
          <ellipse 
            cx="100" cy="190" rx="40" ry="8" 
            fill="#818CF8"
            opacity="0.4"
          />
          
          {/* Rocket Tip */}
          <path 
            d="M100 50 L140 120 L60 120 Z" 
            fill="url(#rocketTipGrad)"
            filter="url(#rocketGlow)"
          />
          
          {/* Tip Highlight */}
          <path 
            d="M100 55 L90 100 L100 95 L110 100 Z" 
            fill="#F9A8D4"
            opacity="0.5"
          />
          
          {/* Window Outer Ring */}
          <circle 
            cx="100" cy="145" r="28" 
            fill="none"
            stroke="#A5B4FC"
            strokeWidth="4"
            filter="url(#rocketGlow)"
          />
          
          {/* Window */}
          <circle 
            cx="100" cy="145" r="22" 
            fill="url(#windowGrad)"
          />
          
          {/* Window Inner */}
          <circle 
            cx="100" cy="145" r="16" 
            fill="#0F172A"
          />
          
          {/* Window Shine */}
          <ellipse 
            cx="92" cy="138" rx="6" ry="8" 
            fill="url(#windowShine)"
          />
          
          {/* Small Window Reflection */}
          <circle 
            cx="108" cy="152" r="3" 
            fill="#FFFFFF"
            opacity="0.3"
          />
          
          {/* Rivets/Details */}
          <circle cx="70" cy="180" r="3" fill="#A5B4FC" opacity="0.6" />
          <circle cx="130" cy="180" r="3" fill="#A5B4FC" opacity="0.6" />
          <circle cx="75" cy="210" r="2" fill="#A5B4FC" opacity="0.4" />
          <circle cx="125" cy="210" r="2" fill="#A5B4FC" opacity="0.4" />
        </svg>

        {/* Smoke/Particle Effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="rocket-particle"
            style={{
              left: `${42 + i * 3}%`,
            }}
            animate={{
              y: [0, 100, 200],
              x: [0, (i % 2 === 0 ? 1 : -1) * 20, (i % 2 === 0 ? 1 : -1) * 40],
              opacity: [0.8, 0.4, 0],
              scale: [0.5, 1, 1.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Glow Effect Behind Rocket */}
      <div className="rocket-glow"></div>
    </motion.div>
  );
};

// Floating Particles Background
const FloatingParticles = () => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 3,
  }));

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

// Glowing Orbs Background
const GlowingOrbs = () => {
  return (
    <div className="orbs-container">
      <motion.div 
        className="orb orb-1"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="orb orb-2"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="orb orb-3"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
    </div>
  );
};

// Page Transition Overlay
const PageTransition = ({ isActive }: { isActive: boolean }) => (
  <motion.div
    className="page-transition-overlay"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: isActive ? 1 : 0 }}
    transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
  />
);

export function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrollY / 400);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle CTA button click - redirect to auth if not logged in
  const handleStartAnalysis = () => {
    setIsNavigating(true);
    setTimeout(() => {
      if (user) {
        // User is logged in, go to analyze page
        navigate('/analyze');
      } else {
        // User is not logged in, go to auth page
        navigate('/auth');
      }
    }, 800);
  };

  // Handle Create Account button click
  const handleCreateAccount = () => {
    navigate('/auth');
  };

  const features = [
    {
      icon: Eye,
      title: 'Assumption Extraction',
      description: 'Uncover hidden assumptions that could derail your startup',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    },
    {
      icon: Radar,
      title: 'Risk Detection',
      description: 'Identify technical, market, and execution risks before they hurt',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    },
    {
      icon: Target,
      title: 'Real Competition',
      description: 'See who you really compete with — not just other startups',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    },
    {
      icon: Skull,
      title: 'Startup Autopsy',
      description: 'Learn from similar failed startups and avoid their mistakes',
      gradient: 'linear-gradient(135deg, #F43F5E 0%, #F97316 100%)',
    },
  ];

  const steps = [
    { num: '01', title: 'Input Your Idea', desc: 'Structured intake form captures key decisions', icon: '📝' },
    { num: '02', title: 'Run Analysis', desc: 'Rule-based engine identifies risks & patterns', icon: '⚡' },
    { num: '03', title: 'Get Decision', desc: 'Clear verdict with actionable next steps', icon: '🎯' },
  ];

  return (
    <div className="landing-page-premium">
      <PageTransition isActive={isNavigating} />
      <FloatingParticles />
      <GlowingOrbs />
      
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        className="hero-section-premium"
        style={{ opacity: scrollOpacity }}
      >
        <div className="hero-content-wrapper">
          {/* Left Content */}
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>AI-Powered Decision Intelligence</span>
            </motion.div>

            <motion.h1
              className="hero-title-premium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="title-gradient">Blind</span>
              <span className="title-highlight">Spot</span>
            </motion.h1>

            <motion.p
              className="hero-tagline-premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              The AI Review Board for
              <span className="tagline-accent"> Startup Decisions</span>
            </motion.p>

            <motion.p
              className="hero-description-premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              We block risky startup decisions before they destroy companies.
              Identify risks, competition, and failure patterns before building.
            </motion.p>

            <motion.div
              className="hero-cta-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button 
                className="cta-button-premium"
                onClick={handleStartAnalysis}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="cta-glow"></span>
                <Zap size={20} className="cta-icon" />
                <span>Run Reality Check</span>
                <motion.span
                  className="cta-arrow"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </motion.button>

              {!user && (
                <motion.button 
                  className="cta-secondary"
                  onClick={handleCreateAccount}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Account
                </motion.button>
              )}
            </motion.div>

            <motion.div
              className="hero-trust-badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="trust-item">
                <Shield size={16} />
                <span>Rule-based analysis</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <AlertTriangle size={16} />
                <span>No AI hallucinations</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <Eye size={16} />
                <span>Explainable decisions</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Rocket */}
          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatedRocket />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll to explore</span>
          <ChevronRight size={20} className="scroll-arrow" />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section-premium">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="section-label">Features</span>
            <h2 className="section-title-premium">What BlindSpot Reveals</h2>
            <p className="section-subtitle">
              Comprehensive analysis to protect your startup from common pitfalls
            </p>
          </motion.div>

          <div className="features-grid-premium">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="feature-card-premium"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="feature-card-glow" style={{ background: feature.gradient }}></div>
                  <div className="feature-card-content">
                    <motion.div 
                      className="feature-icon-premium"
                      style={{ background: feature.gradient }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconComponent size={28} color="#FFFFFF" />
                    </motion.div>
                    <h3 className="feature-title-premium">{feature.title}</h3>
                    <p className="feature-desc-premium">{feature.description}</p>
                    <motion.div 
                      className="feature-link"
                      whileHover={{ x: 5 }}
                    >
                      <span>Learn more</span>
                      <ArrowRight size={14} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="pipeline-section-premium">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="section-label">Process</span>
            <h2 className="section-title-premium">How BlindSpot Works</h2>
            <p className="section-subtitle">
              Three simple steps to validate your startup idea
            </p>
          </motion.div>

          <div className="pipeline-container">
            <div className="pipeline-line"></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                className="pipeline-step-premium"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className="step-icon-wrapper"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="step-number-premium">{step.num}</div>
                  <span className="step-emoji">{step.icon}</span>
                </motion.div>
                <div className="step-content">
                  <h3 className="step-title-premium">{step.title}</h3>
                  <p className="step-desc-premium">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="cta-section-premium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="cta-container">
          <div className="cta-glow-bg"></div>
          <motion.div
            className="cta-content"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="cta-icon-wrapper"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Shield size={48} color="#8B5CF6" />
            </motion.div>
            <h2 className="cta-title">Ready to find your blind spots?</h2>
            <p className="cta-description">
              Get instant, rule-based analysis of your startup idea.
              No credit card required.
            </p>
            <motion.button
              className="cta-button-premium cta-button-large"
              onClick={handleStartAnalysis}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="cta-glow"></span>
              <Zap size={24} />
              <span>Start Analysis</span>
              <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="footer-premium">
        <div className="footer-content">
          <div className="footer-brand">
            <Shield size={24} />
            <span className="footer-logo">BlindSpot</span>
          </div>
          <p className="footer-tagline">Built for Hackathon 2024</p>
          <div className="footer-divider"></div>
          <p className="footer-note">
            💡 AI improves clarity, not decision-making.
          </p>
        </div>
      </footer>
    </div>
  );
}