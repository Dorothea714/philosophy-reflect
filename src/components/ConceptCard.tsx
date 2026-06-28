import type { MergedConceptResult } from '../types';

interface ConceptCardProps {
  concept: MergedConceptResult;
  onClick: (concept: MergedConceptResult) => void;
}

const relevanceColors: Record<string, string> = {
  high: 'bg-amber-100 text-amber-800 border-amber-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-100',
  low: 'bg-gray-50 text-gray-600 border-gray-100',
};

const relevanceLabels: Record<string, string> = {
  high: '高度相关',
  medium: '相关',
  low: '边缘相关',
};

export function ConceptCard({ concept, onClick }: ConceptCardProps) {
  return (
    <div
      onClick={() => onClick(concept)}
      className="group p-4 bg-white rounded-xl border border-ink-100
                 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100/50
                 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-ink-900 group-hover:text-primary-700 transition-colors">
              {concept.concept_name}
            </h3>
            {concept.concept_name_en && (
              <span className="text-xs text-ink-400 font-light">{concept.concept_name_en}</span>
            )}
          </div>

          {concept.school && (
            <span className="inline-block mt-1 text-xs text-ink-500 bg-ink-50 px-2 py-0.5 rounded">
              {concept.school}
            </span>
          )}
        </div>

        <span className={`shrink-0 text-xs px-2 py-1 rounded-full border ${relevanceColors[concept.relevance]}`}>
          {relevanceLabels[concept.relevance]}
        </span>
      </div>

      <p className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-2">
        {concept.explanation}
      </p>

      {concept.thinkers && concept.thinkers.length > 0 && (
        <div className="mt-2 flex items-center gap-1 flex-wrap">
          {concept.thinkers.slice(0, 3).map((thinker) => (
            <span key={thinker} className="text-xs text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
              {thinker}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
