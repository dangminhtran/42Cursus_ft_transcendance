import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

export interface User {
  id: string;
  email: string;
  password: string;
  is2FAEnabled: boolean;
  twoFASecret?: string;
}

// Plugin Fastify pour connecter la base de données SQLite
async function dbConnector(fastify: any, options: any) {
  // 📁 Fichier SQLite stocké sur le disque
  const dbFile = './transcendence.db';

  // 🔌 Connexion à la base SQLite (verbose → log toutes les requêtes SQL)
  const db = new Database(dbFile, { verbose: console.log });

  // 🧱 Création de la table "users" si elle n'existe pas déjà
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is2FAEnabled INTEGER NOT NULL DEFAULT 0,
      twoFASecret TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 🔧 Ajoute la base à l'objet Fastify → accessible via fastify.db
  fastify.decorate('db', db);

  // 🔒 Ferme la connexion proprement quand le serveur s’arrête
  fastify.addHook('onClose', (fastify: any, done: () => void) => {
    db.close();
    done();
  });

  console.log('✅ Base SQLite initialisée et table users prête.');
}

// 📦 Utilise fastify-plugin pour que Fastify gère bien l'ordre d'initialisation
export default fp(dbConnector);