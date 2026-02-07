import { motion } from 'framer-motion';
import { CheckCircle, XCircle, FlaskConical, BarChart3 } from 'lucide-react';
import { ActionItem as ActionItemType } from '../../types';

interface ActionItemProps {
  action: ActionItemType;
  index: number;
}

export function ActionItem({ action, index }: ActionItemProps) {
  const categoryConfig = {
    validate: { icon: CheckCircle, className: 'action-validate', label: 'Validate' },
    avoid: { icon: XCircle, className: 'action-avoid', label: 'Avoid' },
    test: { icon: FlaskConical, className: 'action-test', label: 'Test' },
    measure: { icon: BarChart3, className: 'action-measure', label: 'Measure' },
  };

  const { icon: Icon, className, label } = categoryConfig[action.category];

  return (
    <motion.div
      className="action-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <motion.div
        className={`action-icon ${className}`}
        whileHover={{ rotate: 10 }}
      >
        <Icon size={18} />
      </motion.div>
      
      <div className="action-content">
        <p className="action-text">{action.text}</p>
        <div className="action-meta">
          <span className="badge" style={{ 
            background: 'var(--color-surface-secondary)',
            color: 'var(--color-steel-blue)'
          }}>
            {label}
          </span>
          <span className={`badge badge-${action.priority === 'high' ? 'danger' : action.priority === 'medium' ? 'warning' : 'success'}`}>
            {action.priority} priority
          </span>
        </div>
      </div>
    </motion.div>
  );
}
