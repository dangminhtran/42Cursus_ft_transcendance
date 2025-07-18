import { FastifyInstance } from "fastify";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { User } from '../mock_db/db'; // 👈 interface uniquement


export default async function twoFARoutes(fastify: FastifyInstance) {


    // -- Générer secret 2FA et QR Code (protégé par JWT)
    fastify.post('/setup', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
        const userId = request.user.id;
        const user = fastify.db
            .prepare("SELECT * FROM users WHERE id = ?")
            .get(userId) as User | undefined;
        if (!user) return reply.code(404).send({ error: 'Utilisateur introuvable' });
        if (user.is2FAEnabled) return reply.code(400).send({ error: '2FA déjà activée' });
        
        const secret = speakeasy.generateSecret({
            name: `Transcendance (${user.email})`,
        });
        user.twoFASecret = secret.base32;
        fastify.db
            .prepare("UPDATE users SET twoFASecret = ?, is2FAEnabled = ? WHERE id = ?")
            .run(user.twoFASecret, user.is2FAEnabled ? 1 : 0, userId);
        
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
        const user = fastify.db
            .prepare("SELECT * FROM users WHERE id = ?")
            .get(userId) as User | undefined;
        if (!user || !user.twoFASecret) return reply.code(400).send({ error: 'Pas de secret 2FA trouvé' });
        
        const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token,
            window: 1,
        });
        
        if (!verified) return reply.code(400).send({ error: 'Code 2FA invalide' });
        
        user.is2FAEnabled = true;
        fastify.db
            .prepare("UPDATE users SET is2FAEnabled = 1 WHERE id = ?")
            .run(userId);
        
        return { success: true, message: '2FA activée' };
    });


    // -- Vérifier code 2FA à la connexion et délivrer JWT final
    fastify.post('/login', async (request, reply) => {
        const { userId, token } = request.body as { userId: string, token: string };
        const user = fastify.db
            .prepare("SELECT * FROM users WHERE id = ?")
            .get(userId) as User | undefined;
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

// import { FastifyInstance } from 'fastify';
// import speakeasy from 'speakeasy';
// import qrcode from 'qrcode';
// import { User } from '../mock_db/db'; // 👈 interface uniquement

// export default async function twoFARoutes(fastify: FastifyInstance) {
//   fastify.post('/setup', { preValidation: [fastify.authenticate] }, async (request: any, reply) => {
//     const userId = request.user.id;

//     // Récupérer l'utilisateur depuis SQLite
//     const stmt = fastify.db.prepare('SELECT * FROM users WHERE id = ?');
//     const user = stmt.get(userId) as User | undefined;

//     if (!user) return reply.code(404).send({ error: 'Utilisateur introuvable' });
//     if (user.is2FAEnabled) return reply.code(400).send({ error: '2FA déjà activée' });

//     const secret = speakeasy.generateSecret({
//       name: `Transcendance (${user.email})`,
//     });

//     // Mettre à jour le champ twoFASecret dans la BDD
//     const updateStmt = fastify.db.prepare(`
//       UPDATE users SET twoFASecret = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
//     `);
//     updateStmt.run(secret.base32, userId);

//     if (!secret.otpauth_url) {
//       return reply.code(500).send({ error: 'Impossible de générer le QR code' });
//     }

//     const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
//     return { qrCodeDataURL };
//   });
// }