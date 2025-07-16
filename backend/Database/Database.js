import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config({ override: true, path: '../../.env', quiet: true });

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  // connect and test
  async connect() {
    if (this.client) return; // already connected

    const { full, safe } = makeUrls();

    this.client = new MongoClient(full);

    try {
      await this.client.connect();
      this.db = this.client.db(process.env.DATABASE_NAME);
      await this.db.admin().ping();
      console.log(`Connected to database: ${safe}`);
    } catch (err) {
      console.error('Error connecting to database:', err.message);
      process.exit(1);
    }
  }

  // close all connections
  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}

function makeUrls() {
  const {
    DATABASE_USER,
    DATABASE_PASSWORD = "",
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME
  } = process.env;

  // ensure required env vars exist (USER not required for local MongoDB without auth)
  const required = ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_NAME'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required database environment variables: ${missing.join(', ')}`);
  }

  const mask = '*'.repeat(DATABASE_PASSWORD.length);
  
  // For local MongoDB without authentication, use simple connection
  const full = DATABASE_PASSWORD 
    ? `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`
    : `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
  
  const safe = DATABASE_PASSWORD
    ? `mongodb://${DATABASE_USER}:${mask}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`
    : `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

  return { full, safe };
}

export default new Database();