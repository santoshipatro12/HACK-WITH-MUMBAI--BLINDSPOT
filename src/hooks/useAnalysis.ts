// hooks/useAnalysis.ts

import { useState, useEffect, useCallback } from 'react';
import { StartupInput, AnalysisResult } from '../types';
import { runFullAnalysis } from '../utils/analysisEngine';

interface UseAnalysisReturn {
    result: AnalysisResult | null;
    loading: boolean;
    error: string | null;
    runAnalysis: (input: StartupInput) => Promise<void>;
    clearResult: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load cached result on mount
    useEffect(() => {
        const cached = sessionStorage.getItem('blindspot_result');
        if (cached) {
            try {
                setResult(JSON.parse(cached));
            } catch (e) {
                console.error('Failed to parse cached result:', e);
                sessionStorage.removeItem('blindspot_result');
            }
        }
    }, []);

    const runAnalysis = useCallback(async (input: StartupInput) => {
        setLoading(true);
        setError(null);

        try {
            console.log('🚀 Starting analysis for:', input.name);
            const analysisResult = await runFullAnalysis(input);

            setResult(analysisResult);
            sessionStorage.setItem('blindspot_result', JSON.stringify(analysisResult));

            console.log('✅ Analysis complete:', analysisResult.decision);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
            setError(errorMessage);
            console.error('❌ Analysis error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResult = useCallback(() => {
        setResult(null);
        setError(null);
        sessionStorage.removeItem('blindspot_result');
    }, []);

    return {
        result,
        loading,
        error,
        runAnalysis,
        clearResult,
    };
}