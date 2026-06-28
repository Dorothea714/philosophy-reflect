import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSchema } from './db/schema.js';
import { closeDb } from './db/connection.js';
import analyzeRouter from './routes/analyze.js';
import knowledgeRouter from './routes/knowledge.js';
import searchRouter from './routes/search.js';
import historyRouter from './routes/history.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const projectRoot = process.cwd();

// 中间件
app.use(express.json({ limit: '50kb' }));

// API 路由
app.use('/api/analyze', analyzeRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/search', searchRouter);
app.use('/api/history', historyRouter);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 生产环境：服务前端静态文件
const distPath = path.join(projectRoot, 'dist');
app.use(express.static(distPath));

// SPA fallback：所有非 API 请求返回 index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 优雅关闭
process.on('SIGINT', () => { closeDb(); process.exit(); });
process.on('SIGTERM', () => { closeDb(); process.exit(); });

// 启动
async function start() {
  await initSchema();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏛️  哲学感悟分析器已启动`);
    console.log(`   端口: ${PORT}`);
    console.log(`   访问: http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});

export default app;
