import { useState } from 'react';
import type { FinalAnalysisResult, MergedConceptResult } from '../types';
import { ConceptCard } from './ConceptCard';
import { ConceptDetail } from './ConceptDetail';

interface AnalysisResultProps {
  result: FinalAnalysisResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [selectedConcept, setSelectedConcept] = useState<MergedConceptResult | null>(null);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">📊</span>
        <h2 className="text-lg font-semibold text-ink-800">分析结果</h2>
      </div>

      {/* AI 综合解读 */}
      <div className="bg-gradient-to-br from-primary-50 to-amber-50 rounded-xl p-4 border border-primary-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">🧠</span>
          <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">AI 综合解读</span>
        </div>
        <p className="text-sm text-ink-700 leading-relaxed">{result.overall_interpretation}</p>

        {result.themes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {result.themes.map((theme) => (
              <span key={theme} className="text-xs bg-white/70 text-primary-700 px-2 py-0.5 rounded-full border border-primary-200">
                {theme}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 识别到的哲学概念 */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">
          🔍 识别到的哲学概念 ({result.concepts.length})
        </h3>

        {result.concepts.length === 0 ? (
          <p className="text-sm text-ink-400 text-center py-8">
            暂未识别到明确的哲学概念，试试写得更详细一些？
          </p>
        ) : (
          <div className="space-y-3">
            {result.concepts.map((concept, idx) => (
              <ConceptCard
                key={`${concept.concept_name}-${idx}`}
                concept={concept}
                onClick={setSelectedConcept}
              />
            ))}
          </div>
        )}
      </div>

      {/* 概念详情弹窗 */}
      {selectedConcept && (
        <ConceptDetail
          concept={selectedConcept}
          onClose={() => setSelectedConcept(null)}
        />
      )}
    </div>
  );
}
