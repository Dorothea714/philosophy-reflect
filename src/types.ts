// 前端共享类型（与 server/types.ts 对应）

export interface MergedConceptResult {
  concept_name: string;
  concept_name_en?: string;
  relevance: 'high' | 'medium' | 'low';
  explanation: string;
  school?: string;
  thinkers?: string[];
  knowledge_base_detail?: PhilosophyConcept;
}

export interface PhilosophyConcept {
  id: number;
  name: string;
  name_en: string;
  category: string;
  school: string;
  era: string;
  thinkers: string[];
  summary: string;
  description: string;
  keywords: string[];
  related_ids: number[];
  quotes: string[];
  references: string[];
}

export interface FinalAnalysisResult {
  user_intent: string;
  themes: string[];
  concepts: MergedConceptResult[];
  overall_interpretation: string;
}

export interface HistoryItem {
  id: number;
  user_text: string;
  created_at: string;
}
