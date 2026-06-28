import { Router, Request, Response } from 'express';
import {
  getConceptById,
  getConceptsByCategory,
  getAllConcepts,
  getAllCategories,
  getConceptCount,
} from '../services/knowledge-base.js';

const router = Router();

// 获取统计和分类（必须在 /:id 之前注册）
router.get('/meta/categories', async (_req: Request, res: Response) => {
  const categories = await getAllCategories();
  return res.json({ success: true, data: categories });
});

router.get('/meta/stats', async (_req: Request, res: Response) => {
  const count = await getConceptCount();
  const categories = await getAllCategories();
  return res.json({
    success: true,
    data: { total_concepts: count, categories: categories.length, category_list: categories },
  });
});

// 获取单个概念
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: '无效的 ID' });
  }
  const concept = await getConceptById(id);
  if (!concept) {
    return res.status(404).json({ success: false, error: '概念不存在' });
  }
  return res.json({ success: true, data: concept });
});

// 获取所有概念（可按分类筛选）
router.get('/', async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const concepts = category
    ? await getConceptsByCategory(category)
    : await getAllConcepts();
  return res.json({ success: true, data: concepts, total: concepts.length });
});

export default router;
