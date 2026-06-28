import { useState, useCallback } from 'react';
import { WritingPanel } from './components/WritingPanel';
import { AnalysisResult } from './components/AnalysisResult';
import { HistoryList } from './components/HistoryList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAnalyze } from './hooks/useAnalyze';
import type { HistoryItem } from './types';

export default function App() {
  const { loading, result, error, analyze, reset } = useAnalyze();
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [mobileView, setMobileView] = useState<'write' | 'result'>('write');

  const handleSubmit = useCallback(async (text: string) => {
    await analyze(text);
    setHistoryRefresh((n) => n + 1);
    // 移动端自动切换到结果视图
    setMobileView('result');
  }, [analyze]);

  const handleClear = useCallback(() => {
    reset();
  }, [reset]);

  const handleHistorySelect = (item: HistoryItem) => {
    analyze(item.user_text);
    setMobileView('result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-ink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h1 className="text-xl font-bold text-ink-900 font-serif">哲学感悟分析器</h1>
              <p className="text-xs text-ink-400">写下你的感悟，发现其中蕴含的哲学思想</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile view toggle */}
      <div className="md:hidden flex border-b border-ink-100 bg-white">
        <button
          onClick={() => setMobileView('write')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors
            ${mobileView === 'write'
              ? 'text-primary-700 border-b-2 border-primary-500'
              : 'text-ink-400'}`}
        >
          📝 书写
        </button>
        <button
          onClick={() => setMobileView('result')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors
            ${mobileView === 'result'
              ? 'text-primary-700 border-b-2 border-primary-500'
              : 'text-ink-400'}`}
        >
          📊 分析
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Left: 书写面板 */}
          <div className={`md:flex-[4] flex flex-col ${mobileView === 'write' ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl shadow-sm border border-ink-100 p-5 flex-1 flex flex-col">
              <WritingPanel onSubmit={handleSubmit} onClear={handleClear} loading={loading} />
            </div>

            {/* 历史记录 - 桌面端显示在左侧下方 */}
            <div className="hidden md:block mt-4 bg-white rounded-2xl shadow-sm border border-ink-100 p-5 max-h-[250px] overflow-y-auto">
              <HistoryList onSelect={handleHistorySelect} refreshTrigger={historyRefresh} />
            </div>
          </div>

          {/* Right: 分析结果 */}
          <div className={`md:flex-[5] flex flex-col ${mobileView === 'result' ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl shadow-sm border border-ink-100 p-5 flex-1 flex flex-col overflow-hidden">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-4xl mb-3">😔</span>
                  <p className="text-ink-600 font-medium">分析遇到了问题</p>
                  <p className="text-sm text-ink-400 mt-1">{error}</p>
                  <button
                    onClick={reset}
                    className="mt-4 px-4 py-2 text-sm text-primary-600 bg-primary-50 rounded-lg
                               hover:bg-primary-100 transition-colors"
                  >
                    重试
                  </button>
                </div>
              ) : result ? (
                <AnalysisResult result={result} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-5xl mb-4">🪷</span>
                  <p className="text-ink-500 font-medium">等待你的感悟</p>
                  <p className="text-sm text-ink-400 mt-1 max-w-xs">
                    在左侧写下你的思考、感受或困惑，AI 将帮你发现其中蕴含的哲学思想
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 移动端历史记录 */}
        <div className="md:hidden mt-6 bg-white rounded-2xl shadow-sm border border-ink-100 p-5">
          <HistoryList onSelect={handleHistorySelect} refreshTrigger={historyRefresh} />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-ink-300 border-t border-ink-50 mt-8">
        哲学感悟分析器 — 每个人的思考都值得被认真对待
      </footer>
    </div>
  );
}
