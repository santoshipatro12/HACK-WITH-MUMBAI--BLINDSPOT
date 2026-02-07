import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface DecisionBadgeProps {
  decision: 'BLOCK' | 'PROCEED_WITH_CONDITIONS' | 'SAFE_TO_BUILD';
  reason: string;
}

export function DecisionBadge({ decision, reason }: DecisionBadgeProps) {
  const config = {
    BLOCK: {
      icon: Shield,
      label: 'BLOCKED',
      className: 'decision-block',
    },
    PROCEED_WITH_CONDITIONS: {
      icon: AlertTriangle,
      label: 'PROCEED WITH CONDITIONS',
      className: 'decision-proceed',
    },
    SAFE_TO_BUILD: {
      icon: CheckCircle,
      label: 'SAFE TO BUILD',
      className: 'decision-safe',
    },
  };

  const { icon: Icon, label, className } = config[decision];

  return (
    <motion.div
      className={`decision-badge ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="decision-header">
        <motion.div
          className="decision-icon"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Icon size={24} />
        </motion.div>
        
        <div>
          <motion.h3
            className="decision-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {label}
          </motion.h3>
          <motion.p
            className="decision-reason"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {reason}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
