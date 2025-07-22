import mongoose from "mongoose";
import { getDatabaseUrl } from "../utils/getDatabaseUrl.js";
import dotenv from 'dotenv';

dotenv.config({ override: true, path: '../.env', quiet: true });

const { full: DB_URL } = getDatabaseUrl();

const resetDb = async () => {
  try {
    await mongoose.connect(DB_URL);
    await mongoose.connection.db.dropDatabase();
    console.log("Database dropped successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

resetDb();