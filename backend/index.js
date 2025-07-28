import { connectDB } from './db/connectDB.js';
import { getServerUrl } from './utils/getServerUrl.js';
import { serverLog } from './middleware/serverLog.js';
import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

// Setup the server
const app = express();
const { host, port } = getServerUrl();
app.use(serverLog);
app.use(cors({ origin: `${host}:${port}` }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);

// Start the server
app.listen(port, async () => {
    await connectDB();
    console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mServer:\x1b[0m   \x1b[36mhttp://${host}:\x1b[1m${port}\x1b[0m\x1b[36m/\x1b[0m`);
});
