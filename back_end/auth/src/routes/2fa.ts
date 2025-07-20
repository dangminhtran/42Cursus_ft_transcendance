import { FastifyInstance } from "fastify";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';


export default async function twoFARoutes(fastify: FastifyInstance) {

    // -- Générer secret 2FA et QR Code (protégé par JWT)
    fastify.post('/setup', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
        const userId = request.user.id;
		console.log(request.user)
        const user = await fastify.getUserByID(userId);

        if (!user) return reply.code(404).send({ error: 'Utilisateur introuvable' });
        if (user.is2FAEnabled) return reply.code(400).send({ error: '2FA déjà activée' });
        
        const secret = speakeasy.generateSecret({
            name: `Transcendance (${user.email})`,
        });
        user.twoFASecret = secret.base32;
		console.log(secret.base32)
        fastify.update2FASecret(user.id, secret.base32);
        
        if (!secret.otpauth_url) {
            return reply.code(500).send({ error: 'Impossible de générer le QR code' });
        }
        // Générer QR code en dataURL
        const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
        
        return { qrCodeDataURL };
    });


    // -- Vérifier le code 2FA lors setup (protégé par JWT)
    fastify.post('/verify-setup', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
        const userId = request.user.id;
        const { token } = request.body as { token: string };
        const user = await fastify.getUserByID(userId);
        if (!user || !user.twoFASecret) return reply.code(400).send({ error: 'Pas de secret 2FA trouvé' });
        
        const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token,
            window: 1,
        });
        
        if (!verified) return reply.code(400).send({ error: 'Code 2FA invalide' });
        
        user.is2FAEnabled = true;
        // usersDb.set(userId, user);
        
        return { success: true, message: '2FA activée' };
    });


    // -- Vérifier code 2FA à la connexion et délivrer JWT final
    fastify.post('/login', async (request, reply) => {
        const { userId, token } = request.body as { userId: number, token: string };
        const user = await fastify.getUserByID(userId);
        if (!user || !user.twoFASecret) return reply.code(400).send({ error: 'Utilisateur ou 2FA secret introuvable' });
        
        const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token,
            window: 1,
        });
        
        if (!verified) return reply.code(401).send({ error: 'Code 2FA invalide' });
        
        // Délivrer JWT
        const jwtToken = fastify.jwt.sign({ id: user.id, email: user.email });
        return { token: jwtToken };
    });
}