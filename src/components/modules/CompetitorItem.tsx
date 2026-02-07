import { motion } from 'framer-motion';
import { Competitor } from '../../types';

interface CompetitorItemProps {
  competitor: Competitor;
  index: number;
}

export function CompetitorItem({ competitor, index }: CompetitorItemProps) {
  return (
    <motion.div
      className="competitor-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="competitor-info">
        <h4 className="competitor-name">{competitor.name}</h4>
        <p className="competitor-desc">{competitor.description}</p>
      </div>
      <span className={`threat-badge threat-${competitor.threat}`}>
        {competitor.threat} threat
      </span>
    </motion.div>
  );
}
