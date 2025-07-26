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

export type GameResult = {
	id: number;
	player1: string;
	player2: string;
	player1score: number;
	player2score: number;
	user_id: number;
	created_at: string;
};

export type ChatMessage = {
	id: number;
	message: string;
	created_at: string;
	user_id: number | null;
	user_email: string | null;
};

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

// db.exec(`
//   CREATE TABLE IF NOT EXISTS chats (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     message TEXT NOT NULL UNIQUE,
// 	user_id 
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
// `)

// db.exec(`
//   CREATE TABLE IF NOT EXISTS gameresult (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     player1 TEXT NOT NULL,
// 	player2 TEXT NOT NULL,
// 	player1score INTEGER,
// 	player2score INTEGER,
// 	user_id
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
// `)
