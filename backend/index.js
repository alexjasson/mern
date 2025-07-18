import { connectDB } from './db/connectDB.js';
import { getServerUrl } from './utils/getServerUrl.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

// Setup the server
const app = express();
const { host, port } = getServerUrl();
app.use(cors({ origin: `${host}:${port}` }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Start the server
app.listen(port, async () => {
    await connectDB();
    console.log(`Server running at: http://${host}:${port}`);
});


