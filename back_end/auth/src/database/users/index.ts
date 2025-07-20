import Database from 'better-sqlite3'

export interface User {
  id: number
  email: string
  password: string
  is2FAEnabled: boolean
  twoFASecret?: string
  created_at: string
  updated_at: string
}

export interface UpdateUser {
  email?: string
  password?: string
  is2FAEnabled?: boolean
  twoFASecret?: string
}

export const db = new Database('./transcendence.db', { verbose: console.log })

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is2FAEnabled INTEGER DEFAULT 0,
    twoFASecret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)
