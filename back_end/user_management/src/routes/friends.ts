import { FastifyInstance } from 'fastify';
import { Friend, FriendWinRate, User } from '../structs';

export async function friendRoutes(fastify: FastifyInstance) {

    fastify.post('/add', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
        const { email } = request.body as { email: string };

        const userid = request.user.id;
        const user: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email });

        console.log("ho ca chie ? ", user, email);
        if (!user)
            return reply.code(404).send({ error: 'Utilisateur introuvable' });


		let alreadyfriend: boolean = false;
		const friends: FriendWinRate[] = await fastify.dbClient.post<FriendWinRate[]>('/friends/fetch', { user_id: userid });
		friends.forEach((friend) => {
			if (friend.email == user.email)
			{
				alreadyfriend = true;
			}
		});

		if (alreadyfriend)
			return reply.code(500).send({ error: "Can't add friend." });

        const result: boolean = await fastify.dbClient.post<boolean>('/friends/add', { user_id: userid, friend_id: friend_id });

        if (!result)
            return reply.code(500).send({ error: "Can't add friend." });
        return reply.code(200).send({ message: "Friend added." });
    });

    fastify.post('/delete', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
        const { friend_id } = request.body as { friend_id: number };

        const userid = request.user.id;
        const user: User | null = await fastify.dbClient.post<User>('/user/getUserByID', { userid });

        if (!user)
            return reply.code(404).send({ error: 'Utilisateur introuvable' });

        const result: boolean = await fastify.dbClient.post<boolean>('/friends/delete', { user_id: userid, friend_id: friend_id });
        if (!result)
            return reply.code(500).send({ error: "Can't delete friend." });
        return reply.code(200).send({ message: "Friend deleted." });
    });

    fastify.post('/fetch', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
        const userid = request.user.id;
        const user: User | null = await fastify.dbClient.post<User>('/user/getUserByID', { userid });

        if (!user)
            return reply.code(404).send({ error: 'Utilisateur introuvable' });

        const result: Friend[] = await fastify.dbClient.post<Friend[]>('/friends/fetch', { user_id: userid });

        return reply.code(200).send(result);
    });

}