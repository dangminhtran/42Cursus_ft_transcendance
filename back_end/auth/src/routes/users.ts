// ROUTE DE TEST NE RESTERA PAS ICI DANS LE PROJET FINAL

import { FastifyInstance } from 'fastify';
// import { usersDb } from "../mock_db/db";

export default async function userRoutes(fastify: FastifyInstance) {

    // -- GET User
    fastify.get('/profile', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
      const userId = request.user.id;
    
      const stmt = fastify.db.prepare(`
        SELECT id, email, is2FAEnabled FROM users WHERE id = ?
        `);

       const row = stmt.get(userId) as { id: string; email: string; is2FAEnabled: number } | undefined;
      
    if (!row) return reply.code(404).send({ error: 'Utilisateur introuvable' });

    return {
      id: row.id,
      email: row.email,
      is2FAEnabled: !!row.is2FAEnabled,
    };
  });
}