import type { MergedConceptResult, PhilosophyConcept } from '../types';

interface ConceptDetailProps {
  concept: MergedConceptResult;
  onClose: () => void;
}

export function ConceptDetail({ concept, onClose }: ConceptDetailProps) {
  const detail = concept.knowledge_base_detail;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto
                   border border-ink-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-5 border-b border-ink-100 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-900">{concept.concept_name}</h2>
              {concept.concept_name_en && (
                <p className="text-sm text-ink-400 mt-0.5">{concept.concept_name_en}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-ink-400 hover:text-ink-600 hover:bg-ink-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {detail && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                {detail.category}
              </span>
              {detail.school && (
                <span className="text-xs bg-ink-50 text-ink-600 px-2 py-0.5 rounded-full">
                  {detail.school}
                </span>
              )}
              {detail.era && (
                <span className="text-xs bg-ink-50 text-ink-600 px-2 py-0.5 rounded-full">
                  {detail.era}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* AI 解读 */}
          <section>
            <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">
              🧠 AI 解读
            </h3>
            <p className="text-ink-700 leading-relaxed">{concept.explanation}</p>
          </section>

          {/* 知识库详情 */}
          {detail && (
            <>
              {detail.summary && (
                <section>
                  <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">
                    📖 概述
                  </h3>
                  <p className="text-ink-700 leading-relaxed">{detail.summary}</p>
                </section>
              )}

              {detail.description && (
                <section>
                  <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">
                    📚 详细解释
                  </h3>
                  <p className="text-ink-700 leading-relaxed whitespace-pre-line">{detail.description}</p>
                </section>
              )}

              {detail.thinkers && detail.thinkers.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">
                    👤 相关思想家
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.thinkers.map((t) => (
                      <span key={t} className="text-sm bg-ink-50 text-ink-700 px-2.5 py-1 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {detail.quotes && detail.quotes.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">
                    💬 经典语录
                  </h3>
                  <ul className="space-y-2">
                    {detail.quotes.map((q, i) => (
                      <li key={i} className="text-ink-600 italic border-l-2 border-primary-300 pl-3 text-sm leading-relaxed">
                        {q}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {detail.references && detail.references.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">
                    📖 推荐阅读
                  </h3>
                  <ul className="space-y-1">
                    {detail.references.map((r, i) => (
                      <li key={i} className="text-sm text-primary-600 hover:underline cursor-pointer">
                        {r}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 border-t border-ink-100 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-ink-500 bg-ink-50 rounded-lg
                       hover:bg-ink-100 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
