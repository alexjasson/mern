import mongoose from 'mongoose';
import { getDatabaseUrl } from '../utils/getDatabaseUrl.js';

  // connect and test
export const connectDB = async () => {
  const { full, safe } = getDatabaseUrl();

  try {
    await mongoose.connect(full, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mDatabase:\x1b[0m \x1b[36mmongodb://${process.env.DATABASE_HOST}:\x1b[1m${process.env.DATABASE_PORT}\x1b[0m\x1b[36m/${process.env.DATABASE_NAME}\x1b[0m`);
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
}