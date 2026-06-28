import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db/connection.js';

const router = Router();

// 获取历史记录列表
router.get('/', async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const db = await getDb();

  const result = db.exec(`SELECT id, user_text, created_at FROM analysis_history ORDER BY created_at DESC LIMIT ${limit}`);
  if (result.length === 0) {
    return res.json({ success: true, data: [] });
  }

  const { columns, values } = result[0];
  const data = values.map((row: any[]) => {
    const obj: Record<string, any> = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });

  return res.json({ success: true, data });
});

// 获取单条历史记录详情
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: '无效的 ID' });
  }

  const db = await getDb();
  const result = db.exec(`SELECT * FROM analysis_history WHERE id = ${id}`);
  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ success: false, error: '记录不存在' });
  }

  const { columns, values } = result[0];
  const row: Record<string, any> = {};
  columns.forEach((col, i) => { row[col] = values[0][i]; });

  return res.json({
    success: true,
    data: {
      id: row.id,
      user_text: row.user_text,
      result_json: JSON.parse(row.result_json || '{}'),
      created_at: row.created_at,
    },
  });
});

// 删除历史记录
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: '无效的 ID' });
  }

  const db = await getDb();
  db.run(`DELETE FROM analysis_history WHERE id = ${id}`);
  saveDb();

  return res.json({ success: true });
});

export default router;
