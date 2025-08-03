import { FastifyInstance } from 'fastify';
import { User } from '../structs';

export default async function userManagmentRoutes(fastify: FastifyInstance) {

	// send post request to user/getUserByEmail with {"email": "MAIL"} as body
    fastify.post('/getUserByEmail', async (request, reply) => {
		const { email } = request.body as { email: string };
		const user: User | null = await fastify.getUserByEmail(email);

        if (!user)
            return reply.code(404).send({ error: 'No user identified by this Email.' });

		return user;
    });
	// send post request to user/getUserByID with {"userid": "x"} as body
    fastify.post('/getUserByID', async (request, reply) => {
        const { userid } = request.body as { userid: number };
		const user: User | null = await fastify.getUserByID(userid);

        if (!user)
            return reply.code(404).send({ error: 'No user identified by this ID.' });

		return user;
    });

	// send post request to user/update/:userid with json user info updated to update in Database
	fastify.post('/update/:userid', async (request: any, reply: any) => {
		const userid = request.params.userid;
		const { username, profilepicture, email, password, is2FAEnabled, twoFASecret } = request.body as { username:string, profilepicture: string, email: string, password: string, is2FAEnabled: number, twoFASecret: string};
		let updateduser: User = {
			username,
			id: userid,
			profilepicture,
			email,
			password,
			is2FAEnabled: is2FAEnabled == 1 ? true : false,
			twoFASecret,
			created_at: "",
			updated_at: ""
		};

		console.log(updateduser)

		const result: boolean = await fastify.updateUser(updateduser);
		if (!result)
			return reply.code(500).send({ error: 'Internal server error.' });
		
		return reply.code(200).send({ message: 'User updated.' });
	})

	fastify.post('/update2FASecret', async (request: any, reply: any) => {
		const { userid, twoFASecret } = request.body as { userid: number, twoFASecret: string};

		const result: boolean = await fastify.update2FASecret(userid, twoFASecret);
		if (!result)
			return reply.code(500).send({ error: 'Internal server error.' });

		return reply.code(200).send({ message: 'User twoFASecret was updated.' });
	})

	fastify.post('/update2FAEnabled', async (request: any, reply: any) => {
		const { userid } = request.body as { userid: number };

		const result: boolean = await fastify.update2FAEnabled(userid);
		if (!result)
			return reply.code(500).send({ error: 'Internal server error.' });

		return reply.code(200).send({ message: 'User twoFAEnable set to true' });
	})

	// get match history
	fastify.post('/matchHistory', async (request, reply) => {
		const { userid } = request.body as { userid: number };
		const history = await fastify.getResultsByUserID(userid);
		return history;
	});
}

