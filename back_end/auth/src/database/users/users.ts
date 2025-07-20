
import { db, UpdateUser, User } from './index'
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

export const updateUser = async (email: string, password: string, data: UpdateUser) : Promise<boolean> => {
	const user: User | null = await getUserByEmail(email);
	if (user == null)
		return false;
	
	const match: boolean = await bcrypt.compare(password, user.password);
	if (!match)
		return false;
	
	const sets: string[] = []
	const values: any[] = []
	
	if (data.email) {
		sets.push('email = ?')
		values.push(data.email)
	}

	if (data.password) {
		const hash = await bcrypt.hash(data.password, 10)
		sets.push('password = ?')
		values.push(hash)
	}
	if (typeof data.is2FAEnabled === 'boolean') {
		sets.push('is2FAEnabled = ?')
		values.push(data.is2FAEnabled ? 1 : 0)
	}
	if (data.twoFASecret) {
		sets.push('twoFASecret = ?')
		values.push(data.twoFASecret)
	}

	if (sets.length === 0)
		return false;

	sets.push('updated_at = CURRENT_TIMESTAMP')

	const stmt = db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE email = ?`);
	values.push(email);
	const info = stmt.run(...values)

	return info.changes === 1;
}

export const update2FASecret = async (id: number, secret: string) : Promise<boolean> => {
	const stmt = db.prepare(`UPDATE users SET is2FAEnabled = 1, twoFASecret = ? WHERE id = ?`);
	const info = stmt.run(secret, id);
	return info.changes === 1;
}