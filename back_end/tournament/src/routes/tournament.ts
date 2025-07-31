import fastifyFormbody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';
import { Tournament, Match } from '../structs';
import { v4 as uuidv4 } from 'uuid';

export async function tournamentRoutes(fastify: FastifyInstance) {
	// -- GET User
	fastify.post('/create_tournament', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		return uuidv4();
	});
}