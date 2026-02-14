import Database from 'better-sqlite3';
import { env } from './env.js';

export async function createDb() {
  const db = new Database(env.sqlitePath);

  await db.exec('PRAGMA foreign_keys = ON');

  return db;
}
