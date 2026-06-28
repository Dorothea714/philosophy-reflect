// 哲学概念
export interface PhilosophyConcept {
  id: number;
  name: string;
  name_en: string;
  category: string;
  school: string;
  era: string;
  thinkers: string;       // JSON array
  summary: string;
  description: string;
  keywords: string;       // JSON array
  related_ids: string;    // JSON array
  quotes: string;         // JSON array
  references: string;     // JSON array
}

// 从 DB 解析后的概念
export interface PhilosophyConceptParsed {
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

// 本地匹配结果
export interface MatchResult {
  concept: PhilosophyConceptParsed;
  score: number;
  matchReason: string;
}

// LLM 分析结果中的单个概念匹配
export interface LLMConceptMatch {
  concept_name: string;
  relevance: 'high' | 'medium' | 'low';
  explanation: string;
  school?: string;
  thinkers?: string[];
}

// LLM 分析返回结构
export interface LLMAnalysisResult {
  user_intent: string;
  philosophical_themes: string[];
  concept_matches: LLMConceptMatch[];
  overall_interpretation: string;
}

// 最终合并后的分析结果
export interface FinalAnalysisResult {
  user_intent: string;
  themes: string[];
  concepts: MergedConceptResult[];
  overall_interpretation: string;
}

// 合并后的概念结果
export interface MergedConceptResult {
  concept_name: string;
  concept_name_en?: string;
  relevance: 'high' | 'medium' | 'low';
  explanation: string;
  school?: string;
  thinkers?: string[];
  // 如果本地知识库有匹配，附上详细信息
  knowledge_base_detail?: PhilosophyConceptParsed;
}

// 用户分析记录
export interface AnalysisRecord {
  id: number;
  user_text: string;
  result_json: string;
  created_at: string;
}

// API 请求/响应类型
export interface AnalyzeRequest {
  text: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: FinalAnalysisResult;
  error?: string;
}

export interface KnowledgeSearchRequest {
  q?: string;
  category?: string;
}

export interface KnowledgeSearchResponse {
  success: boolean;
  data?: PhilosophyConceptParsed[];
  total?: number;
  error?: string;
}
