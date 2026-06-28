import { getDb } from '../db/connection.js';
import type { PhilosophyConceptParsed } from '../types.js';

function parseRow(columns: string[], values: any[]): PhilosophyConceptParsed {
  const row: Record<string, any> = {};
  columns.forEach((col, i) => { row[col] = values[i]; });

  return {
    id: row.id,
    name: row.name,
    name_en: row.name_en,
    category: row.category,
    school: row.school,
    era: row.era,
    thinkers: JSON.parse(row.thinkers || '[]'),
    summary: row.summary,
    description: row.description,
    keywords: JSON.parse(row.keywords || '[]'),
    related_ids: JSON.parse(row.related_ids || '[]'),
    quotes: JSON.parse(row.quotes || '[]'),
    references: JSON.parse(row.references || '[]'),
  };
}

function queryAll(db: any, sql: string): PhilosophyConceptParsed[] {
  const result = db.exec(sql);
  if (result.length === 0 || result[0].values.length === 0) return [];
  return result[0].values.map((row: any[]) => parseRow(result[0].columns, row));
}

function queryOne(db: any, sql: string): PhilosophyConceptParsed | null {
  const result = db.exec(sql);
  if (result.length === 0 || result[0].values.length === 0) return null;
  return parseRow(result[0].columns, result[0].values[0]);
}

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

export async function getConceptById(id: number): Promise<PhilosophyConceptParsed | null> {
  const db = await getDb();
  return queryOne(db, `SELECT * FROM philosophy_concepts WHERE id = ${id}`);
}

export async function getConceptsByIds(ids: number[]): Promise<PhilosophyConceptParsed[]> {
  if (ids.length === 0) return [];
  const db = await getDb();
  return queryAll(db, `SELECT * FROM philosophy_concepts WHERE id IN (${ids.join(',')})`);
}

export async function searchConcepts(query: string, limit = 20): Promise<PhilosophyConceptParsed[]> {
  const db = await getDb();
  const q = esc(query);
  const like = `%${q}%`;
  return queryAll(db,
    `SELECT * FROM philosophy_concepts
     WHERE name LIKE '${like}' OR name_en LIKE '${like}' OR summary LIKE '${like}' OR keywords LIKE '${like}'
     ORDER BY id LIMIT ${limit}`
  );
}

export async function getConceptsByCategory(category: string): Promise<PhilosophyConceptParsed[]> {
  const db = await getDb();
  return queryAll(db, `SELECT * FROM philosophy_concepts WHERE category = '${esc(category)}' ORDER BY id`);
}

let cachedConcepts: PhilosophyConceptParsed[] | null = null;

export async function getAllConcepts(): Promise<PhilosophyConceptParsed[]> {
  if (cachedConcepts) return cachedConcepts;
  const db = await getDb();
  cachedConcepts = queryAll(db, 'SELECT * FROM philosophy_concepts ORDER BY category, id');
  return cachedConcepts;
}

let cachedCategories: string[] | null = null;

export async function getAllCategories(): Promise<string[]> {
  if (cachedCategories) return cachedCategories;
  const db = await getDb();
  const result = db.exec('SELECT DISTINCT category FROM philosophy_concepts ORDER BY category');
  if (result.length === 0) return [];
  cachedCategories = result[0].values.map((row: any[]) => String(row[0]));
  return cachedCategories;
}

export async function getConceptCount(): Promise<number> {
  const db = await getDb();
  const result = db.exec('SELECT COUNT(*) AS cnt FROM philosophy_concepts');
  if (result.length === 0) return 0;
  return result[0].values[0][0] as number;
}

export function clearCache(): void {
  cachedConcepts = null;
  cachedCategories = null;
}
