import fastifyFormbody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';
import { User } from '../structs';
import bcrypt from 'bcrypt'

export async function userRoutes(fastify: FastifyInstance) {
	// -- GET User
	fastify.post('/profile', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		const { email } = request.body as { email: string };
		const user: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email });

		if (!user)
			return reply.code(404).send({ error: 'Utilisateur introuvable' });
		return {
			id:           user.id,
			email:        user.email,
			is2FAEnabled: user.is2FAEnabled,
			profilepicture: user.profilepicture
		};
	});

	fastify.post('/update', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		const {
			username,
			profilepicture,
			email,
			password,
			is2FAEnabled } = request.body as 
			{ username: string, profilepicture: string, email: string, password: string, is2FAEnabled: number };

		const emailidentifier = request.user.email;
		console.log(email);
		const user: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email: emailidentifier });

		if (!user)
			return reply.code(404).send({ error: 'Utilisateur introuvable' });
		if (profilepicture)
			user.profilepicture = profilepicture;
		if (username)
			user.username = username;
		if (email)
			user.email = email;
		if (password)
			user.password = await bcrypt.hash(password, 10);
		if (is2FAEnabled)
			user.is2FAEnabled = is2FAEnabled == 1 ? true : false;

		const result = await fastify.dbClient.post<boolean>(`/user/update/${user.id}`, {...user});
		
		if (!result)
			return reply.code(500).send({ error: 'Internal Server Error' });

		return reply.code(200).send({ message: 'User updated' });
	});
}