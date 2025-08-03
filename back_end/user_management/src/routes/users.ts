import fastifyFormbody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';
import { User } from '../structs';
import bcrypt from 'bcrypt'

export async function userRoutes(fastify: FastifyInstance) {
	// -- GET User
	fastify.post('/profile', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		const email = request.user.email
		console.log('email ?', email)
		const user: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email });
		console.log(user)
		if (!user)
			return reply.code(404).send({ error: 'Utilisateur introuvable' });
		return {
			id:           user.id,
			username:     user.username,
			email:        user.email,
			is2FAEnabled: user.is2FAEnabled,
			profilepicture: user.profilepicture,
			created_at: user.created_at
		};
	});

	fastify.post('/update', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		const {
			username,
			profilepicture,
			email,
			oldPassword,
			newPassword,
			is2FAEnabled } = request.body as 
			{ username: string, profilepicture: string, email: string, newPassword: string, oldPassword: string, is2FAEnabled: number };

		console.log('request.body', request.body)
		console.log("profile picture en back end", profilepicture)
		const emailidentifier = request.user.email;
		const user: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email: emailidentifier });

		if (!user)
			return reply.code(404).send({ error: 'Utilisateur introuvable' });
		if (profilepicture)
			user.profilepicture = profilepicture;
		if (username)
			user.username = username;
		if (email)
			user.email = email;
		if (newPassword && oldPassword)
		{
			const match = await bcrypt.compare(oldPassword, user.password);
			if (!match)
				return reply.code(404).send({ error: 'Invalid password' });
			user.password = await bcrypt.hash(newPassword, 10);
		}
		if (is2FAEnabled)
			user.is2FAEnabled = is2FAEnabled == 1 ? true : false;
		console.log('user in back', user)
		const result = await fastify.dbClient.post<boolean>(`/user/update/${user.id}`, {...user});
		
		if (!result)
			return reply.code(500).send({ error: 'Internal Server Error' });

		return reply.code(200).send({ message: 'User updated' });
	});
}