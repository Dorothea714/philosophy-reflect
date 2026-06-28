import { Router, Request, Response } from 'express';
import { analyze } from '../services/analyzer.js';
import { getDb, saveDb } from '../db/connection.js';
import type { AnalyzeRequest, AnalyzeResponse } from '../types.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { text } = req.body as AnalyzeRequest;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: '请提供要分析的文本内容' } satisfies AnalyzeResponse);
    }

    const trimmedText = text.trim();

    if (trimmedText.length < 2) {
      return res.status(400).json({ success: false, error: '文本太短，请至少输入2个字符' } satisfies AnalyzeResponse);
    }

    if (trimmedText.length > 5000) {
      return res.status(400).json({ success: false, error: '文本过长，请限制在5000字以内' } satisfies AnalyzeResponse);
    }

    const result = await analyze(trimmedText);

    // 保存历史记录
    try {
      const db = await getDb();
      db.run(`INSERT INTO analysis_history (user_text, result_json) VALUES ('${trimmedText.replace(/'/g, "''")}', '${JSON.stringify(result).replace(/'/g, "''")}')`);
      saveDb();
    } catch (dbError) {
      console.warn('保存历史记录失败:', dbError);
    }

    return res.json({ success: true, data: result } satisfies AnalyzeResponse);
  } catch (error) {
    console.error('分析失败:', error);
    return res.status(500).json({ success: false, error: '分析服务暂时不可用，请稍后重试' } satisfies AnalyzeResponse);
  }
});

export default router;
