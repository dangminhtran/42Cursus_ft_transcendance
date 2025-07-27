import { FastifyInstance } from 'fastify';

export default async function chatRoutes(fastify: FastifyInstance) {
	// Lire tous les messages
	fastify.get('/read', async (request, reply) => {
		try {
			const messages = await fastify.readMessages();

			reply.code(200).send(messages);
		} catch (err) {
			request.log.error(err);
			reply.code(500).send({ error: 'Failed to read messages' });
		}
	});

	// Envoyer un message
	fastify.post('/send', async (request, reply) => {
		const { message, userId } = request.body as {
			message?: string;
			userId?: number;
		};

		if (!message || userId === undefined) {
			return reply.code(400).send({ error: 'Missing message or userId' });
		}

		const success = await fastify.addMessage(userId, message);

		if (success)
			return reply.code(201).send({ message: 'Message sent' });
		else
			return reply.code(500).send({ error: 'Failed to send message' });
	});
}
