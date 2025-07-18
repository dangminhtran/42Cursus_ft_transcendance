import fp from "fastify-plugin";
import Database from "better-sqlite3";

async function dbConnector(fastify : any, options : any) {
  const dbFile = "./transcendence.db";
  const db = new Database(dbFile, { verbose: console.log });

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  fastify.decorate("db", db);

  fastify.addHook("onClose", (fastify : any, done : any) => {
    db.close();
    done();
  });

  console.log("Database and posts table created successfully");
}

export default fp(dbConnector);

