import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

interface NavbarProps {
  onLogin?: () => void;
  onSignup?: () => void;
  showAuthButtons?: boolean;
}

export function Navbar({ onLogin, onSignup, showAuthButtons = true }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <motion.nav 
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="nav-logo" onClick={() => navigate('/')}>
        <div className="nav-logo-icon">
          <Shield size={20} />
        </div>
        Blind<span>Spot</span>
      </div>

      {showAuthButtons && (
        <div className="nav-actions">
          <Button variant="ghost" onClick={onLogin}>
            Log in
          </Button>
          <Button variant="secondary" onClick={onSignup}>
            Sign up
          </Button>
        </div>
      )}
    </motion.nav>
  );
}
