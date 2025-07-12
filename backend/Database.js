import pg from "pg";
const { Pool } = pg;

class Database {
  constructor() {
    this.pool = null;
  }

  // build the connection string, mask password for logging
  _makeUrls() {
    const {
      DATABASE_USER,
      DATABASE_PASSWORD = "",
      DATABASE_HOST,
      DATABASE_PORT,
      DATABASE_NAME,
      NODE_ENV
    } = process.env;

    // Check required environment variables
    const required = ['DATABASE_USER', 'DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_NAME'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required database environment variables: ${missing.join(', ')}`);
    }

    const mask = '*'.repeat(DATABASE_PASSWORD.length);
    const full = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}` +
                 `@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
    const safe = `postgresql://${DATABASE_USER}:${mask}` +
                 `@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

    return { full, safe, ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false };
  }

  // connect and test
  async connect() {
    if (this.pool) return;  // already connected

    const { full, safe, ssl } = this._makeUrls();
    this.pool = new Pool({ connectionString: full, ssl });

    try {
      await this.pool.query('SELECT NOW()');
      console.log(`Connected to database: ${safe}`);
    } catch (err) {
      console.error('Error connecting to database:', err.message);
      process.exit(1);
    }
  }

  // close all connections
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

export default new Database();