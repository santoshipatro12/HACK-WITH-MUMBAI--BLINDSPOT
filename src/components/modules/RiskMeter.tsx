import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RiskMeterProps {
  label: string;
  value: number;
  icon: ReactNode;
  delay?: number;
}

export function RiskMeter({ label, value, icon, delay = 0 }: RiskMeterProps) {
  const getLevel = (val: number) => {
    if (val < 30) return 'low';
    if (val < 60) return 'medium';
    return 'high';
  };

  const level = getLevel(value);

  return (
    <motion.div
      className="risk-meter"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="risk-meter-header">
        <div className="risk-meter-label">
          <span style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px',
            background: 'var(--color-surface-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-steel-blue)'
          }}>
            {icon}
          </span>
          {label}
        </div>
        <motion.span 
          className={`risk-meter-value risk-value-${level}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, type: 'spring' }}
        >
          {value}%
        </motion.span>
      </div>
      
      <div className="risk-meter-bar">
        <motion.div
          className={`risk-meter-fill risk-${level}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
