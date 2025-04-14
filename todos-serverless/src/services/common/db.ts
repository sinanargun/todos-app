import { Pool } from "pg";

class Database {
  private static instance: Pool;

  private constructor() {}

  public static getInstance(): Pool {
    if (!Database.instance) {
      console.log("Initializing new DB connection...");
      Database.instance = new Pool({
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        port: Number(process.env.DB_PORT) || 5432,
        ssl: {
          rejectUnauthorized: false,
          ca: process.env.DB_CA,
         }
      });
    }
    return Database.instance;
  }
}

export default Database;

