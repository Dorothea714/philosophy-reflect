import { matchByKeywords, detectPhilosophicalDomains } from './matcher.js';
import { analyzeWithLLM } from './llm.js';
import { getConceptsByIds, searchConcepts } from './knowledge-base.js';
import type { MatchResult, LLMAnalysisResult, FinalAnalysisResult, MergedConceptResult } from '../types.js';

/**
 * 核心分析引擎：编排完整的分析 pipeline
 *
 * Pipeline:
 * 1. 本地关键词匹配 → 获取候选概念
 * 2. LLM 深度分析 → 获取哲学解读
 * 3. 结果合并去重 → 合并两个来源的结果
 * 4. 排序输出
 */
export async function analyze(userText: string): Promise<FinalAnalysisResult> {
  // Step 1: 检测可能涉及的哲学领域
  const domains = detectPhilosophicalDomains(userText);

  // Step 2: 本地知识库关键词匹配
  const localMatches = await matchByKeywords(userText, 10);

  // Step 3: LLM 深度分析（如果可用）
  let llmResult: LLMAnalysisResult | null = null;
  try {
    llmResult = await analyzeWithLLM(userText);
  } catch (error) {
    console.warn('LLM 分析失败，使用仅本地匹配结果:', error);
  }

  // Step 4: 合并结果
  const concepts = mergeResults(localMatches, llmResult);

  return {
    user_intent: llmResult?.user_intent || extractSimpleIntent(userText),
    themes: llmResult?.philosophical_themes || domains,
    concepts,
    overall_interpretation: llmResult?.overall_interpretation || generateLocalInterpretation(localMatches, userText),
  };
}

/**
 * 合并本地匹配和 LLM 结果
 */
function mergeResults(
  localMatches: MatchResult[],
  llmResult: LLMAnalysisResult | null
): MergedConceptResult[] {
  const merged: MergedConceptResult[] = [];
  const seenNames = new Set<string>();

  // 先添加 LLM 结果（通常更精准）
  if (llmResult) {
    for (const match of llmResult.concept_matches) {
      const normalizedName = match.concept_name.trim();
      if (seenNames.has(normalizedName)) continue;
      seenNames.add(normalizedName);

      // 尝试在本地知识库中找到匹配的概念
      const localMatch = findLocalConcept(normalizedName, localMatches);

      merged.push({
        concept_name: normalizedName,
        concept_name_en: localMatch?.concept.name_en,
        relevance: match.relevance,
        explanation: match.explanation,
        school: match.school || localMatch?.concept.school,
        thinkers: match.thinkers || localMatch?.concept.thinkers,
        knowledge_base_detail: localMatch?.concept,
      });
    }
  }

  // 补充 LLM 未覆盖的本地高得分匹配
  for (const local of localMatches) {
    if (seenNames.has(local.concept.name)) continue;
    if (local.score < 0.15) continue; // 过滤低相关度结果
    seenNames.add(local.concept.name);

    merged.push({
      concept_name: local.concept.name,
      concept_name_en: local.concept.name_en,
      relevance: local.score > 0.4 ? 'high' : local.score > 0.2 ? 'medium' : 'low',
      explanation: `您的文字与"${local.concept.name}"这一概念有显著关联——${local.matchReason}。${local.concept.summary}`,
      school: local.concept.school,
      thinkers: local.concept.thinkers,
      knowledge_base_detail: local.concept,
    });
  }

  // 按相关度排序: high > medium > low
  const relevanceOrder = { high: 0, medium: 1, low: 2 };
  merged.sort((a, b) => relevanceOrder[a.relevance] - relevanceOrder[b.relevance]);

  return merged.slice(0, 8);
}

/**
 * 在本地匹配结果中查找与 LLM 概念名匹配的概念
 */
function findLocalConcept(
  conceptName: string,
  localMatches: MatchResult[]
): MatchResult | undefined {
  // 精确匹配
  const exact = localMatches.find(m => m.concept.name === conceptName);
  if (exact) return exact;

  // 包含匹配
  const contains = localMatches.find(
    m => m.concept.name.includes(conceptName) || conceptName.includes(m.concept.name)
  );
  if (contains) return contains;

  // 关键词重叠（取相关度最高的）
  return localMatches[0];
}

/**
 * 简单的意图提取（LLM 不可用时的 fallback）
 */
function extractSimpleIntent(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= 20) return `您表达了简短的感悟：${trimmed}`;
  return `您分享了一段${trimmed.length}字的感悟，涉及对生活、自我或世界的思考。`;
}

/**
 * 基于本地结果的解读（LLM 不可用时的 fallback）
 */
function generateLocalInterpretation(matches: MatchResult[], userText: string): string {
  if (matches.length === 0) {
    return '您的感悟表达了独特的个人体验。虽然未能在知识库中找到高度匹配的哲学概念，但这并不意味着它缺乏哲学深度——最个人化的体验往往蕴含着最普遍的哲学问题。建议尝试更详细地描述您的感受和思考，或参考下方推荐的相关领域进行探索。';
  }

  const topConcepts = matches.slice(0, 3).map(m => m.concept.name).join('、');
  return `根据您的感悟，本地分析引擎识别出以下哲学概念与之相关：${topConcepts}。这些概念分属不同的哲学传统和时代，但它们都触及了人类思考的普遍主题。点击下方卡片查看每个概念的详细介绍，了解相关思想家和经典著作。`;
}
