import mongoose from 'mongoose';
import ora from 'ora';
import { getDatabaseUrl } from '../utils/getDatabaseUrl.js';

  // connect and test
export const connectDB = async () => {
  const { full, safe } = getDatabaseUrl();
  const spinner = ora({
    text: 'Attempting to connect to database…\n',
    spinner: 'dots',
  }).start();

  try {
    await mongoose.connect(full, { useNewUrlParser: true, useUnifiedTopology: true });
    spinner.stopAndPersist({
      symbol: '',
      text: `\x1b[32m➜\x1b[0m  \x1b[1mDatabase:\x1b[0m \x1b[36m${safe}\x1b[0m`
    });
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
};