import { db } from './db'

export const createTournament = async (uuid: string): Promise<boolean> => {
    const stmt = db.prepare(`INSERT INTO tournaments (uuid) VALUES (?)`);
    const result = stmt.run(uuid)
	return result.changes === 1
}