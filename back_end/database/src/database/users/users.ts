
import { UpdateUser, User } from '../../structs'
import { db } from '../db'
import bcrypt from 'bcrypt'

export const getUserByEmail = async (email: string): Promise<User | null> => {
	const stmt = db.prepare(`
		SELECT 
		id, email, password, is2FAEnabled, twoFASecret, created_at, updated_at
		FROM users
		WHERE email = ?
	`)
	const row = stmt.get(email)
	return (row as User) || null
}

export const getUserByID = async (id: number): Promise<User | null> => {
	const stmt = db.prepare(`
		SELECT 
		id, email, password, is2FAEnabled, twoFASecret, created_at, updated_at
		FROM users
		WHERE id = ?
	`)
	const row = stmt.get(id)
	return (row as User) || null
}

export const addUser = async (email: string, password: string): Promise<boolean> => {
	const hash = await bcrypt.hash(password, 10)
	const stmt = db.prepare(`INSERT INTO users (email, password) VALUES (?, ?)`)
	const result = stmt.run(email, hash)
	return result.changes === 1
}