import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { Button } from '../common/Button';
import { FormInput } from '../common/FormInput';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - just close the modal
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative' }}
          >
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>

            <div className="auth-modal">
              <div className="auth-header">
                <h2 className="auth-title">
                  {mode === 'login' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="auth-subtitle">
                  {mode === 'login' 
                    ? 'Sign in to access your saved analyses' 
                    : 'Start making better startup decisions'}
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    icon={<User size={16} />}
                  />
                )}

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                />

                <Button type="submit" size="lg" style={{ width: '100%', marginTop: '8px' }}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="auth-divider">or</div>

              <div className="auth-switch">
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => setMode('signup')}>Sign up</button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => setMode('login')}>Sign in</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
