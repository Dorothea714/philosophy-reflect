import { Router, Request, Response } from 'express';
import { searchConcepts } from '../services/knowledge-base.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  if (!query.trim()) {
    return res.status(400).json({ success: false, error: '请提供搜索关键词' });
  }

  const results = await searchConcepts(query.trim(), limit);
  return res.json({ success: true, data: results, total: results.length });
});

export default router;
