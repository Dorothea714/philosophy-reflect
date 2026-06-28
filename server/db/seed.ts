import { getDb, saveDb, closeDb } from './connection.js';
import { initSchema } from './schema.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface RawConcept {
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

async function seed(): Promise<void> {
  await initSchema();
  const db = await getDb();

  // 检查是否已有数据
  const countResult = db.exec('SELECT COUNT(*) AS cnt FROM philosophy_concepts');
  if (countResult.length > 0 && countResult[0].values.length > 0) {
    const cnt = countResult[0].values[0][0] as number;
    if (cnt > 0) {
      console.log(`数据库已有 ${cnt} 条概念记录，跳过种子数据导入。`);
      closeDb();
      return;
    }
  }

  // 读取种子数据
  const dataPath = path.join(__dirname, '..', '..', 'data', 'philosophy-concepts.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const concepts: RawConcept[] = JSON.parse(rawData);

  const stmt = db.prepare(`
    INSERT INTO philosophy_concepts (name, name_en, category, school, era, thinkers, summary, description, keywords, related_ids, quotes, "references")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of concepts) {
    stmt.run([
      c.name,
      c.name_en,
      c.category,
      c.school,
      c.era,
      JSON.stringify(c.thinkers),
      c.summary,
      c.description,
      JSON.stringify(c.keywords),
      JSON.stringify(c.related_ids),
      JSON.stringify(c.quotes),
      JSON.stringify(c.references),
    ]);
  }
  stmt.free();

  saveDb();
  console.log(`✓ 成功导入 ${concepts.length} 条哲学概念`);
  closeDb();
}

seed().catch((err) => {
  console.error('种子数据导入失败:', err);
  process.exit(1);
});
