import mongoose from "mongoose";

export const getDatabaseUrl = () => {
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