import { motion } from 'framer-motion';
import { Skull, DollarSign, Tag } from 'lucide-react';
import { FailedStartup } from '../../types';

interface FailedStartupItemProps {
  startup: FailedStartup;
  index: number;
}

export function FailedStartupItem({ startup, index }: FailedStartupItemProps) {
  return (
    <motion.div
      className="failed-startup"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -2 }}
    >
      <div className="failed-header">
        <div>
          <h4 className="failed-name">
            <Skull size={18} />
            {startup.name}
          </h4>
          <span className="failed-meta">Shut down {startup.year}</span>
        </div>
        {startup.raised && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            background: 'var(--color-surface-secondary)',
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            <DollarSign size={14} />
            Raised {startup.raised}
          </div>
        )}
      </div>

      <ul className="failed-reasons">
        {startup.failureReasons.map((reason, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 + i * 0.1 }}
          >
            {reason}
          </motion.li>
        ))}
      </ul>

      <div className="pattern-tags">
        {startup.patternTags.slice(0, 3).map((tag, i) => (
          <span key={i} className="pattern-tag">
            <Tag size={10} />
            {tag.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
