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
		const { profilepicture, email, password, is2FAEnabled, twoFASecret } = request.body as { profilepicture: string, email: string, password: string, is2FAEnabled: number, twoFASecret: string};
		let updateduser: User = {
			id: userid,
			profilepicture,
			// profilepicture: profilepicture || "https://res.cloudinary.com/demo/image/upload/default_avatar.png",  // Jack added this => set a defaulut URL if profilepicture empty ??
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


	// Jack added from here //////////////////////////////////////////////////
	// get all users
	fastify.get('/all', async (request, reply) => {
		const users: User[] = await fastify.getAllUsers();
		return users;
	});

	// delete user
	fastify.post('/delete', async (request, reply) => {
		const { userid } = request.body as { userid: number };
		const result: boolean = await fastify.deleteUser(userid);
		if (!result)
			return reply.code(500).send({ error: 'Internal server error.' });
		return reply.code(200).send({ message: 'User deleted.' });
	});

	// add friend
	fastify.post('/linkfriends', async (request, reply) => {
		const { userid, friendid } = request.body as { userid: number, friendid: number };
		const result: boolean = await fastify.linkFriends(userid, friendid);
		if (!result)
			return reply.code(500).send({ error: 'Internal server error.' });
		return reply.code(200).send({ message: 'Friends linked.' });
	});

	// remove friend
	fastify.post('/unlinkfriends', async (request, reply) => {
		const { userid, friendid } = request.body as { userid: number, friendid: number };
		const result: boolean = await fastify.unlinkFriends(userid, friendid);
		if (!result)
			return reply.code(500).send({ error: 'Internal server error.' });
		return reply.code(200).send({ message: 'Friends unlinked.' });
	});

	// UNIQUE contraint for db ?  =>  ALTER TABLE users ADD CONSTRAINT unique_displayname UNIQUE (displayname);
	// helper for display name uniqueness
	fastify.post('/checkDisplayName', async (request, reply) => {
		const { displayname } = request.body as { displayname: string };
		const exists = await fastify.getUserByDisplayName(displayname);
		return { exists: !!exists };
	});

	// set/update display name
	fastify.post('/setDisplayName', async (request, reply) => {
		const { userid, displayname } = request.body as { userid: number, displayname: string };
		const exists = await fastify.getUserByDisplayName(displayname);
		if (exists)
			return reply.code(409).send({ error: 'Display name already taken.' });

		const result = await fastify.updateDisplayName(userid, displayname);
		if (!result)
			return reply.code(500).send({ error: 'Internal server error.' });
		return reply.code(200).send({ message: 'Display name updated.' });
	});

	// get friends & online status
	fastify.post('/friends', async (request, reply) => {
		const { userid } = request.body as { userid: number };
		const friends = await fastify.getFriendsWithStatus(userid);
		return friends;
	});

	// get user stats
	fastify.post('/stats', async (request, reply) => {
		const { userid } = request.body as { userid: number };
		const stats = await fastify.getUserStats(userid);
		return stats;
	});

	// get match history
	fastify.post('/matchHistory', async (request, reply) => {
		const { userid } = request.body as { userid: number };
		const history = await fastify.getResultsByUserID(userid);
		return history;
	});
}

async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Set in Cloudinary dashboard

    const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    return data.secure_url; // This is the CDN URL for the image
}
// TO HERE ////////////////////////////////////////////////////////////////////
