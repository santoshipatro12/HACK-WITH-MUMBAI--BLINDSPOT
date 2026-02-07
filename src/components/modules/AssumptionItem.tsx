import { motion } from 'framer-motion';
import { Lightbulb, Zap, AlertCircle } from 'lucide-react';
import { Assumption } from '../../types';

interface AssumptionItemProps {
  assumption: Assumption;
  index: number;
}

export function AssumptionItem({ assumption, index }: AssumptionItemProps) {
  const categoryIcons = {
    market: Lightbulb,
    technical: Zap,
    execution: AlertCircle,
  };

  const Icon = categoryIcons[assumption.category];

  return (
    <motion.div
      className={`assumption-item severity-${assumption.severity}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 4 }}
    >
      <div style={{ 
        padding: '8px', 
        borderRadius: '8px', 
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={16} style={{ color: 'var(--color-steel-blue)' }} />
      </div>
      <div style={{ flex: 1 }}>
        <p className="assumption-text">{assumption.text}</p>
        <div className="assumption-tags">
          <span className="badge" style={{ 
            background: 'rgba(120, 161, 187, 0.1)', 
            color: 'var(--color-steel-blue)' 
          }}>
            {assumption.category}
          </span>
          <span className={`badge badge-${assumption.severity === 'high' ? 'danger' : assumption.severity === 'medium' ? 'warning' : 'success'}`}>
            {assumption.severity} risk
          </span>
        </div>
      </div>
    </motion.div>
  );
}
