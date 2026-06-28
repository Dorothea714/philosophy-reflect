import Anthropic from '@anthropic-ai/sdk';
import type { LLMAnalysisResult } from '../types.js';
import { getConceptCount } from './knowledge-base.js';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('请在 .env 文件中设置 ANTHROPIC_API_KEY');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

const SYSTEM_PROMPT = `你是一位资深的哲学教授，精通中西方哲学传统。你的任务是从用户的日常感悟、手记、随笔中识别和分析其中蕴含的哲学思想。

## 你的能力
1. 即使表达不够清晰或精确，你也能捕捉文字背后的哲学意涵和思想倾向
2. 熟悉中国哲学（儒释道）、西方哲学（古希腊、欧陆、分析哲学）、印度哲学等
3. 能将日常感悟与专业的哲学概念、流派、思想家精准关联

## 输出要求
你必须严格以 JSON 格式返回，结构如下：
{
  "user_intent": "一句话概括用户想表达的核心感受或思考",
  "philosophical_themes": ["主题1", "主题2", "主题3"],
  "concept_matches": [
    {
      "concept_name": "哲学概念中文名",
      "relevance": "high|medium|low",
      "explanation": "为什么用户的感悟与此概念相关（2-3句话，用中文）",
      "school": "所属流派（如知道的话）",
      "thinkers": ["相关思想家1", "相关思想家2"]
    }
  ],
  "overall_interpretation": "一段综合分析（150-300字），帮助用户理解自己感悟中的哲学维度"
}

## 注意事项
- concept_matches 返回 3-6 个最相关的哲学概念，按相关度排序
- relevance: high=高度相关/核心主题, medium=明显相关, low=边缘相关
- 优先考虑中文用户可能熟悉的哲学概念（中西并重）
- 即使用户的文字很简短或表达不清，也尽力挖掘其哲学意涵
- explanation 要用平实易懂的中文，让哲学思考变得可亲近`;

export async function analyzeWithLLM(userText: string): Promise<LLMAnalysisResult> {
  const anthropic = getClient();
  const model = process.env.LLM_MODEL || 'claude-sonnet-4-6';
  const conceptCount = await getConceptCount();

  const userMessage = `请分析以下用户感悟中蕴含的哲学思想：

---
${userText}
---

注：当前本地知识库包含 ${conceptCount} 个哲学概念。如果用户的感悟关联到知识库可能未覆盖的概念，也请一并指出。`;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('\n');

    // 解析 JSON 响应（处理可能的 markdown 代码块包裹）
    let jsonStr = textContent.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const result: LLMAnalysisResult = JSON.parse(jsonStr);

    // 基本验证
    if (!result.user_intent || !result.philosophical_themes || !result.concept_matches) {
      throw new Error('LLM 返回格式不完整');
    }

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // JSON 解析失败 — 可能是 LLM 返回格式问题
      console.error('LLM JSON 解析失败，原始输出:', error.message);
      return {
        user_intent: '（分析暂时不可用，请稍后重试）',
        philosophical_themes: [],
        concept_matches: [],
        overall_interpretation: 'LLM 分析服务暂时遇到问题，但本地知识库匹配结果仍然可用。',
      };
    }
    throw error;
  }
}

/**
 * 检查 LLM 服务是否可用
 */
export async function checkLLMAvailability(): Promise<boolean> {
  try {
    const client = getClient();
    return !!client;
  } catch {
    return false;
  }
}
