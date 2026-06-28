import { useState, useCallback } from 'react';
import type { FinalAnalysisResult } from '../types';

interface AnalyzeState {
  loading: boolean;
  result: FinalAnalysisResult | null;
  error: string | null;
}

export function useAnalyze() {
  const [state, setState] = useState<AnalyzeState>({
    loading: false,
    result: null,
    error: null,
  });

  const analyze = useCallback(async (text: string) => {
    setState({ loading: true, result: null, error: null });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!data.success) {
        setState({ loading: false, result: null, error: data.error || '分析失败' });
        return;
      }

      setState({ loading: false, result: data.data, error: null });
    } catch (err) {
      setState({
        loading: false,
        result: null,
        error: '网络错误，请确认 API 服务已启动',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, result: null, error: null });
  }, []);

  return { ...state, analyze, reset };
}
