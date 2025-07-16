// ROUTE DE TEST NE RESTERA PAS ICI DANS LE PROJET FINAL

import { FastifyInstance } from 'fastify';
import { usersDb } from "../mock_db/db";

export default async function userRoutes(fastify: FastifyInstance) {

    // -- GET User
    fastify.get('/profile', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
      const userId = request.user.id;
      const user = usersDb.get(userId);
      if (!user) return reply.code(404).send({ error: 'Utilisateur introuvable' });

      return { id: user.id, email: user.email, is2FAEnabled: user.is2FAEnabled };
    });
}