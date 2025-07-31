import fastifyFormbody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';
import { User } from '../structs';

export async function matchRoutes(fastify: FastifyInstance) {
	// -- GET User
	fastify.post('/addMatch', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		return "Hello world"
	});
}