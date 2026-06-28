import { getAllConcepts } from './knowledge-base.js';
import type { PhilosophyConceptParsed, MatchResult } from '../types.js';

function tokenize(text: string): string[] {
  const tokens: string[] = [];
  // 提取中文：使用更宽松的 Unicode 范围覆盖所有 CJK 字符
  const chineseChars = text.replace(/[^一-鿿㐀-䶿]/g, '');
  for (let len = 4; len >= 2; len--) {
    for (let i = 0; i <= chineseChars.length - len; i++) {
      tokens.push(chineseChars.slice(i, i + len));
    }
  }
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  tokens.push(...englishWords.map(w => w.toLowerCase()));
  const singleChars = chineseChars.split('');
  tokens.push(...singleChars);
  return [...new Set(tokens)];
}

export async function matchByKeywords(userText: string, topK = 10): Promise<MatchResult[]> {
  const concepts = await getAllConcepts();
  if (concepts.length === 0) return [];

  const userTokens = tokenize(userText.toLowerCase());
  const userTokenSet = new Set(userTokens);

  const results: MatchResult[] = [];

  for (const concept of concepts) {
    const keywordHits: string[] = [];
    for (const kw of concept.keywords) {
      const kwLower = kw.toLowerCase();
      if (userText.toLowerCase().includes(kwLower)) {
        keywordHits.push(kw);
      }
      const kwTokens = tokenize(kwLower);
      const matchCount = kwTokens.filter(t => userTokenSet.has(t)).length;
      if (matchCount >= kwTokens.length * 0.6 && kwTokens.length > 0) {
        keywordHits.push(kw);
      }
    }

    const nameHit = userText.includes(concept.name) ? 1 : 0;
    const descTokens = tokenize((concept.summary + concept.description).toLowerCase());
    const descOverlap = descTokens.filter(t => userTokenSet.has(t)).length;

    const keywordScore = keywordHits.length / Math.max(concept.keywords.length, 1);
    const nameScore = nameHit * 0.5;
    const descScore = Math.min(descOverlap / Math.max(descTokens.length, 1), 1) * 0.3;
    const score = keywordScore * 0.5 + nameScore * 0.3 + descScore * 0.2;

    if (score > 0) {
      results.push({
        concept,
        score,
        matchReason: keywordHits.length > 0
          ? `关键词匹配：${[...new Set(keywordHits)].slice(0, 3).join('、')}`
          : '内容相关性匹配',
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

export function detectPhilosophicalDomains(userText: string): string[] {
  const domainPatterns: Record<string, RegExp[]> = {
    '形而上学': [/存在/, /本质/, /实在/, /因果/, /为什么.*存在/, /我是谁/, /世界.*什么/],
    '认识论': [/知道/, /真理/, /真相/, /怀疑/, /真的吗/, /不确定/, /知识/, /理解/],
    '伦理学': [/善/, /恶/, /应该/, /对错/, /公平/, /道德/, /良心/, /正义/, /好.*坏/],
    '存在主义': [/意义/, /荒谬/, /虚无/, /活着/, /人生.*意义/, /选择/, /自由/, /焦虑/, /死亡/],
    '中国哲学': [/道/, /德/, /仁/, /无为/, /自然/, /空/, /禅/, /阴阳/, /中庸/, /缘/],
    '政治哲学': [/自由/, /平等/, /权利/, /公正/, /制度/, /权力/, /社会/],
    '美学': [/美/, /艺术/, /审美/, /好看/, /丑/, /品味/],
  };

  const domains: string[] = [];
  for (const [domain, patterns] of Object.entries(domainPatterns)) {
    if (patterns.some(p => p.test(userText))) {
      domains.push(domain);
    }
  }
  return domains;
}
