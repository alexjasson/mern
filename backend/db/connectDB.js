import mongoose from 'mongoose';
import { getDatabaseUrl } from '../utils/getDatabaseUrl.js';

  // connect and test
export const connectDB = async () => {
  const { full, safe } = getDatabaseUrl();

  try {
    await mongoose.connect(full, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to database: ${safe}`);
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
}