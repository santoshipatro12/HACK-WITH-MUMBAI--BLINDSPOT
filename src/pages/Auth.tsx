import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Mail, Lock, User, Eye, EyeOff, 
  ArrowRight, Zap, AlertCircle, CheckCircle,
  
} from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../config/firebase';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Styles
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0B0B0F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  orbsContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
  orb: {
    position: 'absolute' as const,
    borderRadius: '50%',
    filter: 'blur(100px)',
  },
  orb1: {
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
    top: '-200px',
    right: '-150px',
  },
  orb2: {
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-150px',
  },
  container: {
    width: '100%',
    maxWidth: '440px',
    position: 'relative' as const,
    zIndex: 1,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#94A3B8',
    background: 'rgba(30, 30, 46, 0.6)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: 'fit-content',
  },
  card: {
    background: 'rgba(30, 30, 46, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '28px',
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  logoIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#F8FAFC',
    margin: '0 0 8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#94A3B8',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    background: 'rgba(15, 15, 20, 0.6)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '28px',
  },
  tab: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748B',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#F8FAFC',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#94A3B8',
  },
  inputWrapper: {
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    paddingLeft: '44px',
    fontSize: '15px',
    color: '#F8FAFC',
    background: 'rgba(15, 15, 20, 0.6)',
    border: '2px solid rgba(99, 102, 241, 0.15)',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748B',
  },
  passwordToggle: {
    position: 'absolute' as const,
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748B',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
    marginTop: '8px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(139, 92, 246, 0.2)',
  },
  dividerText: {
    fontSize: '13px',
    color: '#64748B',
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#F8FAFC',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#FCA5A5',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
  },
  success: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#86EFAC',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '10px',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '24px',
    fontSize: '13px',
    color: '#64748B',
  },
  footerLink: {
    color: '#8B5CF6',
    cursor: 'pointer',
    fontWeight: 500,
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
  },
};

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { user, error } = await signUpWithEmail(formData.email, formData.password);
        if (error) {
          setError(error);
        } else if (user) {
          setSuccess('Account created successfully!');
          setTimeout(() => navigate('/analyze'), 1500);
        }
      } else {
        const { user, error } = await signInWithEmail(formData.email, formData.password);
        if (error) {
          setError(error);
        } else if (user) {
          navigate('/analyze');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        setError(error);
      } else if (user) {
        navigate('/analyze');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccess('');
  };

  return (
    <div style={styles.page}>
      {/* Background Orbs */}
      <div style={styles.orbsContainer}>
        <div style={{ ...styles.orb, ...styles.orb1 }}></div>
        <div style={{ ...styles.orb, ...styles.orb2 }}></div>
      </div>

      <motion.div 
        style={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <motion.button
          style={styles.backButton}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02, x: -3 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Back to Home
        </motion.button>

        {/* Auth Card */}
        <motion.div 
          style={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Header */}
          <div style={styles.header}>
            <motion.div 
              style={styles.logoIcon}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Shield size={28} />
            </motion.div>
            <motion.h1 
              style={styles.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </motion.h1>
            <motion.p 
              style={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {mode === 'login' 
                ? 'Sign in to continue your analysis' 
                : 'Start finding your blind spots today'}
            </motion.p>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            <button 
              style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button 
              style={{ ...styles.tab, ...(mode === 'signup' ? styles.tabActive : {}) }}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                style={styles.error}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                style={styles.success}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CheckCircle size={16} />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form style={styles.form} onSubmit={handleSubmit}>
            {/* Name Field (Signup only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  style={styles.inputGroup}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label style={styles.label}>
                    <User size={14} style={{ color: '#8B5CF6' }} />
                    Full Name
                  </label>
                  <div style={styles.inputWrapper}>
                    <User size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      style={styles.input}
                      required={mode === 'signup'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Mail size={14} style={{ color: '#8B5CF6' }} />
                Email Address
              </label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Lock size={14} style={{ color: '#8B5CF6' }} />
                Password
              </label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ ...styles.input, paddingRight: '44px' }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 35px rgba(99, 102, 241, 0.5)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <motion.span
                    style={styles.spinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <Zap size={20} />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine}></div>
          </div>

          {/* Google Sign In */}
          <motion.button
            style={{
              ...styles.googleButton,
              opacity: googleLoading ? 0.7 : 1,
              cursor: googleLoading ? 'not-allowed' : 'pointer',
            }}
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            whileHover={!googleLoading ? { scale: 1.02, background: 'rgba(255, 255, 255, 0.1)' } : {}}
            whileTap={!googleLoading ? { scale: 0.98 } : {}}
          >
            {googleLoading ? (
              <>
                <motion.span
                  style={{ ...styles.spinner, borderTopColor: '#8B5CF6', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Connecting...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </motion.button>

          {/* Footer */}
          <p style={styles.footer}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span style={styles.footerLink} onClick={switchMode}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}