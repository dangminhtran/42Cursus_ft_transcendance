// ROUTE DE TEST NE RESTERA PAS ICI DANS LE PROJET FINAL

import fastifyFormbody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';
import { User } from '../structs';

export async function userRoutes(fastify: FastifyInstance) {
    // -- GET User
    fastify.get('/profile', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
		const userEmail = request.user.email;
		console.log(request.user)
		const user: User | null = await fastify.getUserByEmail(userEmail);
	  
		if (!user)
			return reply.code(404).send({ error: 'Utilisateur introuvable' });
		return {
			id:           user.id,
			email:        user.email,
			is2FAEnabled: user.is2FAEnabled
		};
    });
}