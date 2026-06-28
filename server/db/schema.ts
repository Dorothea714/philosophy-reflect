import { getDb, saveDb } from './connection.js';

export async function initSchema(): Promise<void> {
  const db = await getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS philosophy_concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_en TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      school TEXT NOT NULL DEFAULT '',
      era TEXT NOT NULL DEFAULT '',
      thinkers TEXT NOT NULL DEFAULT '[]',
      summary TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '[]',
      related_ids TEXT NOT NULL DEFAULT '[]',
      quotes TEXT NOT NULL DEFAULT '[]',
      "references" TEXT NOT NULL DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analysis_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_text TEXT NOT NULL,
      result_json TEXT NOT NULL DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 索引
  db.run(`CREATE INDEX IF NOT EXISTS idx_concepts_category ON philosophy_concepts(category)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_concepts_name ON philosophy_concepts(name)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_history_date ON analysis_history(created_at DESC)`);

  saveDb();
  console.log('✓ 数据库表结构已初始化');
}
