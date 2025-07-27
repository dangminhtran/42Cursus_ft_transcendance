
import { UpdateUser, User } from '../structs'
import { db } from './db'
import bcrypt from 'bcrypt'

export const getUserByEmail = async (email: string): Promise<User | null> => {
	const stmt = db.prepare(`
		SELECT 
		id, profilepicture, email, password, is2FAEnabled, twoFASecret, created_at, updated_at
		FROM users
		WHERE email = ?
	`)
	const row = stmt.get(email)
	return (row as User) || null
}

export const getUserByID = async (id: number): Promise<User | null> => {
	const stmt = db.prepare(`
		SELECT 
		id, profilepicture, email, password, is2FAEnabled, twoFASecret, created_at, updated_at
		FROM users
		WHERE id = ?
	`)
	const row = stmt.get(id)
	console.log(row)
	return (row as User) || null
}

export const addUser = async (email: string, password: string): Promise<boolean> => {
	const stmt = db.prepare(`INSERT INTO users (email, password) VALUES (?, ?)`)
	const result = stmt.run(email, password)
	return result.changes === 1
}

export const deleteUser = async (email: string, password: string): Promise<boolean> => {
	const user: User | null = await getUserByEmail(email);
	if (user == null)
		return false;

	const match: boolean = await bcrypt.compare(password, user.password);
	if (!match)
		return false;
	const stmt = db.prepare(`DELETE FROM users WHERE email = (?)`);
	const result = stmt.run(email);
	return result.changes === 1;
}

export const updateUser = async (user: User) : Promise<boolean> => {
	const stmt = db.prepare(
		`UPDATE users SET 
		profilepicture = ?,
		email = ?,
		password = ?,
		is2FAEnabled = ?,
		twoFASecret = ?
		WHERE id = ?`);
	
	const info = stmt.run(user.profilepicture, user.email, user.password, user.is2FAEnabled ? 1 : 0, user.twoFASecret, user.id)
	
	console.log(info)
	
	return info.changes === 1;
}