import { motion } from 'framer-motion';
import { Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onLogin?: () => void;
  onSignup?: () => void;
  showAuthButtons?: boolean;
}

export function Navbar({ showAuthButtons = true }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const styles = {
    navbar: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '16px 40px',
      background: 'rgba(11, 11, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
    },
    logoIcon: {
      width: '42px',
      height: '42px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
    },
    logoText: {
      fontSize: '22px',
      fontWeight: 700,
      color: '#F8FAFC',
      letterSpacing: '-0.5px',
    },
    logoHighlight: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      background: 'rgba(139, 92, 246, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(139, 92, 246, 0.2)',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 600,
    },
    userName: {
      fontSize: '14px',
      color: '#F8FAFC',
      fontWeight: 500,
    },
    btnGhost: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#94A3B8',
      background: 'transparent',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    btnPrimary: {
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#FFFFFF',
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#94A3B8',
      background: 'rgba(30, 30, 46, 0.6)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <motion.nav 
      style={styles.navbar}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.container}>
        <motion.div 
          style={styles.logo}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div style={styles.logoIcon}>
            <Shield size={20} />
          </div>
          <span style={styles.logoText}>
            Blind<span style={styles.logoHighlight}>Spot</span>
          </span>
        </motion.div>

        {showAuthButtons && (
          <div style={styles.actions}>
            {user ? (
              <>
                <div style={styles.userInfo}>
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="avatar" 
                      style={{ ...styles.avatar, background: 'none' }}
                    />
                  ) : (
                    <div style={styles.avatar}>
                      {getInitials(user.email || 'U')}
                    </div>
                  )}
                  <span style={styles.userName}>
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <motion.button 
                  style={styles.logoutBtn}
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button 
                  style={styles.btnGhost}
                  onClick={() => navigate('/auth')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Log in
                </motion.button>
                <motion.button 
                  style={styles.btnPrimary}
                  onClick={() => navigate('/auth')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign up
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}