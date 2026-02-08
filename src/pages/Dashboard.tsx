import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, RefreshCw, Shield, Cpu, TrendingUp,
    Users, Target, Skull, CheckSquare, Lightbulb,
    AlertTriangle, ExternalLink, Download, Share2,
    CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { AnalysisResult } from '../types';
import './Dashboard.css';

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

// Helper functions
const getRiskColor = (value: number) => {
    if (value < 30) return '#10B981';
    if (value < 60) return '#F59E0B';
    return '#EF4444';
};

const getRiskLabel = (value: number) => {
    if (value < 30) return 'Low';
    if (value < 60) return 'Medium';
    return 'High';
};

const getDecisionClass = (decision: string) => {
    const d = decision.toLowerCase();
    if (d.includes('block') || d.includes('kill')) return 'decision-block';
    if (d.includes('safe') || d.includes('go')) return 'decision-safe';
    return 'decision-proceed';
};

const getDecisionIcon = (decision: string) => {
    const d = decision.toLowerCase();
    if (d.includes('block') || d.includes('kill')) return <XCircle size={28} />;
    if (d.includes('safe') || d.includes('go')) return <CheckCircle2 size={28} />;
    return <AlertCircle size={28} />;
};

// Risk Meter Component
const RiskMeter: React.FC<{
    label: string;
    value: number;
    icon: React.ReactNode;
    delay?: number;
}> = ({ label, value, icon, delay = 0 }) => (
    <motion.div
        className="dashboard-risk-meter"
        variants={itemVariants}
    >
        <div className="risk-meter-header">
            <span className="risk-meter-icon">{icon}</span>
            <span className="risk-meter-label">{label}</span>
        </div>
        <div className="risk-meter-bar-container">
            <div className="risk-meter-track">
                <motion.div
                    className="risk-meter-fill"
                    style={{ backgroundColor: getRiskColor(value) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
                />
            </div>
            <span className="risk-meter-value" style={{ color: getRiskColor(value) }}>
                {value}%
            </span>
        </div>
        <span className="risk-meter-level" style={{ color: getRiskColor(value) }}>
            {getRiskLabel(value)} Risk
        </span>
    </motion.div>
);

export function Dashboard() {
    const navigate = useNavigate();
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('blindspot_result');
        if (stored) {
            setResult(JSON.parse(stored));
        } else {
            navigate('/analyze');
        }
    }, [navigate]);

    if (!result) {
        return (
            <div className="dashboard-loading">
                <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            {/* Header */}
            <header className="dashboard-header">
                <motion.button
                    className="back-button"
                    onClick={() => navigate('/analyze')}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft size={18} />
                    <span>New Analysis</span>
                </motion.button>

                <motion.div
                    className="logo"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => navigate('/')}
                >
                    <div className="logo-icon">
                        <Shield size={20} />
                    </div>
                    <span className="logo-text">
                        Blind<span>Spot</span>
                    </span>
                </motion.div>

                <motion.div
                    className="header-actions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <button className="action-btn">
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                    <button className="action-btn">
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </motion.div>
            </header>

            {/* Startup Info Banner */}
            <motion.div
                className="startup-banner"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="startup-info">
                    <h1 className="startup-name">{result.input.name}</h1>
                    <p className="startup-idea">{result.input.idea}</p>
                </div>
                <div className="startup-tags">
                    <span className="tag">{result.input.industry}</span>
                    <span className="tag">{result.input.platform}</span>
                    <span className="tag">{result.input.stage}</span>
                    <span className="tag">{result.input.targetUsers}</span>
                </div>
            </motion.div>

            {/* Main Dashboard Grid */}
            <motion.div
                className="dashboard-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Column */}
                <div className="dashboard-left">
                    {/* Decision Card */}
                    <motion.div
                        className={`decision-card ${getDecisionClass(result.decision)}`}
                        variants={cardVariants}
                    >
                        <div className="decision-header">
                            <Shield size={20} />
                            <span>AI Review Board Verdict</span>
                        </div>
                        <div className="decision-content">
                            <div className="decision-icon">
                                {getDecisionIcon(result.decision)}
                            </div>
                            <h2 className="decision-title">{result.decision}</h2>
                            <p className="decision-reason">{result.decisionReason}</p>
                        </div>
                    </motion.div>

                    {/* Risk Assessment Card */}
                    <motion.div className="dashboard-card risk-card" variants={cardVariants}>
                        <div className="card-header">
                            <div className="card-icon risk-icon">
                                <Shield size={20} />
                            </div>
                            <div className="card-title-group">
                                <h3 className="card-title">Risk Assessment</h3>
                                <p className="card-subtitle">Technical, Market & Execution risks</p>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="risk-meters">
                                <RiskMeter
                                    label="Technical"
                                    value={result.riskScore.technical}
                                    icon={<Cpu size={16} />}
                                    delay={0}
                                />
                                <RiskMeter
                                    label="Market"
                                    value={result.riskScore.market}
                                    icon={<TrendingUp size={16} />}
                                    delay={0.1}
                                />
                                <RiskMeter
                                    label="Execution"
                                    value={result.riskScore.execution}
                                    icon={<Users size={16} />}
                                    delay={0.2}
                                />
                            </div>
                            <div className="total-risk">
                                <span className="total-label">Overall Risk Score</span>
                                <motion.div
                                    className="total-value"
                                    style={{ color: getRiskColor(result.riskScore.total) }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.6, type: 'spring' }}
                                >
                                    {result.riskScore.total}
                                    <span className="total-max">/100</span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Re-run Analysis Button */}
                    <motion.button
                        className="rerun-button"
                        onClick={() => navigate('/analyze')}
                        variants={cardVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <RefreshCw size={18} />
                        Run New Analysis
                    </motion.button>
                </div>

                {/* Right Column */}
                <div className="dashboard-right">
                    {/* Assumptions Card */}
                    <motion.div className="dashboard-card" variants={cardVariants}>
                        <div className="card-header">
                            <div className="card-icon assumptions-icon">
                                <Lightbulb size={20} />
                            </div>
                            <div className="card-title-group">
                                <h3 className="card-title">Key Assumptions</h3>
                                <p className="card-subtitle">Hidden assumptions from your inputs</p>
                            </div>
                            <span className="card-count">{result.assumptions.length}</span>
                        </div>
                        <div className="card-content scrollable">
                            {result.assumptions.map((assumption) => (
                                <motion.div
                                    key={assumption.id}
                                    className="list-item assumption-item"
                                    variants={itemVariants}
                                >
                                    <Lightbulb size={16} className="item-icon" />
                                    <div className="item-content">
                                        <p className="item-text">{assumption.text}</p>
                                        <span className={`risk-badge badge-${assumption.riskLevel?.toLowerCase()}`}>
                                            {assumption.riskLevel} risk
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Competition Card */}
                    <motion.div className="dashboard-card" variants={cardVariants}>
                        <div className="card-header">
                            <div className="card-icon competition-icon">
                                <Target size={20} />
                            </div>
                            <div className="card-title-group">
                                <h3 className="card-title">Competition Reality</h3>
                                <p className="card-subtitle">Real-world alternatives</p>
                            </div>
                            <span className="card-count">{result.competitors.length}</span>
                        </div>
                        <div className="card-content scrollable">
                            {result.competitors.map((competitor) => (
                                <motion.div
                                    key={competitor.name}
                                    className="list-item competitor-item"
                                    variants={itemVariants}
                                >
                                    <div className="competitor-header">
                                        <span className="competitor-name">{competitor.name}</span>
                                        <span className={`type-badge badge-${competitor.type?.toLowerCase()}`}>
                                            {competitor.type}
                                        </span>
                                    </div>
                                    <p className="competitor-threat">{competitor.threat}</p>
                                    {competitor.url && (
                                        <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="competitor-link">
                                            Visit <ExternalLink size={12} />
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Startup Autopsy Card */}
                    <motion.div className="dashboard-card" variants={cardVariants}>
                        <div className="card-header">
                            <div className="card-icon autopsy-icon">
                                <Skull size={20} />
                            </div>
                            <div className="card-title-group">
                                <h3 className="card-title">Startup Autopsy</h3>
                                <p className="card-subtitle">Similar startups that failed</p>
                            </div>
                            <span className="card-count">{result.failedStartups.length}</span>
                        </div>
                        <div className="card-content scrollable">
                            {result.failedStartups.length > 0 ? (
                                result.failedStartups.map((startup) => (
                                    <motion.div
                                        key={startup.name}
                                        className="list-item autopsy-item"
                                        variants={itemVariants}
                                    >
                                        <div className="autopsy-header">
                                            <Skull size={16} className="item-icon-danger" />
                                            <span className="autopsy-name">{startup.name}</span>
                                            <span className="autopsy-year">{startup.year}</span>
                                        </div>
                                        <p className="autopsy-reason">{startup.reason}</p>
                                        <div className="autopsy-lesson">
                                            <strong>💡 Lesson:</strong> {startup.lesson}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <Skull size={32} />
                                    <p>No matching failure patterns</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Action Items Card */}
                    <motion.div className="dashboard-card" variants={cardVariants}>
                        <div className="card-header">
                            <div className="card-icon actions-icon">
                                <CheckSquare size={20} />
                            </div>
                            <div className="card-title-group">
                                <h3 className="card-title">Reality Checklist</h3>
                                <p className="card-subtitle">Concrete next steps</p>
                            </div>
                            <span className="card-count">{result.actionItems.length}</span>
                        </div>
                        <div className="card-content scrollable">
                            {result.actionItems.map((action) => (
                                <motion.div
                                    key={action.id}
                                    className="list-item action-item"
                                    variants={itemVariants}
                                >
                                    <div className={`action-priority priority-${action.priority}`}>
                                        {action.priority}
                                    </div>
                                    <div className="action-content">
                                        <p className="action-text">{action.text}</p>
                                        <span className="action-category">{action.category}</span>
                                    </div>
                                    <CheckSquare size={18} className="action-check" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
                className="disclaimer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <AlertTriangle size={14} />
                <span>This analysis uses rule-based logic — AI improves clarity, not decision-making.</span>
            </motion.div>
        </div>
    );
}